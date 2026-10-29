#!/usr/bin/env node
/**
 * Artefact capture (ADR-0005). For every live werkstuk with uitsneden, open
 * each uitsnede's page, screenshot exactly the element its selector names and
 * write it to the uitsnede's `beeld` path — only when the capture passes the
 * guardrails and differs noticeably from the previous one. Everything that
 * needs a human ends up in a report that the weekly Action turns into issues
 * (scripts/artefact-issues.mjs). Afterwards every merkplaat is rendered
 * (scripts/merkplaat.mjs, ADR-0009), so the screen inside it is this week's.
 *
 *   node scripts/capture-artefacts.mjs
 *   node scripts/capture-artefacts.mjs --slug 4fruit --base http://localhost:3000
 *     one-off capture of a non-live werkstuk against a local or protected copy
 *
 * --force writes even without a visible change. ARTEFACT_BROWSER_CHANNEL=chrome
 * uses the installed Chrome instead of Playwright's own Chromium.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import { PLAAT, plaatHtml } from './merkplaat.mjs';
import { veranderd } from './verschil.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCHERMEN = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
  // 3×, like the phones it stands for: inside a merkplaat the screen is drawn at 3× too.
  mobiel: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
};
const MAX_WIDTH = 1920; // top of the WebP ladder (gen-images.mjs)
const LEEG_DREMPEL = 4; // channel stdev below this means a blank capture

// Freeze motion so two captures of an unchanged page come out identical, and
// drop the Next.js dev badge that shows up in one-off local captures.
const STILSTAND = `*, *::before, *::after {
  animation-duration: 0s !important; animation-delay: 0s !important;
  transition: none !important; caret-color: transparent !important;
}
nextjs-portal { display: none !important; }`;

const { values: args } = parseArgs({
  options: {
    slug: { type: 'string' },
    base: { type: 'string' },
    force: { type: 'boolean', default: false },
    report: { type: 'string', default: 'artefacten-rapport.json' },
  },
});
if (args.base && !args.slug) throw new Error('--base werkt alleen samen met --slug');

const content = JSON.parse(await readFile(path.join(ROOT, 'src', 'data', 'content.json'), 'utf8'));
const werkstukken = content.werkstukken.filter(
  (w) => w.uitsneden?.length && (args.slug ? w.slug === args.slug : w.status === 'live'),
);
// Merkplaten render for every status: their material is local, nothing is fetched from the client.
const platen = content.werkstukken.filter((w) => w.merkplaat && (!args.slug || w.slug === args.slug));
if (args.slug && !werkstukken.length && !platen.length) throw new Error(`geen werkstuk "${args.slug}" met uitsneden of merkplaat`);

const rapport = { opgenomen: [], ongewijzigd: [], mislukt: [], ankerGewijzigd: [] };
const browser = await chromium.launch({ channel: process.env.ARTEFACT_BROWSER_CHANNEL || undefined });

for (const w of werkstukken) {
  const base = args.base ?? w.url;
  for (const u of w.uitsneden) {
    const ref = { slug: w.slug, beeld: u.beeld, selector: u.selector, scherm: u.scherm };
    const opname = await neemOp(new URL(u.pad, base).href, u).catch((e) => ({ fout: 'pagina', detail: e.message.split('\n')[0] }));
    if (opname.fout) {
      rapport.mislukt.push({ ...ref, reden: opname.fout, detail: opname.detail });
      continue;
    }

    if (!normaal(opname.tekst).includes(normaal(u.anker))) {
      rapport.ankerGewijzigd.push({ ...ref, anker: u.anker, gevonden: opname.tekst.replace(/\s+/g, ' ').slice(0, 160) });
    }

    const jpg = await sharp(opname.png)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: 86, mozjpeg: true })
      .toBuffer();
    const { width, height } = await sharp(jpg).metadata();
    const { channels } = await sharp(jpg).stats();
    if (Math.max(...channels.map((c) => c.stdev)) < LEEG_DREMPEL || width < 200 || height < 120) {
      rapport.mislukt.push({ ...ref, reden: 'leeg', detail: `${width}×${height}, vrijwel één kleur` });
      continue;
    }

    const doel = path.join(ROOT, 'public', u.beeld);
    if (!args.force && existsSync(doel) && !(await veranderd(doel, jpg))) {
      rapport.ongewijzigd.push(ref);
      continue;
    }
    await writeFile(doel, jpg);
    rapport.opgenomen.push(ref);
  }
}

// Merkplaten (ADR-0009) — after the captures, so the screen in each plate is this week's.
for (const w of platen) {
  const m = w.merkplaat;
  const ref = { slug: w.slug, beeld: m.beeld, selector: 'merkplaat', scherm: 'plaat' };
  const plaat = await renderPlaat(m).catch((e) => ({ fout: 'plaat', detail: e.message.split('\n')[0] }));
  if (plaat.fout) {
    rapport.mislukt.push({ ...ref, reden: plaat.fout, detail: plaat.detail });
    continue;
  }
  // Large flat fields band and speckle at the usual quality; a plate gets more.
  const jpg = await sharp(plaat.png).jpeg({ quality: 94, mozjpeg: true, chromaSubsampling: '4:4:4' }).toBuffer();
  const doel = path.join(ROOT, 'public', m.beeld);
  if (!args.force && existsSync(doel) && !(await veranderd(doel, jpg))) {
    rapport.ongewijzigd.push(ref);
    continue;
  }
  await writeFile(doel, jpg);
  rapport.opgenomen.push(ref);
}

await browser.close();
await writeFile(path.resolve(ROOT, args.report), JSON.stringify(rapport, null, 2) + '\n');
console.log(
  `[artefacten] ${rapport.opgenomen.length} opgenomen, ${rapport.ongewijzigd.length} ongewijzigd, ` +
    `${rapport.mislukt.length} mislukt, ${rapport.ankerGewijzigd.length} anker gewijzigd.`,
);
for (const m of rapport.mislukt) console.log(`  ✗ ${m.slug} ${m.beeld}: ${m.reden} — ${m.detail}`);

async function neemOp(url, u) {
  const context = await browser.newContext({ ...SCHERMEN[u.scherm], reducedMotion: 'reduce' });
  try {
    const page = await context.newPage();
    const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
    if (!res?.ok()) return { fout: 'pagina', detail: `HTTP ${res?.status() ?? '—'} op ${url}` };
    await page.addStyleTag({ content: STILSTAND });
    await page.evaluate(doorScrollen);

    const el = page.locator(u.selector);
    const n = await el.count();
    if (n !== 1) return { fout: 'selector', detail: `${n} elementen voor ${u.selector} op ${url}` };

    await el.scrollIntoViewIfNeeded();
    await el.evaluate(verbergZwevendeLagen);
    await el.evaluate(wachtOpBeelden);
    await page.evaluate(() => document.fonts.ready);
    const opties = { animations: 'disabled', caret: 'hide' };
    if (!u.marge) return { tekst: await el.innerText(), png: await el.screenshot(opties) };
    // An element without padding of its own leaves its text flush with the crop: take some page around it.
    const box = await el.boundingBox();
    const { scrollY, breedte } = await page.evaluate(() => ({ scrollY, breedte: document.documentElement.scrollWidth }));
    const x = Math.max(0, box.x - u.marge);
    const clip = { x, y: box.y + scrollY - u.marge, width: Math.min(breedte - x, box.width + 2 * u.marge), height: box.height + 2 * u.marge };
    return { tekst: await el.innerText(), png: await page.screenshot({ ...opties, fullPage: true, clip }) };
  } finally {
    await context.close();
  }
}

async function renderPlaat(m) {
  const context = await browser.newContext({ viewport: { width: PLAAT.width, height: PLAAT.height }, deviceScaleFactor: PLAAT.deviceScaleFactor });
  try {
    const page = await context.newPage();
    await page.setContent(await plaatHtml(m, ROOT), { waitUntil: 'networkidle', timeout: 60_000 });
    // A plate in a fallback face is a plate in someone else's brand: fail rather than write it.
    const geladen = await page.evaluate(async () => {
      await document.fonts.ready;
      return [...document.fonts].some((f) => f.status === 'loaded');
    });
    if (!geladen) return { fout: 'plaat', detail: `font laadde niet: ${m.font.css}` };
    return { png: await page.screenshot({ animations: 'disabled' }) };
  } finally {
    await context.close();
  }
}

// Walk the page once so lazy images and scroll-triggered reveals settle.
async function doorScrollen() {
  for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight / 2) {
    scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
  scrollTo(0, 0);
}

// Fixed and sticky layers float over whatever is scrolled into view. Keep
// backdrops (z-index below 0) and, for an uitsnede at the very top, the site
// header; hide the rest (headers over lower sections, chat buttons, intros).
function verbergZwevendeLagen(doel) {
  const bovenaan = doel.getBoundingClientRect().top + scrollY < 4;
  for (const laag of document.querySelectorAll('body *')) {
    if (laag === doel || laag.contains(doel) || doel.contains(laag)) continue;
    const stijl = getComputedStyle(laag);
    if (stijl.position !== 'fixed' && stijl.position !== 'sticky') continue;
    if (Number.parseInt(stijl.zIndex, 10) < 0) continue;
    const r = laag.getBoundingClientRect();
    if (bovenaan && r.top <= 0 && r.height < innerHeight / 3) continue;
    laag.style.setProperty('visibility', 'hidden', 'important');
  }
}

async function wachtOpBeelden(doel) {
  await Promise.all([...doel.querySelectorAll('img')].map((img) => img.decode().catch(() => {})));
}

function normaal(tekst) {
  return tekst.toLocaleLowerCase('nl').replace(/\s+/g, ' ').trim();
}
