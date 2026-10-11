import { readFileSync, existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (name: string) => readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');

describe('committed branch-root Pages artifact', () => {
  it('publishes compiled relative assets rather than TypeScript', () => {
    const html = read('index.html');
    expect(html).not.toContain('main.tsx');
    const assets = [...html.matchAll(/(?:src|href)="(\.\/assets\/[^"]+)"/g)].map(match => match[1]);
    expect(assets).toHaveLength(2);
    for (const asset of assets) expect(existsSync(new URL(`../${asset}`, import.meta.url))).toBe(true);
    expect(read('.nojekyll')).toBe('');
  });
  it('keeps the development entry separate and the root build reproducible', () => {
    expect(read('app/index.html')).toContain('./main.ts');
    expect(read('app/main.ts')).toContain("import '../src/main'");
    expect(read('vite.config.ts')).toContain("root: 'app'");
    expect(read('package.json')).toContain('scripts/prepare-pages.mjs');
    expect(read('scripts/prepare-pages.mjs')).toContain('assert.deepEqual');
    expect(read('README.md')).toContain('Folder: / (root)');
  });
  it('ships current mock-framed documentation and identical brand assets', () => {
    expect(read('docs/README.md')).toBe(read('README.md'));
    expect(read('docs/README.html')).toContain('Mock demo, not live Jev');
    expect(read('docs/VIABILITY.md')).toBe(read('VIABILITY.md'));
    expect(read('brand/typesafe-wordmark.svg')).toBe(read('public/brand/typesafe-wordmark.svg'));
    expect(read('docs/brand/fragment-mono-license.txt')).toBe(read('public/docs/brand/fragment-mono-license.txt'));
  });
});
