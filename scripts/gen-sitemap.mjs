#!/usr/bin/env node
// Regenerates public/sitemap.xml from content.json (runs after fetch-content,
// so CMS-added projects are always included).
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://nilsvogelaar.com';

const content = JSON.parse(await readFile(path.join(ROOT, 'src', 'data', 'content.json'), 'utf8'));
const urls = [`${ORIGIN}/`, ...content.projects.map((p) => `${ORIGIN}/work/${p.slug}`)];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>
`;
await writeFile(path.join(ROOT, 'public', 'sitemap.xml'), xml);
console.log(`[sitemap] ${urls.length} urls`);
