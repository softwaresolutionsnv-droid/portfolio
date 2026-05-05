import Lenis from 'lenis';

let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis(): Lenis | null {
  return instance;
}

/**
 * Smoothly scroll to a target (element, selector, or y-offset) using the
 * active Lenis instance. Falls back to native `window.scrollTo` when Lenis
 * is unavailable (e.g., reduced-motion users or SSR).
 */
export function smoothScrollTo(
  target: number | string | HTMLElement,
  options?: { offset?: number; immediate?: boolean },
) {
  const lenis = getLenis();
  const offset = options?.offset ?? 0;

  if (lenis) {
    lenis.scrollTo(target, {
      offset,
      immediate: options?.immediate,
    });
    return;
  }

  // Fallback: native smooth scroll
  let top = 0;
  if (typeof target === 'number') {
    top = target + offset;
  } else {
    const el =
      typeof target === 'string'
        ? (document.querySelector(target) as HTMLElement | null)
        : target;
    if (!el) return;
    top = el.getBoundingClientRect().top + window.scrollY + offset;
  }
  window.scrollTo({
    top,
    behavior: options?.immediate ? 'auto' : 'smooth',
  });
}
