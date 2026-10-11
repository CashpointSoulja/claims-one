import { ContractError, validateRequest } from '../src/contract';
import type { SystemOneRequest } from '../src/contract';
import { BodyLimitError, evaluateLive, readLimitedBody } from './adapter';
import type { FetchTransport, LiveAdapterEnv } from './adapter';

interface RateLimiter { limit(options: { key: string }): Promise<{ success: boolean }> }
export interface WorkerEnv extends LiveAdapterEnv {
  ALLOWED_ORIGIN?: string;
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  LIVE_ALLOWED_EMAILS?: string;
  LIVE_RATE_LIMITER?: RateLimiter;
}
interface AccessClaims { iss?: unknown; aud?: unknown; exp?: unknown; nbf?: unknown; iat?: unknown; sub?: unknown; email?: unknown }
interface AccessJwk { kid?: string; kty?: string; alg?: string; n?: string; e?: string; ext?: boolean; key_ops?: string[] }
const certCache = new Map<string, { expires: number; keys: AccessJwk[] }>();
function response(status: number, error: string, extra: Record<string, string> = {}) {
  return Response.json({ error }, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', Vary: 'Origin', ...extra } });
}
function configured(env: WorkerEnv) {
  if (env.ENABLE_LIVE !== 'true' || !env.TYPESAFE_API_KEY?.trim() || !env.ALLOWED_ORIGIN || !env.ACCESS_AUD?.trim() || !env.LIVE_ALLOWED_EMAILS?.trim() || !env.LIVE_RATE_LIMITER) return false;
  if (!env.ACCESS_TEAM_DOMAIN || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.cloudflareaccess\.com$/i.test(env.ACCESS_TEAM_DOMAIN)) return false;
  try { const url = new URL(env.ALLOWED_ORIGIN); return url.protocol === 'https:' && url.origin === env.ALLOWED_ORIGIN; } catch { return false; }
}
function decodeBase64Url(input: string): Uint8Array<ArrayBuffer> {
  if (!/^[A-Za-z0-9_-]+$/.test(input)) throw new Error('Invalid token encoding.');
  return Uint8Array.from(atob(input.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - input.length % 4) % 4)), ch => ch.charCodeAt(0));
}
/** Defense in depth behind a Cloudflare Access application: verify signature, audience, issuer and allowlisted identity. */
async function accessIdentity(request: Request, env: WorkerEnv, transport: FetchTransport): Promise<string | undefined> {
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!token || token.length > 8192) return undefined;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return undefined;
    const decoder = new TextDecoder('utf-8', { fatal: true });
    const header = JSON.parse(decoder.decode(decodeBase64Url(parts[0]))) as { alg?: unknown; kid?: unknown };
    const claims = JSON.parse(decoder.decode(decodeBase64Url(parts[1]))) as AccessClaims;
    const issuer = `https://${env.ACCESS_TEAM_DOMAIN}`;
    const now = Date.now() / 1000;
    if (header.alg !== 'RS256' || typeof header.kid !== 'string' || claims.iss !== issuer || typeof claims.exp !== 'number' || !Number.isFinite(claims.exp) || claims.exp <= now) return undefined;
    if (claims.nbf !== undefined && (typeof claims.nbf !== 'number' || !Number.isFinite(claims.nbf) || claims.nbf > now + 30)) return undefined;
    if (claims.iat !== undefined && (typeof claims.iat !== 'number' || !Number.isFinite(claims.iat) || claims.iat > now + 30)) return undefined;
    if (!Array.isArray(claims.aud) || !claims.aud.includes(env.ACCESS_AUD) || typeof claims.sub !== 'string' || !claims.sub || typeof claims.email !== 'string') return undefined;
    const allowed = env.LIVE_ALLOWED_EMAILS!.split(',').map(email => email.trim().toLowerCase()).filter(Boolean);
    if (!allowed.includes(claims.email.toLowerCase())) return undefined;
    let cached = certCache.get(issuer);
    if (!cached || cached.expires < Date.now()) {
      const certs = await transport(`${issuer}/cdn-cgi/access/certs`, { signal: AbortSignal.timeout(5_000), redirect: 'error' });
      if (!certs.ok) return undefined;
      const json = JSON.parse(await readLimitedBody(certs, 65_536)) as { keys?: AccessJwk[] };
      if (!Array.isArray(json.keys) || json.keys.length > 20) return undefined;
      cached = { expires: Date.now() + 600_000, keys: json.keys };
      // Bound memory even if a Worker serves multiple configured environments.
      if (certCache.size >= 4) certCache.clear();
      certCache.set(issuer, cached);
    }
    const jwk = cached.keys.find(key => key.kid === header.kid && key.kty === 'RSA' && (key.alg === undefined || key.alg === 'RS256'));
    if (!jwk) return undefined;
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, decodeBase64Url(parts[2]), new TextEncoder().encode(`${parts[0]}.${parts[1]}`));
    return valid ? claims.sub : undefined;
  } catch { return undefined; }
}
/** No claim logging, permissive CORS, automatic retries, client keys or unprotected paid proxy. */
export async function handleRequest(request: Request, env: WorkerEnv, transport: FetchTransport = fetch): Promise<Response> {
  if (new URL(request.url).pathname !== '/api/evaluate') return response(404, 'Not found.');
  if (request.method !== 'POST') return response(405, 'Only POST is supported.', { Allow: 'POST' });
  if (!configured(env)) return response(503, 'Live evaluation is disabled. Use the static synthetic demo.');
  if (request.headers.get('origin') !== env.ALLOWED_ORIGIN) return response(403, 'Origin not allowed.');
  const source = request.headers.get('sec-fetch-site');
  if (source && source !== 'same-origin') return response(403, 'Cross-site request not allowed.');
  if (!/^application\/json(?:\s*;.*)?$/i.test(request.headers.get('content-type') ?? '')) return response(415, 'Use application/json.');
  let payload: unknown;
  try {
    payload = JSON.parse(await readLimitedBody(request, 32_768));
    validateRequest(payload);
    if (payload.model !== 'jev-latest') return response(422, 'Unsupported live model.');
  } catch (error) {
    if (error instanceof BodyLimitError) return response(413, 'Request exceeds the 32 KiB body limit.');
    return response(422, 'Invalid evaluation request.');
  }
  const identity = await accessIdentity(request, env, transport);
  if (!identity) return response(401, 'Verified Cloudflare Access identity required.');
  try {
    // Both per-identity and endpoint-wide quotas are mandatory; deploy with deliberately small limits.
    const individual = await env.LIVE_RATE_LIMITER!.limit({ key: `identity:${identity}` });
    if (!individual.success) return response(429, 'Live quota exceeded.', { 'Retry-After': '60' });
    const global = await env.LIVE_RATE_LIMITER!.limit({ key: 'all-live-evaluations' });
    if (!global.success) return response(429, 'Live quota exceeded.', { 'Retry-After': '60' });
    const result = await evaluateLive(payload as SystemOneRequest, env, transport);
    return Response.json(result, { headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', Vary: 'Origin' } });
  } catch (error) {
    return response(error instanceof ContractError ? 502 : 503, 'Evaluation unavailable; route to human review.');
  }
}
export default { fetch: handleRequest };
