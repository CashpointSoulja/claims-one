import { handleRequest } from './index';
import type { WorkerEnv } from './index';

export interface SiteEnv extends WorkerEnv {
  ASSETS?: { fetch(request: Request): Promise<Response> };
}

/** Public static demo and an isolated, disabled-by-default optional API route. */
export async function handleSiteRequest(request: Request, env: SiteEnv): Promise<Response> {
  const pathname = new URL(request.url).pathname;
  if (pathname === '/api' || pathname.startsWith('/api/')) return handleRequest(request, env);
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Only GET and HEAD are supported for static assets.', {
      status: 405, headers: { Allow: 'GET, HEAD', 'X-Content-Type-Options': 'nosniff' },
    });
  }
  if (!env.ASSETS) return new Response('Static assets are unavailable.', { status: 503 });
  // Preserve asset status, redirects and cache headers; never turn a missing doc into the hero.
  return env.ASSETS.fetch(request);
}

export default { fetch: handleSiteRequest };
