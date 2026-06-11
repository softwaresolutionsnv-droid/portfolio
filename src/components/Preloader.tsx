import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Minimum time on screen — long enough to register, never a fake wait. */
const MIN_MS = 1000;
/** Hard cap: reveal even if a font request hangs. */
const MAX_MS = 2400;
const SEEN_KEY = 'nv-intro-seen';

/**
 * Type-driven preloader tied to real readiness (font loading), not a timer
 * for its own sake. Counter climbs while fonts resolve, holds, then the
 * whole veil slides up to reveal the hero mid-animation.
 *
 * Skipped entirely for reduced-motion users and repeat visits in-session.
 */
export function Preloader({ onReveal }: { onReveal: () => void }) {
  // Decide once, before first paint: repeat in-session visits and
  // reduced-motion users never see the veil.
  const [skip] = useState(() => {
    if (typeof window === 'undefined') return true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return true;
    }
    try {
      return sessionStorage.getItem(SEEN_KEY) !== null;
    } catch {
      return false;
    }
  });
  const [phase, setPhase] = useState<'loading' | 'exiting' | 'gone'>(() =>
    skip ? 'gone' : 'loading',
  );

  const progress = useMotionValue(0);
  const counter = useTransform(progress, (v) =>
    String(Math.min(100, Math.round(v))).padStart(3, '0'),
  );
  const barScale = useTransform(progress, (v) => v / 100);

  const revealedRef = useRef(false);
  const onRevealRef = useRef(onReveal);
  useEffect(() => {
    onRevealRef.current = onReveal;
  });

  useEffect(() => {
    if (skip) {
      if (!revealedRef.current) {
        revealedRef.current = true;
        onRevealRef.current();
      }
      return;
    }

    let fontsReady = false;
    let raf = 0;
    let holdTimer = 0;
    const start = performance.now();

    // No scrolling behind the veil.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    try {
      // Nudge the display faces so fonts.ready reflects what the hero needs.
      document.fonts?.load('700 1em "Bricolage Grotesque"');
      document.fonts?.load('400 1em "Figtree"');
      document.fonts?.ready.then(() => {
        fontsReady = true;
      });
    } catch {
      fontsReady = true;
    }

    const tick = (now: number) => {
      const elapsed = now - start;
      const done = (fontsReady && elapsed >= MIN_MS) || elapsed >= MAX_MS;
      // Creep toward 88 while waiting; release to 100 once actually ready.
      const target = done ? 100 : Math.min(88, (elapsed / MIN_MS) * 74);
      const current = progress.get();
      const next = current + (target - current) * 0.14;
      const settled = done && next > 99.2;
      progress.set(settled ? 100 : next);

      if (settled) {
        try {
          sessionStorage.setItem(SEEN_KEY, '1');
        } catch {
          /* storage unavailable */
        }
        holdTimer = window.setTimeout(() => {
          document.body.style.overflow = prevOverflow;
          if (!revealedRef.current) {
            revealedRef.current = true;
            onRevealRef.current();
          }
          setPhase('exiting');
        }, 200);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(holdTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, [skip, progress]);

  if (phase === 'gone') return null;

  return (
    <motion.div
      className="fixed inset-0 z-[400] flex flex-col"
      style={{ backgroundColor: 'var(--bg)' }}
      role="status"
      aria-label="Loading portfolio"
      initial={false}
      animate={phase === 'exiting' ? { y: '-100%' } : { y: '0%' }}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
      onAnimationComplete={() => {
        if (phase === 'exiting') setPhase('gone');
      }}
    >
      <div
        className="flex items-center justify-between px-5 sm:px-8"
        style={{ height: 64 }}
      >
        <span
          className="font-display text-lg tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Nils Vogelaar
        </span>
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Portfolio · {new Date().getFullYear()}
        </span>
      </div>

      <div className="flex-1" aria-hidden="true" />

      <div className="flex items-end justify-between gap-6 px-5 sm:px-8 pb-5">
        <span
          className="text-sm pb-3"
          style={{ color: 'var(--text-muted)', letterSpacing: '0.04em' }}
        >
          Amsterdam, NL
        </span>
        <motion.span
          className="font-display tabular-nums"
          style={{
            fontSize: 'clamp(3.5rem, 9vw, 7rem)',
            lineHeight: 0.9,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
          }}
        >
          {counter}
        </motion.span>
      </div>

      {/* Ember progress hairline — the veil's one beacon */}
      <motion.div
        className="origin-left"
        style={{
          height: 2,
          backgroundColor: 'var(--color-accent)',
          scaleX: barScale,
        }}
      />
    </motion.div>
  );
}
