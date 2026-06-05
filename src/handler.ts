import { generateArticle, generateNovelOutline, generateShortStory, generateNews, generateShortNews, testGeminiAPIKey, generateChapterContent } from './gemini';
import { generateMainPageHTML, generateSettingsPageHTML, generateAuthPageHTML, generateAboutPageHTML } from './ui';
import { generateWorkspacePageHTML } from './ui/workspace';
import { getSessionUid, unauthorizedResponse } from './auth';
import { getPrisma, getRedis, DbEnv } from './db';
import { handleWorkspaceApi } from './workspace';

export interface GenerateRequest {
  topic: string;
  tags?: string[];
  keywords?: string[];
  authorStyle: string;
  type: 'article' | 'shortstory' | 'novel' | 'news' | 'shortnews';
  newspaperStyle?: string;
  chapterCount?: number;
  language: 'english' | 'indonesian';
  mainIdea?: string;
  // Back-compat: legacy clients send the key in the body. New clients use the
  // `X-User-API-Key` header (see resolveUserApiKey).
  apiKey?: string;
}

// ============================================================
// BYOK (Bring Your Own Key) helpers
// ============================================================
// Resolution order:
//   1. `X-User-API-Key` request header  (preferred — keeps body for content)
//   2. `apiKey` field on the JSON body   (legacy / convenience)
//   3. `env.GEMINI_API_KEY`              (self-hosted server default, opt-in)
//
// In strict BYOK mode (no `env.GEMINI_API_KEY` set) every visitor must provide
// their own key. The key is used once for the outbound Gemini call and never
// logged, persisted, or reflected back to the client.
function resolveUserApiKey(
  request: Request,
  env: { GEMINI_API_KEY?: string },
  bodyKey?: string,
): string | undefined {
  const headerKey = request.headers.get('X-User-API-Key')?.trim();
  if (headerKey) return headerKey;
  if (bodyKey && bodyKey.trim()) return bodyKey.trim();
  if (env.GEMINI_API_KEY && env.GEMINI_API_KEY.trim()) return env.GEMINI_API_KEY.trim();
  return undefined;
}

function byokRequiredResponse(): Response {
  return new Response(
    JSON.stringify({
      error: 'BYOK: A Gemini API key is required. Add yours in Settings to continue.',
      code: 'BYOK_KEY_REQUIRED',
    }),
    {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    },
  );
}

function jsonResponse(body: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...extraHeaders,
    },
  });
}

export interface ArticleResponse {
  refinedTags: string[];
  titleSelection: string[];
  subtitleSelection: string[];
  content: string;
}

export interface NovelResponse {
  titleSelection: string[];
  synopsis: string;
  outline: Array<{
    chapterNumber: number;
    title: string;
    subtitle: string;
  }>;
}


