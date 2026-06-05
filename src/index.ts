import { handleRequest } from './handler';

export interface Env {
  GEMINI_API_KEY?: string;
  DATABASE_URL: string;
  REDIS_URL: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return handleRequest(request, env);
  },
};
