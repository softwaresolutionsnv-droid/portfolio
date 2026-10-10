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

/** Move keyboard focus to a section without jumping the page (Lenis owns the scroll). */
export function focusSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
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

/**
 * Mono type-in / type-out: glyphs run ahead of the settled text like a
 * terminal cursor. Out runs the same path backwards — the tail scrambles,
 * then the line erases. A new call on the same element cancels the last.
 */
const typing = new WeakMap<HTMLElement, number>();
export function typeText(el: HTMLElement, dir: 'in' | 'out', text: string, duration = 650) {
  cancelAnimationFrame(typing.get(el) ?? 0);
  const n = text.length;
  if (reducedMotion() || !n) {
    el.textContent = dir === 'in' ? text : '';
    return;
  }
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const p = dir === 'in' ? t : 1 - t;
    const typed = Math.ceil(Math.min(1, p / 0.6) * n);
    const settled = Math.floor(Math.max(0, (p - 0.4) / 0.6) * n);
    let out = '';
    for (let i = 0; i < typed; i++) {
      const ch = text[i];
      out += i < settled || ch === ' ' ? ch : POOL[Math.floor(Math.random() * POOL.length)];
    }
    el.textContent = out;
    if (t < 1) typing.set(el, requestAnimationFrame(step));
  };
  typing.set(el, requestAnimationFrame(step));
}

/** Background token per theme, for blends that mix two themes by scroll. */
const THEME_BG: Record<string, string> = {
  dark: '--c-dark',
  light: '--c-off-white',
  green: '--c-green',
  pink: '--c-pink',
};

const rgbOf = (theme: string) =>
  getComputedStyle(document.documentElement)
    .getPropertyValue(THEME_BG[theme])
    .trim()
    .split(/\s+/)
    .map(Number);

/**
 * Section theme + nav tagline: fires on enter from either direction.
 * A section with `blend` scrubs the background from the previous theme
 * over the half-viewport before it takes over, instead of a timed fade.
 */
export function watchSections(
  sections: { id: string; theme: string; tagline: string; blend?: boolean }[],
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

  const clearBlend = () => {
    html.style.removeProperty('--bg-rgb');
    html.classList.remove('is-blending');
  };
  sections.forEach((s, i) => {
    const prev = sections[i - 1];
    if (!s.blend || !prev || prev.theme === s.theme) return;
    triggers.push(
      ScrollTrigger.create({
        trigger: `#${s.id}`,
        start: 'top bottom',
        end: 'top 50%',
        onUpdate: ({ progress }) => {
          const from = rgbOf(prev.theme);
          const to = rgbOf(s.theme);
          const mix = from.map((c, k) => Math.round(c + (to[k] - c) * progress)).join(' ');
          html.classList.add('is-blending');
          html.style.setProperty('--bg-rgb', mix);
        },
        onLeave: clearBlend,
        onLeaveBack: clearBlend,
      })
    );
  });

  return () => {
    triggers.forEach((t) => t.kill());
    clearBlend();
  };
}
