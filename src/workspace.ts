import { getSessionUid, unauthorizedResponse } from './auth';
import { getPrisma, getRedis, DbEnv } from './db';

interface WorkspaceEnv extends DbEnv {
  GEMINI_API_KEY?: string;
}

type PrismaClientType = ReturnType<typeof getPrisma>;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function badRequest(message: string): Response {
  return jsonResponse({ error: message, code: 'BAD_REQUEST' }, 400);
}

function notFound(): Response {
  return jsonResponse({ error: 'Draft not found', code: 'NOT_FOUND' }, 404);
}

async function upsertUser(prisma: PrismaClientType, uid: string): Promise<void> {
  // Check if user exists first to avoid unnecessary transactions
  const user = await prisma.user.findUnique({ where: { id: uid } });
  if (user) return;

  await prisma.user.create({
    data: { id: uid },
  });
}

function autosaveKey(uid: string, draftId: string): string {
  return `autosave:${uid}:${draftId}`;
}

export async function handleWorkspaceApi(
  request: Request,
  env: WorkspaceEnv,
  url: URL,
): Promise<Response> {
  const uid = getSessionUid(request);
  if (!uid) return unauthorizedResponse();

  const prisma = getPrisma(env);
  const pathname = url.pathname;

  // GET /api/workspace/drafts
  if (request.method === 'GET' && pathname === '/api/workspace/drafts') {
    try {
      console.log('[workspace] GET drafts for uid:', uid);
      await upsertUser(prisma, uid);
      console.log('[workspace] upsertUser done');
      const statusFilter = url.searchParams.get('status');
      const where: { userId: string; status?: string } = { userId: uid };
      if (statusFilter === 'draft' || statusFilter === 'final') {
        where.status = statusFilter;
      }
      console.log('[workspace] findMany where:', JSON.stringify(where));
      const drafts = await prisma.draft.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          title: true,
          type: true,
          style: true,
          status: true,
          topic: true,
          tags: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      console.log('[workspace] found drafts:', drafts.length);
      return jsonResponse({ drafts });
    } catch (e) {
      console.error('[workspace] GET drafts error:', e);
      return jsonResponse({ error: String(e), code: 'SERVER_ERROR' }, 500);
    }
  }

  // POST /api/workspace/drafts
  if (request.method === 'POST' && pathname === '/api/workspace/drafts') {
    console.log('[workspace] POST draft for uid:', uid);
    await upsertUser(prisma, uid);
    let body: Record<string, unknown>;
    try {
      body = await request.json() as Record<string, unknown>;
    } catch {
      return badRequest('Invalid JSON body');
    }
    const { title, content, type, style, topic } = body;
    if (!title || !content || !type || !topic) {
      return badRequest('Missing required fields: title, content, type, topic');
    }
    const draft = await prisma.draft.create({
      data: {
        userId: uid,
        title: String(title).slice(0, 500),
        content: String(content),
        type: String(type),
        style: String(style ?? ''),
        topic: String(topic).slice(0, 1000),
        tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
        status: body.status === 'final' ? 'final' : 'draft',
      },
    });
    console.log('[workspace] draft created:', draft.id);
    return jsonResponse({ draft }, 201);
  }

  // Routes with :id — extract draft ID from path
  const idMatch = pathname.match(/^\/api\/workspace\/drafts\/([^/]+)(\/autosave)?$/);
  if (!idMatch) {
    return jsonResponse({ error: 'Not found', code: 'NOT_FOUND' }, 404);
  }
  const draftId = idMatch[1];
  const isAutosave = !!idMatch[2];

  // POST /api/workspace/drafts/:id/autosave
  if (request.method === 'POST' && isAutosave) {
    let body: Record<string, unknown>;
    try {
      body = await request.json() as Record<string, unknown>;
    } catch {
      return badRequest('Invalid JSON body');
    }
    const content = String(body.content ?? '');
    const title = body.title ? String(body.title).slice(0, 500) : undefined;
    try {
      const redis = await getRedis(env);
      const payload = JSON.stringify({ content, title, ts: Date.now() });
      await redis.set(autosaveKey(uid, draftId), payload, { EX: 3600 });
    } catch (e) {
      console.warn('Redis autosave failed, degrading gracefully:', e);
    }
    return jsonResponse({ ok: true, buffered: true });
  }

  // GET /api/workspace/drafts/:id
  if (request.method === 'GET' && !isAutosave) {
    const draft = await prisma.draft.findFirst({ where: { id: draftId, userId: uid } });
    if (!draft) return notFound();

    let pendingAutosave = false;
    let autosaveTs: number | null = null;
    try {
      const redis = await getRedis(env);
      const buffered = await redis.get(autosaveKey(uid, draftId));
      if (buffered) {
        const parsed = JSON.parse(buffered) as { ts: number };
        pendingAutosave = true;
        autosaveTs = parsed.ts;
      }
    } catch {
      // Redis unavailable — ignore
    }
    return jsonResponse({ draft, pendingAutosave, autosaveTs });
  }

  // PATCH /api/workspace/drafts/:id
  if (request.method === 'PATCH' && !isAutosave) {
    const existing = await prisma.draft.findFirst({ where: { id: draftId, userId: uid } });
    if (!existing) return notFound();

    let body: Record<string, unknown>;
    try {
      body = await request.json() as Record<string, unknown>;
    } catch {
      return badRequest('Invalid JSON body');
    }

    // Merge buffered autosave content into the update if present
    let mergedContent = body.content !== undefined ? String(body.content) : undefined;
    let mergedTitle = body.title !== undefined ? String(body.title).slice(0, 500) : undefined;
    try {
      const redis = await getRedis(env);
      const buffered = await redis.get(autosaveKey(uid, draftId));
      if (buffered) {
        const parsed = JSON.parse(buffered) as { content?: string; title?: string };
        if (mergedContent === undefined && parsed.content) mergedContent = parsed.content;
        if (mergedTitle === undefined && parsed.title) mergedTitle = parsed.title;
        await redis.del(autosaveKey(uid, draftId));
      }
    } catch {
      // Redis unavailable — proceed with body values only
    }

    const updateData: {
      title?: string;
      content?: string;
      status?: string;
      updatedAt?: Date;
    } = { updatedAt: new Date() };
    if (mergedTitle !== undefined) updateData.title = mergedTitle;
    if (mergedContent !== undefined) updateData.content = mergedContent;
    if (body.status === 'draft' || body.status === 'final') updateData.status = body.status;

    const draft = await prisma.draft.update({ where: { id: draftId }, data: updateData });
    return jsonResponse({ draft });
  }

  // DELETE /api/workspace/drafts/:id
  if (request.method === 'DELETE' && !isAutosave) {
    const existing = await prisma.draft.findFirst({ where: { id: draftId, userId: uid } });
    if (!existing) return notFound();
    await prisma.draft.delete({ where: { id: draftId } });
    try {
      const redis = await getRedis(env);
      await redis.del(autosaveKey(uid, draftId));
    } catch {
      // ignore
    }
    return jsonResponse({ ok: true });
  }

  return jsonResponse({ error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' }, 405);
}
