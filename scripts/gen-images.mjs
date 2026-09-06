#!/usr/bin/env node
/**
 * WebP ladder generation (was the tail end of the CMS's fetch-content.mjs;
 * the Supabase branch is gone — ADR-0002, content.json is the source).
 *
 * For every source image in public/projects (.png/.jpg, non-recursive),
 * generate the 640/1280/1920 WebP variants next to it. Variants newer
 * than their source are skipped, so the script is safe to run every build.
 */
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'public', 'projects');
const WIDTHS = [640, 1280, 1920];

const sources = (await readdir(DIR)).filter((f) => /\.(png|jpe?g)$/i.test(f));
let generated = 0;
let sharp;

for (const file of sources) {
  const src = path.join(DIR, file);
  const base = file.replace(/\.(png|jpe?g)$/i, '');
  const srcMtime = (await stat(src)).mtimeMs;

  for (const w of WIDTHS) {
    const out = path.join(DIR, `${base}-${w}.webp`);
    const fresh = await stat(out).then((s) => s.mtimeMs > srcMtime).catch(() => false);
    if (fresh) continue;
    if (!sharp) sharp = (await import('sharp')).default;
    await sharp(src)
      .rotate()
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(out);
    generated++;
  }
}
console.log(`[images] ${sources.length} bronnen, ${generated} varianten gegenereerd.`);
