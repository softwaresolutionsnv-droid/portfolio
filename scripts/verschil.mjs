/**
 * Has a capture changed? Compared on a 96×96 greyscale grid: a different size,
 * or any one cell that moved more than CEL_DREMPEL grey levels, is a change.
 * Not a mean over the grid: a few changed words ("7-10 days" → "7-10 dagen")
 * vanish in an average, and the portfolio would keep showing the old text.
 * Two captures of an unchanged page differ by at most 1 level per cell
 * (measured on five live uitsneden, Oct 2026), so 8 leaves room for noise.
 */
import sharp from 'sharp';

const CEL_DREMPEL = 8;

const raster = (bron) => sharp(bron).resize(96, 96, { fit: 'fill' }).greyscale().raw().toBuffer();

/** `oud`, `nieuw`: a file path or an image buffer. */
export async function veranderd(oud, nieuw) {
  const [a, b] = await Promise.all([sharp(oud).metadata(), sharp(nieuw).metadata()]);
  if (a.width !== b.width || a.height !== b.height) return true;
  const [x, y] = await Promise.all([raster(oud), raster(nieuw)]);
  return x.some((v, i) => Math.abs(v - y[i]) > CEL_DREMPEL);
}
