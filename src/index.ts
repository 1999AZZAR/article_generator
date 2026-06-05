import { handleRequest } from './handler';

// BYOK (Bring Your Own Key) — `GEMINI_API_KEY` is OPTIONAL. If unset, every
// visitor must provide their own key in the `X-User-API-Key` request header
// (or the legacy `apiKey` body field). Server-side fallback is only useful for
// self-hosted single-tenant deployments.
export interface Env {
  GEMINI_API_KEY?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return handleRequest(request, env);
  },
};
