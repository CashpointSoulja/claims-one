import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, 'public', 'docs');
const required = [
  'README.md', 'PRD.md', 'FIVE-WHYS.md', 'JTBD.md', 'METRICS.md',
  'TEST-PLAN.md', 'TEST-RESULTS.md', 'VIABILITY.md', 'ROADMAP.md',
  'DECISIONS.md', 'AGENTS.md', 'BRAND.md', 'SOURCES.md', 'LICENSE.md',
];
const entries = await readdir(root);
const missing = required.filter(name => !entries.includes(name));
if (missing.length) {
  throw new Error(`Required public documents are missing: ${missing.join(', ')}`);
}
await mkdir(output, { recursive: true });
const escape = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);
const rewrite = href => {
  if (/^(?:javascript|data|vbscript):/i.test(href.trim())) return '#';
  if (/^https?:\/\//i.test(href)) return href;
  return href.replace(/^\.\//, '').replace(/^docs\/brand\//, 'brand/')
    .replace(/^public\/brand\//, '../brand/').replace(/\.md(?=[#?]|$)/, '.html');
};
const renderer = new marked.Renderer();
renderer.html = ({ text }) => escape(text);
renderer.link = function ({ href, title, tokens }) {
  return `<a href="${escape(rewrite(href))}"${title ? ` title="${escape(title)}"` : ''}>${this.parser.parseInline(tokens)}</a>`;
};
renderer.image = ({ href, text }) => /^https?:\/\//i.test(href)
  ? `<a href="${escape(href)}">${escape(text || 'External image reference')}</a>`
  : `<img src="${escape(rewrite(href))}" alt="${escape(text)}" loading="lazy">`;
marked.use({ renderer, gfm: true });
const shell = (title, body, source = '') => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(title)} — Claims One docs</title>
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<style>
@font-face{font-family:Fragment Mono;src:url('../brand/fragment-mono-latin-400.woff2') format('woff2');font-display:swap}
*{box-sizing:border-box}body{margin:0;background:#fefefe;color:#1e1e1e;font:17px/1.65 Arial,Helvetica,sans-serif}header{border-bottom:1px solid #c4c4c4;padding:18px max(24px,calc((100% - 1100px)/2));display:flex;gap:24px;flex-wrap:wrap}header img{width:108px;height:20px}main{max-width:960px;margin:64px auto;padding:0 24px}h1{font-size:clamp(36px,6vw,64px);line-height:1.05;letter-spacing:-.04em}h2{margin-top:48px;line-height:1.2}h3{margin-top:32px}a{color:inherit;text-underline-offset:4px}a:hover{background:#f386a1}pre{background:#1e1e1e;color:#fefefe;padding:24px;border-radius:12px;overflow:auto}code{font:13px/1.7 'Fragment Mono',monospace;overflow-wrap:anywhere}pre code{white-space:pre;overflow-wrap:normal}blockquote{border-left:4px solid #f386a1;margin:24px 0;padding:4px 24px;background:#f3f3f3}table{display:block;max-width:100%;overflow:auto;border-collapse:collapse;font-size:15px}th,td{padding:12px;text-align:left;border-bottom:1px solid #c4c4c4}img{max-width:100%;height:auto}footer{border-top:1px solid #c4c4c4;padding:32px 24px;text-align:center;font-size:13px}.source{font:12px/1.5 'Fragment Mono',monospace;color:#555}:focus-visible{outline:3px solid #b22b61;outline-offset:4px}@media(max-width:600px){main{margin:32px auto}pre{padding:16px}header{padding:16px 24px}}@media print{header,.source{display:none}main{max-width:none;margin:0}pre{white-space:pre-wrap;color:#1e1e1e;background:#eee}a{overflow-wrap:anywhere}}
</style></head><body>
<header><a href="../index.html" aria-label="Claims One home"><img src="../brand/typesafe-wordmark.svg" alt="TypeSafe AI"></a><a href="index.html">Claims One / Docs</a>${source ? `<a class="source" href="${escape(source)}">Read source markdown ↗</a>` : ''}</header>
<main>${body}</main><footer>An independent concept by Ayo Ahmed.</footer></body></html>\n`;
for (const name of entries.filter(name => name.endsWith('.md'))) {
  const markdown = await readFile(join(root, name), 'utf8');
  await copyFile(join(root, name), join(output, name));
  await writeFile(join(output, name.replace(/\.md$/, '.html')), shell(name.replace(/\.md$/, ''), marked.parse(markdown), name));
}
const brandOutput = join(output, 'brand');
await mkdir(brandOutput, { recursive: true });
for (const name of await readdir(join(root, 'docs', 'brand'))) {
  if (name === 'index.html') {
    const guide = await readFile(join(root, 'docs', 'brand', name), 'utf8');
    await writeFile(join(brandOutput, name), guide.replaceAll('../../public/brand/', '../../brand/').replaceAll('../../BRAND.md', '../BRAND.html'));
  } else {
    await copyFile(join(root, 'docs', 'brand', name), join(brandOutput, name));
  }
}
await writeFile(join(output, 'index.html'), shell('Documentation', `<p class="source">CLAIMS ONE / REFERENCE DOCUMENTATION</p><h1>The decisions behind the decisions.</h1><p>Product thinking, developer details, and actual verification results. This is an independent, synthetic reference implementation; not a live insurance service.</p><ul>${required.map(name => `<li><a href="${name.replace(/\.md$/, '.html')}">${escape(name)}</a></li>`).join('')}</ul><p><a href="brand/index.html">Visual brand study ↗</a></p>`));
console.log(`Built ${entries.filter(name => name.endsWith('.md')).length} public documents and the brand guide.`);
