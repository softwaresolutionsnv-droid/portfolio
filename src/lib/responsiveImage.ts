/**
 * Responsive image helpers.
 *
 * Source images live in /public/projects as JPGs; build-time we generate
 * WebP variants at 640w / 1280w / 1920w. The helpers below derive the
 * srcset string and a JPG fallback URL from the original path so the data
 * layer stays a flat string ("image: '/projects/foo.jpg'") and components
 * stay declarative.
 */

const WIDTHS = [640, 1280, 1920] as const;

/** Strip the JPG/PNG extension to get the base path used for WebP variants. */
function baseOf(src: string): string {
  return src.replace(/\.(jpe?g|png)$/i, '');
}

/** WebP srcset string for the 640/1280/1920 ladder. */
export function webpSrcSet(src: string): string {
  const base = baseOf(src);
  return WIDTHS.map((w) => `${base}-${w}.webp ${w}w`).join(', ');
}

/** Smallest WebP variant — used as the eager `src` so the browser has a
 *  candidate even before parsing srcset on slow connections. */
export function webpSmallest(src: string): string {
  return `${baseOf(src)}-${WIDTHS[0]}.webp`;
}