export async function handleRequest(request: Request, env: { GEMINI_API_KEY?: string; DATABASE_URL: string; REDIS_URL: string }): Promise<Response> {
  // Handle CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-API-Key',
      },
    });
  }

  const url = new URL(request.url);

  // --- Auth: persist session (UID in signed cookie) ---
  if (request.method === 'POST' && url.pathname === '/api/auth/session') {
    try {
      const body = await request.json() as { idToken?: string; uid?: string };
      if (!body.uid || !/^[a-zA-Z0-9_-]{6,128}$/.test(body.uid)) {
        return jsonResponse({ error: 'Invalid uid' }, 400);
      }
      // Note: we don't gate any BYOK endpoint on this cookie. It is purely a
      // UX hint so the server can greet the user. The actual BYOK key lives
      // only in the browser.
      const cookie = `quill_uid=${encodeURIComponent(body.uid)}; Path=/; Max-Age=2592000; SameSite=Lax; HttpOnly`;
      return new Response(JSON.stringify({ ok: true, uid: body.uid }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Set-Cookie': cookie,
        },
      });
    } catch (e) {
      return jsonResponse({ error: 'Bad request' }, 400);
    }
  }

  if (request.method === 'DELETE' && url.pathname === '/api/auth/session') {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Set-Cookie': 'quill_uid=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly',
      },
    });
  }

  if (request.method === 'POST' && url.pathname === '/api/auth/signout') {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Set-Cookie': 'quill_uid=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly',
      },
    });
  }

  // Workspace API — authenticated routes for draft management
  if (url.pathname.startsWith('/api/workspace')) {
    return handleWorkspaceApi(request, env, url);
  }

  // Serve static files
  if (request.method === 'GET' && new URL(request.url).pathname !== '/api/generate') {
    return serveStatic(request, env);
  }

  // Handle API requests
  if (request.method === 'POST' && new URL(request.url).pathname === '/api/generate-chapter') {
    try {
      const body: {
        chapterNumber: number;
        chapterTitle: string;
        chapterSubtitle: string;
        novelTitle: string;
        novelSynopsis: string;
        previousChapters?: Array<{
          chapterNumber: number;
          title: string;
          content: string;
          keyEvents?: string[];
        }>;
      } = await request.json();

      const apiKey = resolveUserApiKey(request, env);
      if (!apiKey) {
        return byokRequiredResponse();
      }

      return new Response(streamChapterGeneration({
        chapterNumber: body.chapterNumber,
        chapterTitle: body.chapterTitle,
        chapterSubtitle: body.chapterSubtitle,
        novelTitle: body.novelTitle,
        novelSynopsis: body.novelSynopsis,
        previousChapters: body.previousChapters
      }, apiKey), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache',
        },
      });
    } catch (error) {
      console.error('Chapter generation error:', error);
      return jsonResponse({
        error: 'Chapter generation failed: ' + ((error as Error).message || 'unknown'),
      }, 500);
    }
  }



  if (request.method === 'POST' && new URL(request.url).pathname === '/api/test-key') {
    try {
      const body: { apiKey: string } = await request.json();

      if (!body.apiKey) {
        return new Response(JSON.stringify({ error: 'API key is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      // Test the API key with a simple request
      try {
        const isValid = await withDeadline(testGeminiAPIKey(body.apiKey), 30_000);

        if (!isValid) {
          return new Response(JSON.stringify({
            error: 'Invalid API key or API access denied',
            details: 'Please check that your API key is correct and has access to Gemini API'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          });
        }
      } catch (testError) {
        const msg = (testError as Error).message;
        const isTimeout = msg === 'GENERATION_TIMEOUT';
        return new Response(JSON.stringify({
          error: isTimeout
            ? 'API key test timed out. Please check your network or try a different key.'
            : 'API key test failed',
          details: isTimeout ? 'Timeout after 30s' : msg
        }), {
          status: isTimeout ? 504 : 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      return new Response(JSON.stringify({ success: true, message: 'API key is valid' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    } catch (error) {
      console.error('API key test error:', error);
      return new Response(JSON.stringify({
        error: (error as Error).message || 'Invalid API key',
        details: 'Check that your API key is valid and has the correct permissions for Gemini API'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  }

  if (request.method === 'POST' && new URL(request.url).pathname === '/api/export-chapter-rtf') {
    try {
      const body: {
        chapterNumber: number;
        chapterTitle: string;
        chapterSubtitle: string;
        content: string;
      } = await request.json();

      if (!body.chapterTitle || !body.content) {
        return new Response(JSON.stringify({ error: 'Chapter title and content are required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      const rtfContent = generateChapterRTF(body.chapterNumber, body.chapterTitle, body.chapterSubtitle, body.content);

      const filename = `${body.chapterTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_chapter_${body.chapterNumber}.rtf`;

      return new Response(rtfContent, {
        status: 200,
        headers: {
          'Content-Type': 'application/rtf',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      console.error('Chapter RTF export error:', error);
      return new Response(JSON.stringify({ error: 'Chapter RTF export failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  }

  if (request.method === 'POST' && new URL(request.url).pathname === '/api/export-rtf') {
    try {
      const body: {
        title: string;
        subtitle?: string;
        content: string;
      } = await request.json();

      if (!body.title || !body.content) {
        return new Response(JSON.stringify({ error: 'Title and content are required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      const rtfContent = generateRTF(body.title, body.subtitle || '', body.content);

      return new Response(rtfContent, {
        status: 200,
        headers: {
          'Content-Type': 'application/rtf',
          'Content-Disposition': `attachment; filename="${body.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.rtf"`,
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      console.error('RTF export error:', error);
      return new Response(JSON.stringify({ error: 'RTF export failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  }

  if (request.method === 'POST' && new URL(request.url).pathname === '/api/generate') {
    try {
      const body: GenerateRequest = await request.json();

      // Validate required fields
      if (!body.topic || !body.authorStyle || !body.type || !body.language) {
        return new Response(JSON.stringify({ error: 'Missing required fields: topic, authorStyle, type, language' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      if (body.type === 'novel' && !body.chapterCount) {
        return new Response(JSON.stringify({ error: 'chapterCount is required for novel type' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      const apiKey = resolveUserApiKey(request, env);
      if (!apiKey) {
        return byokRequiredResponse();
      }

      return new Response(streamGeneration(body, apiKey), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache',
        },
      });
    } catch (error) {
      console.error('Error processing request:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  }

  return new Response('Not Found', { status: 404 });
}

async function withDeadline<T>(p: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Request timed out')), ms);
  });
  try {
    return await Promise.race([p, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

// Streaming generation: returns a ReadableStream that emits periodic heartbeats
// (single space bytes) while the model is generating, then sends the final JSON
// result. The heartbeats keep the Cloudflare edge connection alive and prevent
// the 100s tunnel timeout (524). The client just reads the body as a single
// JSON payload — leading whitespace is valid in JSON.
function streamGeneration(body: GenerateRequest, apiKey: string): ReadableStream<Uint8Array> {
  const enc = new TextEncoder();
  let closed = false;
  return new ReadableStream({
    async start(controller) {
      const safeEnqueue = (chunk: Uint8Array) => {
        if (closed) return;
        try { controller.enqueue(chunk); } catch (_) { closed = true; }
      };
      const heartbeat = setInterval(() => safeEnqueue(enc.encode(' ')), 5_000);
      const onChunk = () => safeEnqueue(enc.encode(' '));
      try {
        let result: any;
        if (body.type === 'article') {
          result = await generateArticle(body, apiKey, onChunk);
        } else if (body.type === 'shortstory') {
          result = await generateShortStory(body, apiKey, onChunk);
        } else if (body.type === 'news') {
          result = await generateNews(body, apiKey, onChunk);
        } else if (body.type === 'shortnews') {
          result = await generateShortNews(body, apiKey, onChunk);
        } else {
          result = await generateNovelOutline(body, apiKey, onChunk);
        }
        safeEnqueue(enc.encode(JSON.stringify(result)));
      } catch (err) {
        const message = (err as Error).message || 'Generation failed';
        console.error('Streaming generation error:', err);
        safeEnqueue(enc.encode(JSON.stringify({
          error: message,
          code: 'GENERATION_ERROR',
        })));
      } finally {
        clearInterval(heartbeat);
        closed = true;
        try { controller.close(); } catch (_) {}
      }
    },
    cancel() { closed = true; },
  });
}

function streamChapterGeneration(
  chapter: {
    chapterNumber: number;
    chapterTitle: string;
    chapterSubtitle: string;
    novelTitle: string;
    novelSynopsis: string;
    previousChapters?: Array<{ chapterNumber: number; title: string; content: string; keyEvents?: string[] }>;
  },
  apiKey: string,
): ReadableStream<Uint8Array> {
  const enc = new TextEncoder();
  let closed = false;
  return new ReadableStream({
    async start(controller) {
      const safeEnqueue = (chunk: Uint8Array) => {
        if (closed) return;
        try { controller.enqueue(chunk); } catch (_) { closed = true; }
      };
      const heartbeat = setInterval(() => safeEnqueue(enc.encode(' ')), 5_000);
      const onChunk = () => safeEnqueue(enc.encode(' '));
      try {
        const content = await generateChapterContent(chapter, apiKey, onChunk);
        safeEnqueue(enc.encode(JSON.stringify({ content })));
      } catch (err) {
        console.error('Chapter streaming error:', err);
        safeEnqueue(enc.encode(JSON.stringify({
          error: (err as Error).message || 'Chapter generation failed',
        })));
      } finally {
        clearInterval(heartbeat);
        closed = true;
        try { controller.close(); } catch (_) {}
      }
    },
    cancel() { closed = true; },
  });
}

function generateChapterRTF(chapterNumber: number, chapterTitle: string, chapterSubtitle: string, content: string): string {
  // RTF header with basic formatting
  let rtf = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0\\fnil\\fcharset0 Arial;}{\\f1\\fnil\\fcharset0 Times New Roman;}}
{\\colortbl;\\red0\\green0\\blue0;\\red128\\green128\\blue128;}
\\viewkind4\\uc1\\pard\\lang1033\\f0\\fs24
`;

  // Add chapter header (large, bold, centered)
  rtf += `\\qc\\b\\fs36 Chapter ${chapterNumber}: ${escapeRTF(chapterTitle)}\\par\\par
`;

  // Add chapter subtitle if provided (smaller, italic, centered)
  if (chapterSubtitle) {
    rtf += `\\qc\\i\\fs28 ${escapeRTF(chapterSubtitle)}\\par\\par
`;
  }

  // Add separator line
  rtf += `\\qc\\fs24 * * *\\par\\par
`;

  // Reset formatting and add content
  rtf += `\\pard\\b0\\i0\\fs24
`;

  // Process content line by line
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.trim() === '') {
      rtf += '\\par\n';
      continue;
    }

    // Handle markdown-style headers
    if (line.startsWith('# ')) {
      rtf += `\\b\\fs32 ${escapeRTF(line.substring(2))}\\par
\\b0\\fs24\\par
`;
    } else if (line.startsWith('## ')) {
      rtf += `\\b\\fs28 ${escapeRTF(line.substring(3))}\\par
\\b0\\fs24\\par
`;
    } else if (line.startsWith('### ')) {
      rtf += `\\b\\fs26 ${escapeRTF(line.substring(4))}\\par
\\b0\\fs24\\par
`;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      // Handle bullet points
      rtf += `\\bullet ${escapeRTF(line.substring(2))}\\par
`;
    } else if (/^\d+\./.test(line)) {
      // Handle numbered lists
      const match = line.match(/^(\d+)\.\s*(.*)$/);
      if (match) {
        rtf += `${match[1]}. ${escapeRTF(match[2])}\\par
`;
      } else {
        rtf += `${escapeRTF(line)}\\par
`;
      }
    } else {
      // Regular paragraph
      rtf += `${escapeRTF(line)}\\par
`;
    }
  }

  // Add page break and chapter end marker
  rtf += `\\par\\page
\\qc\\fs20 Chapter ${chapterNumber} - End\\par
`;

  // Close RTF document
  rtf += '}';

  return rtf;
}

function generateRTF(title: string, subtitle: string, content: string): string {
  // RTF header with basic formatting
  let rtf = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0\\fnil\\fcharset0 Arial;}{\\f1\\fnil\\fcharset0 Times New Roman;}}
{\\colortbl;\\red0\\green0\\blue0;\\red128\\green128\\blue128;}
\\viewkind4\\uc1\\pard\\lang1033\\f0\\fs24
`;

  // Add title (large, bold, centered)
  rtf += `\\qc\\b\\fs36 ${escapeRTF(title)}\\par\\par
`;

  // Add subtitle if provided (smaller, italic, centered)
  if (subtitle) {
    rtf += `\\qc\\i\\fs28 ${escapeRTF(subtitle)}\\par\\par
`;
  }

  // Reset formatting and add content
  rtf += `\\pard\\b0\\i0\\fs24
`;

  // Process content line by line
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.trim() === '') {
      rtf += '\\par\n';
      continue;
    }

    // Handle markdown-style headers
    if (line.startsWith('# ')) {
      rtf += `\\b\\fs32 ${escapeRTF(line.substring(2))}\\par
\\b0\\fs24\\par
`;
    } else if (line.startsWith('## ')) {
      rtf += `\\b\\fs28 ${escapeRTF(line.substring(3))}\\par
\\b0\\fs24\\par
`;
    } else if (line.startsWith('### ')) {
      rtf += `\\b\\fs26 ${escapeRTF(line.substring(4))}\\par
\\b0\\fs24\\par
`;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      // Handle bullet points
      rtf += `\\bullet ${escapeRTF(line.substring(2))}\\par
`;
    } else if (/^\d+\./.test(line)) {
      // Handle numbered lists
      const match = line.match(/^(\d+)\.\s*(.*)$/);
      if (match) {
        rtf += `${match[1]}. ${escapeRTF(match[2])}\\par
`;
      } else {
        rtf += `${escapeRTF(line)}\\par
`;
      }
    } else {
      // Regular paragraph
      rtf += `${escapeRTF(line)}\\par
`;
    }
  }

  // Close RTF document
  rtf += '}';

  return rtf;
}

function escapeRTF(text: string): string {
  // Escape RTF special characters
  return text
    .replace(/\\/g, '\\\\')     // Backslash
    .replace(/\{/g, '\\{')      // Left brace
    .replace(/\}/g, '\\}')      // Right brace
    .replace(/\n/g, '\\par ')   // Newlines
    .replace(/\t/g, '\\tab ')   // Tabs
    .replace(/\u00A0/g, ' ')    // Non-breaking space
    .replace(/\u2013/g, '-')    // En dash
    .replace(/\u2014/g, '--')   // Em dash
    .replace(/\u2018/g, "'")    // Left single quote
    .replace(/\u2019/g, "'")    // Right single quote
    .replace(/\u201C/g, '"')    // Left double quote
    .replace(/\u201D/g, '"')    // Right double quote
    .replace(/\u2026/g, '...'); // Ellipsis
}

async function serveStatic(request: Request, env: { DATABASE_URL: string; REDIS_URL: string; GEMINI_API_KEY?: string }): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (pathname === '/workspace') {
    const uid = getSessionUid(request);
    if (!uid) {
      return new Response(null, {
        status: 302,
        headers: { Location: '/login?redirect=/workspace' },
      });
    }
    return new Response(generateWorkspacePageHTML(), {
      headers: { 'Content-Type': 'text/html' },
    });
  }

  if (pathname === '/' || pathname === '/index.html') {
    const htmlContent = generateMainPageHTML();
    return new Response(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  if (pathname === '/about') {
    const htmlContent = generateAboutPageHTML();
    return new Response(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  if (pathname === '/settings') {
    const htmlContent = generateSettingsPageHTML();
    return new Response(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  if (pathname === '/login') {
    const htmlContent = generateAuthPageHTML();
    return new Response(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  return new Response('File not found', { status: 404 });
}
