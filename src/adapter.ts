import type { SystemOneRequest, SystemOneResponse } from './contract';
import { validateRequest, validateResponse } from './contract';
import { mockEvaluate } from './mock';

export const DEMO_MODE = true;
export const DEMO_NOTICE = 'Synthetic fixtures on the published API contract. No live model, payment or coverage determination.';
/** Rough sizing assumption only (serialized characters / 4), not a tokenizer or API usage measurement. */
export function estimateInputTokens(request: SystemOneRequest): number {
  validateRequest(request);
  return Math.ceil(JSON.stringify(request).length / 4);
}
/** Portable static-site default: no network, credentials, environment lookup or live fallback. */
export function evaluateClaim(request: SystemOneRequest): Promise<SystemOneResponse> {
  return mockEvaluate(request);
}
/** Explicit opt-in for a separately deployed, Access-protected Worker. Never takes an API key. */
export function createWorkerAdapter(endpoint = '/api/evaluate'): (request: SystemOneRequest) => Promise<SystemOneResponse> {
  // Keep credentials and claim text on the site's own origin; do not accept a remote endpoint.
  if (!endpoint.startsWith('/') || endpoint.startsWith('//') || endpoint.includes('\\') || endpoint.includes('#') || endpoint.includes('?')) {
    throw new Error('Worker endpoint must be a same-origin absolute path');
  }
  return async request => {
    validateRequest(request);
    const response = await fetch(endpoint, {
      method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request), signal: AbortSignal.timeout(15_000), redirect: 'error',
    });
    if (!response.ok) throw new Error(`Evaluation unavailable (${response.status}); route to human review.`);
    const result: unknown = await response.json();
    validateResponse(result, request);
    return result;
  };
}
