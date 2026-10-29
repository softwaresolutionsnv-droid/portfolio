/**
 * Merkplaat template (ADR-0009): one fixed grid, filled with the client's own
 * brand — field colour, logo, their hero line in their typeface, and the
 * mobile screen bleeding off the bottom edge. Rendered by
 * scripts/capture-artefacts.mjs; the portfolio itself never loads client fonts.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// 3840×2400: the case spread shows the plate full width, ~2800 device pixels on a retina laptop.
export const PLAAT = { width: 1280, height: 800, deviceScaleFactor: 3 };

const MIME = { '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };

async function dataUri(file) {
  return `data:${MIME[path.extname(file).toLowerCase()]};base64,${(await readFile(file)).toString('base64')}`;
}

/** The capture starts below the phone's status bar; fill that bar with the page's own top colour. */
async function bovenkleur(file) {
  const { data } = await sharp(file).extract({ left: 0, top: 0, width: 1, height: 1 }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return `rgb(${data[0]} ${data[1]} ${data[2]})`;
}

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** `root`: the portfolio repo, so `logo` (scripts/merkplaten/) and `bron` (/projects/…) resolve. */
export async function plaatHtml(m, root) {
  const [logo, bron, toestel, statusbalk] = await Promise.all([
    dataUri(path.join(root, 'scripts', 'merkplaten', m.logo)),
    dataUri(path.join(root, 'public', m.bron)),
    dataUri(path.join(root, 'scripts', 'merkplaten', 'telefoon.png')),
    bovenkleur(path.join(root, 'public', m.bron)),
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
/* A phone (telefoon.png, screen keyed out) that always runs past the bottom edge. The screen box is
   the keyed area of that image in percentages, grown a few pixels into the bezel so the plate never
   shows through the anti-aliased edge; the frame lies on top, so its bezel and camera
   island round off the screenshot. A one-screen hero is shorter than the screen, so it is scaled
   to cover from the top instead of stopping short. */
.toestel { position: absolute; right: 80px; top: 72px; width: 380px; aspect-ratio: 709 / 1428;
  filter: drop-shadow(0 40px 48px rgb(0 0 0 / 0.35)); }
.toestel > img { position: absolute; inset: 0; width: 100%; height: 100%; }
.scherm { position: absolute; left: 4%; top: 1.5%; width: 92%; height: 97%; overflow: hidden; border-radius: 40px;
  padding-top: 40px; background: ${statusbalk}; }
.scherm img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: top; }
</style></head><body>
<img class="logo${m.logoFilter ? ` logo--${m.logoFilter}` : ''}" src="${logo}" alt="">
<p class="kop">${escapeHtml(m.kop)}</p>
${m.regel ? `<p class="regel">${escapeHtml(m.regel)}</p>` : ''}
<div class="toestel"><div class="scherm"><img src="${bron}" alt=""></div><img src="${toestel}" alt=""></div>
</body></html>`;
}
