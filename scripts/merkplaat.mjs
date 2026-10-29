/**
 * Merkplaat template (ADR-0009): one fixed grid, filled with the client's own
 * brand — field colour, logo, their hero line in their typeface, and the
 * mobile screen bleeding off the bottom edge. Rendered by
 * scripts/capture-artefacts.mjs; the portfolio itself never loads client fonts.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';

// 3840×2400: the case spread shows the plate full width, ~2800 device pixels on a retina laptop.
export const PLAAT = { width: 1280, height: 800, deviceScaleFactor: 3 };

const MIME = { '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };

async function dataUri(file) {
  return `data:${MIME[path.extname(file).toLowerCase()]};base64,${(await readFile(file)).toString('base64')}`;
}

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** `root`: the portfolio repo, so `logo` (scripts/merkplaten/) and `bron` (/projects/…) resolve. */
export async function plaatHtml(m, root) {
  const [logo, bron] = await Promise.all([
    dataUri(path.join(root, 'scripts', 'merkplaten', m.logo)),
    dataUri(path.join(root, 'public', m.bron)),
  ]);
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="${escapeHtml(m.font.css)}">
<style>
* { margin: 0; box-sizing: border-box; }
html, body { width: ${PLAAT.width}px; height: ${PLAAT.height}px; overflow: hidden; }
body { position: relative; background: ${m.vlak}; color: ${m.inkt}; -webkit-font-smoothing: antialiased; }
.logo { position: absolute; left: 72px; top: 72px; height: 60px; width: auto; max-width: 440px; object-fit: contain; object-position: left; }
.logo--wit { filter: brightness(0) invert(1); }
.logo--zwart { filter: brightness(0); }
/* Client styles first, plate geometry after: the font is theirs, the grid is ours. */
.kop { font-size: 64px; line-height: 1.02; ${m.font.stijl}; position: absolute; left: 72px; bottom: ${m.regel ? 120 : 72}px; width: 600px; text-wrap: balance; }
.regel { ${m.font.stijl}; position: absolute; left: 72px; bottom: 72px; font-size: 20px; line-height: 1; letter-spacing: 0; text-transform: none; font-weight: 500; opacity: 0.8; }
/* A fixed frame that always runs 32px past the bottom edge: a one-screen hero is shorter than the
   frame, so it is scaled to cover from the top (at most ~9%) instead of stopping short. */
.scherm { position: absolute; right: 120px; top: 72px; width: 340px; height: 760px; border-radius: 26px 26px 0 0; overflow: hidden;
  box-shadow: 0 48px 96px -24px rgb(0 0 0 / 0.45), 0 0 0 1px rgb(0 0 0 / 0.1); }
.scherm img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: top; }
</style></head><body>
<img class="logo${m.logoFilter ? ` logo--${m.logoFilter}` : ''}" src="${logo}" alt="">
<p class="kop">${escapeHtml(m.kop)}</p>
${m.regel ? `<p class="regel">${escapeHtml(m.regel)}</p>` : ''}
<div class="scherm"><img src="${bron}" alt=""></div>
</body></html>`;
}
