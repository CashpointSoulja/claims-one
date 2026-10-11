import type { SystemOneRequest, SystemOneResponse } from '../src/contract';
import { validateRequest, validateResponse } from '../src/contract';

export interface LiveAdapterEnv { ENABLE_LIVE?: string; TYPESAFE_API_KEY?: string }
export type FetchTransport = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;
/** The only transport that can hold a TypeSafe credential. Never imported by the static app. */
export async function evaluateLive(request: SystemOneRequest, env: LiveAdapterEnv, transport: FetchTransport = fetch): Promise<SystemOneResponse> {
  if (env.ENABLE_LIVE !== 'true' || !env.TYPESAFE_API_KEY?.trim()) throw new Error('Live evaluation is disabled.');
  validateRequest(request);
  if (request.model !== 'jev-latest') throw new Error('Unsupported live model.');
  const response = await transport('https://api.typesafe.ai/v1/systemone', {
    method: 'POST', headers: { Authorization: `Bearer ${env.TYPESAFE_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(request), signal: AbortSignal.timeout(10_000), redirect: 'error',
  });
  // Never echo an upstream body or headers: they may contain private claim data.
  if (!response.ok) throw new Error('Upstream evaluation unavailable.');
  if (!response.headers.get('content-type')?.toLowerCase().includes('application/json')) throw new Error('Invalid upstream response.');
  const result: unknown = JSON.parse(await readLimitedBody(response, 524_288));
  validateResponse(result, request);
  return result;
}
export class BodyLimitError extends Error {}
/** Count streamed bytes as well as Content-Length, which a client may omit or misstate. */
export async function readLimitedBody(message: Request | Response, maxBytes: number): Promise<string> {
  const declared = message.headers.get('content-length');
  if (declared !== null && (!/^\d+$/.test(declared) || Number(declared) > maxBytes)) throw new BodyLimitError('Body too large or invalid length.');
  if (!message.body) return '';
  const reader = message.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let total = 0;
  let text = '';
  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      total += next.value.byteLength;
      if (total > maxBytes) { await reader.cancel(); throw new BodyLimitError('Body too large.'); }
      text += decoder.decode(next.value, { stream: true });
    }
    return text + decoder.decode();
  } finally { reader.releaseLock(); }
}
