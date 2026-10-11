import assert from 'node:assert/strict';
import { cp, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');
const index = await readFile(join(dist, 'index.html'), 'utf8');
assert(index.includes('src="./assets/'), 'Pages root requires a relative-base build.');
assert(!index.includes('main.tsx'), 'Publish compiled JavaScript, not the source entry.');
for (const name of ['index.html', 'favicon.svg', 'assets', 'brand', 'docs']) {
  await cp(join(dist, name), join(root, name), { recursive: true });
}
await writeFile(join(root, '.nojekyll'), '');

async function verify(directory) {
  let count = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) count += await verify(path);
    else {
      const name = relative(dist, path);
      assert.deepEqual(await readFile(join(root, name)), await readFile(path), `Root artifact differs: ${name}`);
      count += 1;
    }
  }
  return count;
}
console.log(`Pages root prepared and byte-verified: ${await verify(dist)} files plus .nojekyll.`);
