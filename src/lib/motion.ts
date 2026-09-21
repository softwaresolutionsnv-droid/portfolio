/**
 * Motion layer — Lenis smooth scroll + GSAP ScrollTrigger, one singleton.
 * Sections own the theme: `data-theme` on <html> follows the section in
 * view. Text reveals are word masks; mono labels decode char-by-char.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis: Lenis | null = null;

export function getLenis() {
  return lenis;
}

/** Start smooth scroll once; StrictMode double-invokes effects, so guard. */
export function startLenis() {
  if (lenis || reducedMotion()) return () => {};
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (t: number) => lenis?.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 });
  else el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
}

/** Mono decode: chars cycle through a glyph pool and settle left to right. */
const POOL = '01<>/[]{}#%&*+=-_$@';
export function decode(el: HTMLElement, duration = 700, text?: string) {
  const final = text ?? el.dataset.text ?? el.textContent ?? '';
  el.dataset.text = final;
  if (reducedMotion() || !final.trim()) {
    el.textContent = final;
    return;
  }
  const start = performance.now();
  const n = final.length;
  let raf = 0;
  const step = (now: number) => {
    const p = Math.min(1, (now - start) / duration);
    const settled = Math.floor(p * n);
    let out = '';
    for (let i = 0; i < n; i++) {
      const ch = final[i];
      if (i < settled || ch === ' ') out += ch;
      else out += POOL[Math.floor(Math.random() * POOL.length)];
    }
    el.textContent = out;
    if (p < 1) raf = requestAnimationFrame(step);
    else el.textContent = final;
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}

/** Section theme + nav tagline: fires on enter from either direction. */
export function watchSections(
  sections: { id: string; theme: string; tagline: string }[],
  onTagline: (tagline: string) => void
) {
  const html = document.documentElement;
  const triggers = sections.map((s) =>
    ScrollTrigger.create({
      trigger: `#${s.id}`,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => {
        html.setAttribute('data-theme', s.theme);
        onTagline(s.tagline);
      },
      onEnterBack: () => {
        html.setAttribute('data-theme', s.theme);
        onTagline(s.tagline);
      },
    })
  );
  return () => triggers.forEach((t) => t.kill());
}
