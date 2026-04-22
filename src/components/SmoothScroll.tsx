import { useEffect } from 'react';
import Lenis from 'lenis';
import { setLenis } from '../lib/smoothScroll';

/**
 * Mounts a Lenis smooth-scroll loop on the window.
 *
 * - Respects `prefers-reduced-motion` by skipping initialization entirely.
 * - Uses an exponential ease-out so long swipes decelerate naturally.
 * - Preserves native wheel + keyboard + touch scrolling.
 * - Dispatches a `scroll` event implicitly (Lenis mutates window.scrollY),
 *   so `framer-motion`'s `useScroll` and `IntersectionObserver` continue
 *   to work without changes.
 */
export function SmoothScroll() {
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) {
      setLenis(null);
      return;
    }

    const lenis = new Lenis({
      // ~1.1s to settle — long enough to feel deliberate, short enough
      // that a quick click-through to a section never feels sluggish.
      duration: 1.1,
      // ease-out-expo: hard launch, soft landing. Feels like mass.
      easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      smoothWheel: true,
      // Native touch behavior on mobile — users expect momentum they control.
      syncTouch: false,
    });

    setLenis(lenis);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Intercept in-page hash links (e.g. Hero CTAs) so they glide via Lenis
    // rather than producing the native instant-jump that bypasses smooth scroll.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('#') || href.length < 2) return;
      if (anchor.target && anchor.target !== '_self') return;
      const el = document.getElementById(href.slice(1));
      if (!el) return;
      e.preventDefault();
      // Offset matches the fixed nav height (64px).
      lenis.scrollTo(el, { offset: -64, lock: true });
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
