#!/usr/bin/env node
// Writes dist/work/<slug>/index.html per project with its own title,
// description, canonical, and og/twitter meta, so shared case-study
// links preview as the project instead of the generic homepage card.
// Runs after `vite build`; Vercel serves these static files before the
// SPA rewrite kicks in.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://nilsvogelaar.com';

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const setTag = (html, pattern, replacement) => {
  if (!pattern.test(html)) throw new Error(`gen-work-pages: no match for ${pattern}`);
  return html.replace(pattern, replacement);
};

const content = JSON.parse(await readFile(path.join(ROOT, 'src', 'data', 'content.json'), 'utf8'));
const base = await readFile(path.join(ROOT, 'dist', 'index.html'), 'utf8');

for (const p of content.projects) {
  const title = escapeHtml(`${p.title} · Nils Vogelaar`);
  const desc = escapeHtml(p.lede || p.description);
  const url = `${ORIGIN}/work/${p.slug}`;
  // A project may reference an image that isn't shipped yet (the site
  // renders a typographic fallback plate); the share card then keeps og.png.
  const hasImage = p.image && existsSync(path.join(ROOT, 'dist', p.image));
  const image = hasImage ? `${ORIGIN}${p.image}` : `${ORIGIN}/og.png`;

  let html = base;
  html = setTag(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = setTag(
    html,
    /(<meta\s+name="description"\s+content=")[^"]*(")/,
    `$1${desc}$2`
  );
  html = setTag(html, /(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  html = setTag(html, /(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`);
  html = setTag(html, /(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${desc}$2`);
  html = setTag(html, /(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`);
  html = setTag(html, /(<meta property="og:image" content=")[^"]*(")/, `$1${image}$2`);
  html = setTag(html, /(<meta name="twitter:title" content=")[^"]*(")/, `$1${title}$2`);
  html = setTag(html, /(<meta name="twitter:image" content=")[^"]*(")/, `$1${image}$2`);

  const dir = path.join(ROOT, 'dist', 'work', p.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), html);
}
console.log(`[work-pages] ${content.projects.length} pages`);
