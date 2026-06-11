#!/usr/bin/env node
/**
 * Pre-build content sync for the CMS.
 *
 * Fetches published projects + site settings from Supabase (anon key; RLS
 * limits projects to published rows), downloads storage-hosted images,
 * generates the WebP ladder (640/1280/1920) with sharp, and rewrites
 * src/data/content.json.
 *
 * Without VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY the script exits
 * silently and the checked-in content.json is used — the repo always
 * builds without CMS credentials. WITH credentials, any failure aborts
 * the build: silently shipping the stale seed content would be worse.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SUPABASE_URL = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public', 'projects', 'cms');
const CONTENT_PATH = path.join(ROOT, 'src', 'data', 'content.json');
const BUCKET = 'project-images';
const WIDTHS = [640, 1280, 1920];

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.log('[cms] Geen Supabase-credentials — de ingecheckte content.json wordt gebruikt.');
  process.exit(0);
}

async function rest(pathname) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathname}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Supabase REST ${pathname} → ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

/** 'slug/123-foo.jpg' → 'slug__123-foo' (deterministic, filesystem-safe). */
function localBase(key) {
  return key
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '__');
}

let sharp;

/**
 * Resolve an image reference to a site-absolute path. Repo assets
 * ('/projects/foo.jpg') pass through untouched — their WebP variants are
 * committed. Storage keys are downloaded and converted.
 */
async function processImage(key) {
  if (key.startsWith('/')) return key;

  if (!sharp) sharp = (await import('sharp')).default;

  const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encodeURI(key)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download mislukt: ${key} → ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());

  const base = localBase(key);
  await mkdir(OUT_DIR, { recursive: true });
  const img = sharp(buf, { failOn: 'none' }).rotate();
  await img.clone().jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(OUT_DIR, `${base}.jpg`));
  await Promise.all(
    WIDTHS.map((w) =>
      img
        .clone()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(path.join(OUT_DIR, `${base}-${w}.webp`))
    )
  );
  return `/projects/cms/${base}.jpg`;
}

const [settingsRows, projectRows] = await Promise.all([
  rest('site_settings?id=eq.1&select=*'),
  rest('projects?select=*&order=sort_order.asc,created_at.asc'),
]);

const settings = settingsRows[0] ?? {};

const projects = [];
for (const row of projectRows) {
  const gallery = [];
  for (const item of row.gallery ?? []) {
    if (!item?.image) continue;
    gallery.push({ image: await processImage(item.image), alt: item.alt ?? '' });
  }
  projects.push({
    slug: row.slug,
    title: row.title,
    description: row.description ?? '',
    lede: row.lede ?? '',
    tags: row.tags ?? [],
    role: row.role ?? '',
    year: row.year ?? '',
    client: row.client ?? '',
    url: row.url ?? null,
    image: row.image ? await processImage(row.image) : '',
    imageAlt: row.image_alt ?? '',
    color: row.color ?? 'oklch(0.22 0.05 230)',
    overview: row.overview ?? [],
    highlights: row.highlights ?? [],
    gallery,
    showBadge: Boolean(row.show_badge),
    showCta: Boolean(row.show_cta),
  });
}

const content = {
  availability: {
    state: settings.availability_state ?? 'available',
    availableFrom: settings.available_from ?? null,
  },
  about: { intro: '', body: '', details: [], ...(settings.about ?? {}) },
  skills: { intro: '', picks: [], ...(settings.skills ?? {}) },
  contact: { email: '', location: '', socials: [], ...(settings.contact ?? {}) },
  projects,
};

await writeFile(CONTENT_PATH, JSON.stringify(content, null, 2) + '\n');
console.log(`[cms] content.json bijgewerkt — ${projects.length} gepubliceerde projecten.`);
