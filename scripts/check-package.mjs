import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');
async function files(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    result.push(...(entry.isDirectory() ? await files(path) : [path]));
  }
  return result;
}
const built = await files(dist);
const sources = (await readdir(root)).filter(name => name.endsWith('.md'));
for (const name of sources) {
  assert.deepEqual(await readFile(join(dist, 'docs', name)), await readFile(join(root, name)), `Source document differs: ${name}`);
  assert((await stat(join(dist, 'docs', name.replace(/\.md$/, '.html')))).isFile(), `Missing rendered document: ${name}`);
}
const publicFiles = await files(join(root, 'public'));
for (const path of publicFiles) {
  const name = relative(join(root, 'public'), path);
  assert.deepEqual(await readFile(join(dist, name)), await readFile(path), `Public asset differs: ${name}`);
}
assert.deepEqual(await readFile(join(dist, 'docs/brand/fragment-mono-license.txt')), await readFile(join(root, 'docs/brand/fragment-mono-license.txt')));
assert.deepEqual(await readFile(join(dist, 'docs/brand/observations.json')), await readFile(join(root, 'docs/brand/observations.json')));

const origin = 'https://static.invalid';
const base = process.env.VITE_BASE_PATH || './';
assert(base === './' || /^\/(?:[A-Za-z0-9._~-]+\/)*$/.test(base), 'Use a relative ./ or absolute directory base path.');
const mounts = base === './' ? ['/', '/claims-one/'] : [base];
let referenceCount = 0;
for (const mount of mounts) {
  for (const path of built.filter(path => /\.(html|css)$/.test(path))) {
    const text = await readFile(path, 'utf8');
    const page = new URL(mount + relative(dist, path).split('\\').join('/'), origin);
    const references = [
      ...Array.from(text.matchAll(/\b(?:href|src)="([^"]+)"/g), match => match[1]),
      ...Array.from(text.matchAll(/url\(\s*['"]?([^'"\s)]+)['"]?\s*\)/g), match => match[1]),
    ];
    for (const href of references) {
      if (/^(?:https?:|mailto:|tel:|data:|#)/i.test(href)) continue;
      const url = new URL(href.replaceAll('&amp;', '&'), page);
      if (url.origin !== origin) continue;
      // Explicit base builds check that mount; relative builds check root and repository mounts.
      assert(url.pathname.startsWith(mount), `Reference escapes mount: ${relative(dist, path)} -> ${href}`);
      let target = join(dist, decodeURIComponent(url.pathname.slice(mount.length)));
      if (url.pathname.endsWith('/')) target = join(target, 'index.html');
      assert((await stat(target).catch(() => null))?.isFile(), `Broken packaged reference: ${relative(dist, path)} -> ${href}`);
      if (url.hash && target.endsWith('.html')) {
        const targetText = await readFile(target, 'utf8');
        const id = decodeURIComponent(url.hash.slice(1));
        assert(targetText.includes(`id="${id}"`), `Missing HTML anchor: ${relative(dist, path)} -> ${href}`);
      }
      referenceCount += 1;
    }
  }
}
console.log(`Package verified: ${sources.length} source/rendered documents, ${publicFiles.length} public files, ${referenceCount} local HTML/CSS references. Filesystem checks only; not browser or deployment verification.`);
