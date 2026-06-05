function parseCookies(header: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx < 0) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key) result[key] = value;
  }
  return result;
}

/**
 * Reads the `quill_uid` HttpOnly cookie and returns the decoded Firebase UID,
 * or null if absent or malformed.
 *
 * Trust basis: the cookie is set by our own POST /api/auth/session handler
 * (never by client JS — it's HttpOnly) and SameSite=Lax prevents CSRF from
 * cross-origin POSTs. No Firebase Admin SDK required.
 */
export function getSessionUid(request: Request): string | null {
  const cookieHeader = request.headers.get('Cookie') ?? '';
  const cookies = parseCookies(cookieHeader);
  const raw = cookies['quill_uid'];
  if (!raw) return null;
  const uid = decodeURIComponent(raw);
  if (!/^[a-zA-Z0-9_-]{6,128}$/.test(uid)) return null;
  return uid;
}

export function unauthorizedResponse(message = 'Authentication required'): Response {
  return new Response(JSON.stringify({ error: message, code: 'UNAUTHENTICATED' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}
