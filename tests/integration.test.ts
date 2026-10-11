import { readFileSync, readdirSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import App from '../src/App';
import { CLAIM_QUESTIONS } from '../src/questions';
import { CLAIMS } from '../src/samples';
import { handleSiteRequest } from '../worker/site';

const read = (name: string) => readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');
let html: string;
beforeAll(() => {
  vi.stubGlobal('fetch', vi.fn(() => { throw new Error('Network disabled in offline integration tests.'); }));
  html = renderToStaticMarkup(createElement(App));
});
afterAll(() => vi.unstubAllGlobals());

describe('six-screen code and server-side static rendering, not browser verification', () => {
  it.each(['hero', 'triage', 'workflow', 'economics', 'evaluation', 'docs'])('renders the %s anchor exactly once', id => {
    expect(html.match(new RegExp(`<section id="${id}"`, 'g'))).toHaveLength(1);
    expect(html).toContain(`href="#${id}"`);
  });
  it('renders required identity, provenance and non-affiliation without network inference', () => {
    expect(html).toContain('TypeSafe AI');
    expect(html).toContain('brand/typesafe-wordmark.svg');
    expect(html).toContain('System One<br/>for claims');
    expect(html).toContain('An independent concept by Ayo Ahmed.');
    expect(html).toContain('synthetic responses, no live inference');
    expect(html).toContain('Not affiliated with or endorsed by TypeSafe AI.');
    expect(fetch).not.toHaveBeenCalled();
  });
  it('renders all six pending typed cards and all twelve synthetic sample options', () => {
    for (const id of Object.keys(CLAIM_QUESTIONS)) expect(html).toContain(`<code class="question-id">${id}</code>`);
    for (const claim of CLAIMS) expect(html).toContain(`<option value="${claim.id}"`);
    expect(html.match(/class="waiting-label"/g)).toHaveLength(6);
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('id="triage-threshold"');
    expect(html).toContain('id="evaluation-threshold"');
  });
  it('renders the workload calculator and calculated synthetic evaluation tables', () => {
    expect(html).toContain('$3.15');
    expect(html).toContain('$1,400.49');
    expect(html).toContain('240 synthetic rows');
    expect(html).toContain('Synthetic calibration bins');
    expect(html).toContain('Synthetic threshold tradeoff');
    expect(html).toContain('not measured Claims One benefits');
  });
  it('links every root Markdown document, brand guide, and preserved font license', () => {
    const names = readdirSync(new URL('../', import.meta.url)).filter(name => name.endsWith('.md'));
    for (const name of names) expect(html).toContain(`docs/${name.replace(/\.md$/, '.html')}`);
    expect(html).toContain('docs/brand/index.html');
    expect(html).toContain('docs/brand/fragment-mono-license.txt');
  });
  it('keeps exact response identity, invalidates stale results and labels zero usage in source', () => {
    const source = read('src/App.tsx');
    expect(source).toContain('setResult({ response, request: submitted, runtime:');
    expect(source).toContain('if (ticket !== generation.current) return;');
    expect(source).toMatch(/function changeText\(value: string\)\s*\{[\s\S]*?setResult\(null\)/);
    expect(source).toContain('(answer.score + 1).toFixed(2)');
    expect(source).toContain('Mock response usage is zero: no API ran.');
    expect(source).not.toContain('estimated fixture usage');
    expect(source).not.toContain('estimated mock usage');
  });
});

describe('optional static Worker wrapper, injected assets only', () => {
  it.each(['/', '/docs/README.html', '/brand/typesafe-wordmark.svg'])('serves public %s without identity or credentials', async path => {
    const asset = new Response('static demo');
    const serve = vi.fn(async () => asset);
    const request = new Request(`https://static.invalid${path}`);
    expect(await handleSiteRequest(request, { ASSETS: { fetch: serve } })).toBe(asset);
    expect(serve).toHaveBeenCalledWith(request);
    expect(fetch).not.toHaveBeenCalled();
  });
  it('passes HEAD and preserves asset status and headers', async () => {
    const asset = new Response(null, { status: 200, headers: { ETag: 'fixture-etag' } });
    const request = new Request('https://static.invalid/', { method: 'HEAD' });
    expect(await handleSiteRequest(request, { ASSETS: { fetch: async () => asset } })).toBe(asset);
  });
  it('preserves missing asset 404 rather than serving the hero', async () => {
    const asset = new Response('Missing', { status: 404 });
    expect((await handleSiteRequest(new Request('https://static.invalid/docs/missing.html'), { ASSETS: { fetch: async () => asset } })).status).toBe(404);
  });
  it('keeps evaluation disabled and never falls back to a static API-shaped fixture', async () => {
    const serve = vi.fn(async () => new Response('static'));
    const result = await handleSiteRequest(new Request('https://static.invalid/api/evaluate', { method: 'POST' }), { ENABLE_LIVE: 'false', ASSETS: { fetch: serve } });
    expect(result.status).toBe(503);
    expect(await result.json()).toEqual({ error: 'Live evaluation is disabled. Use the static synthetic demo.' });
    expect(serve).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });
  it.each(['/api', '/api/unknown'])('unknown API route %s is not an asset fallback', async path => {
    const serve = vi.fn(async () => new Response('static'));
    expect((await handleSiteRequest(new Request(`https://static.invalid${path}`), { ASSETS: { fetch: serve } })).status).toBe(404);
    expect(serve).not.toHaveBeenCalled();
  });
  it('fails closed without an asset binding', async () => {
    expect((await handleSiteRequest(new Request('https://static.invalid/'), {})).status).toBe(503);
  });
  it('rejects non-read static methods', async () => {
    const serve = vi.fn(async () => new Response('static'));
    const result = await handleSiteRequest(new Request('https://static.invalid/', { method: 'POST' }), { ASSETS: { fetch: serve } });
    expect(result.status).toBe(405);
    expect(result.headers.get('Allow')).toBe('GET, HEAD');
    expect(serve).not.toHaveBeenCalled();
  });
});

describe('deployment and rights configuration source checks', () => {
  it('packages static assets without enabling live inference or request logging', () => {
    const config = JSON.parse(read('wrangler.jsonc'));
    expect(config.main).toBe('worker/site.ts');
    expect(config.assets).toEqual({ directory: './dist', binding: 'ASSETS', run_worker_first: ['/api', '/api/*'], html_handling: 'auto-trailing-slash', not_found_handling: 'none' });
    expect(config.vars).toEqual({ ENABLE_LIVE: 'false' });
    expect(config.observability.enabled).toBe(false);
    expect(config).not.toHaveProperty('account_id');
  });
  it('uses manual Pages dispatch, limited job permissions and explicit repository base', () => {
    const workflow = read('.github/workflows/pages.yml');
    expect(workflow).toContain('workflow_dispatch:');
    expect(workflow).not.toMatch(/^\s*(push|pull_request|pull_request_target):/m);
    expect(workflow).toContain('persist-credentials: false');
    expect(workflow).toContain('contents: read');
    expect(workflow).toContain('pages: write');
    expect(workflow).toContain('id-token: write');
    expect(workflow).not.toContain('write-all');
    expect(workflow).toContain('github.event.repository.name');
    expect(workflow).toContain('vars.PAGES_BASE_PATH');
    expect(workflow).toContain('path: dist');
    for (const command of ['npm test', 'npm run typecheck', 'npm run lint', 'npm run build']) expect(workflow).toContain(command);
  });
  it('includes source/rights docs and preserves first-party versus third-party scope', () => {
    const builder = read('scripts/build-docs.mjs');
    expect(builder).toContain("'SOURCES.md', 'LICENSE.md'");
    expect(read('LICENSE.md')).toContain('Copyright (c) 2026 Ayo Ahmed');
    expect(read('LICENSE.md')).toContain('They are excluded from the MIT grant.');
    expect(read('LICENSE.md')).toContain('SIL Open Font License 1.1');
    expect(read('SOURCES.md')).toContain('Bundled asset ledger');
    expect(read('package.json')).toContain('scripts/check-package.mjs');
  });
});
