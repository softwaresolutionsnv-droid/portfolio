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

/** An artefact at its true size: the 1920 variant (the source, captures are never wider) tagged
    with the capture's device scale, so the browser's intrinsic width is the element's CSS width
    and an artefact is never shown larger than it was (CONTEXT.md: op ware grootte). */
export function artefactSrcSet(src: string, scherm: 'desktop' | 'mobiel'): string {
  return `${baseOf(src)}-1920.webp ${scherm === 'mobiel' ? 3 : 2}x`;
}

/** WebP srcset string for the 640/1280/1920 ladder; `groot` adds the 2880 step only merkplaten get (scripts/gen-images.mjs). */
export function webpSrcSet(src: string, groot = false): string {
  const base = baseOf(src);
  return [...WIDTHS, ...(groot ? [2880] : [])].map((w) => `${base}-${w}.webp ${w}w`).join(', ');
}
