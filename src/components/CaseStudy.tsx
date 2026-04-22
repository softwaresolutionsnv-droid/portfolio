import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export type CaseStudyProject = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  role: string;
  year: string;
  client: string;
  image: string;
  imageAlt: string;
  color: string;
  url?: string;
  overview: string[];
  highlights: { label: string; value: string }[];
};

type Props = {
  project: CaseStudyProject;
  index: number;
  total: number;
  onClose: () => void;
};

/**
 * Full-screen cinematic case study. Morphs from the rail card via the
 * View Transitions API (see Projects.tsx). Mobile-first: swipe-down to
 * dismiss, safe-area padded, native-feeling.
 */
export function CaseStudy({ project, index, total, onClose }: Props) {
  const reduced = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Swipe-down-to-close gesture state
  const [dragY, setDragY] = useState(0);
  const drag = useRef({ active: false, startY: 0, startT: 0, lastY: 0 });
  const isAutodisk = project.client === 'Autodisk';

  // Lock body scroll, focus close button, wire Escape
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);

    // Delay focus slightly so view transition completes cleanly
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 300);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swipe-down close (pointer events — works for touch + mouse).
  // IMPORTANT: do NOT capture pointer events on interactive targets
  // (buttons, links), or we'd swallow their click. Also defer capture
  // until real downward movement passes a small threshold.
  const onPointerDown = (e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    const target = e.target as HTMLElement;
    // Never start a swipe gesture when the touch starts on an interactive
    // element — let the tap go through.
    if (target.closest('button, a, [role="button"], input, textarea, select')) {
      return;
    }
    const fromHandle = target.closest('[data-drag-handle]');
    if (!fromHandle && el.scrollTop > 0) return;
    drag.current = {
      active: true,
      startY: e.clientY,
      startT: performance.now(),
      lastY: e.clientY,
    };
    // Capture lazily in onPointerMove once we pass the movement threshold.
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const s = drag.current;
    if (!s.active) return;
    const dy = e.clientY - s.startY;
    if (dy <= 0) {
      setDragY(0);
      return;
    }
    s.lastY = e.clientY;
    // Lazy pointer capture once we're clearly dragging
    if (dy > 6) {
      const host = e.currentTarget as HTMLElement;
      if (!host.hasPointerCapture(e.pointerId)) {
        host.setPointerCapture(e.pointerId);
      }
    }
    // Rubber-band: resistance as you pull further
    const resisted = dy < 200 ? dy : 200 + (dy - 200) * 0.4;
    setDragY(resisted);
  };

  const endDrag = (e: React.PointerEvent) => {
    const s = drag.current;
    if (!s.active) return;
    s.active = false;
    const el = e.currentTarget as HTMLElement;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    const dy = e.clientY - s.startY;
    const dt = Math.max(1, performance.now() - s.startT);
    const velocity = dy / dt; // px/ms
    if (dy > 140 || velocity > 0.7) {
      onClose();
    } else {
      setDragY(0);
    }
  };

  // Progress of the swipe (0..1) to fade the backdrop
  const swipeProgress = Math.min(1, dragY / 260);

  return createPortal(
    <div
      className="fixed inset-0 z-[200] cs-root"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} — case study`}
      style={{
        // Backdrop fades as you swipe down
        backgroundColor: `oklch(0 0 0 / ${0.72 - swipeProgress * 0.5})`,
        transition: drag.current.active ? 'none' : 'background-color 280ms ease',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={scrollRef}
        initial={reduced ? { opacity: 0 } : false}
        animate={reduced ? { opacity: 1 } : {}}
        transition={{ duration: 0.2 }}
        className="cs-surface absolute inset-0 overflow-y-auto overflow-x-hidden"
        style={{
          backgroundColor: 'var(--bg)',
          transform: `translate3d(0, ${dragY}px, 0) scale(${1 - swipeProgress * 0.03})`,
          transformOrigin: '50% 0%',
          transition: drag.current.active
            ? 'none'
            : 'transform 420ms cubic-bezier(0.16, 1, 0.3, 1)',
          overscrollBehavior: 'contain',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {/* Drag handle — visible on mobile, subtle on desktop */}
        <div
          data-drag-handle
          className="sticky top-0 z-10 flex justify-center pt-2 pb-1 cs-handle-wrap"
          aria-hidden="true"
          style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}
        >
          <div
            className="h-1 rounded-full"
            style={{
              width: 42,
              backgroundColor: 'var(--text-muted)',
              opacity: 0.35,
            }}
          />
        </div>

        {/* CLOSE BUTTON — floats over hero, always visible */}
        <button
          ref={closeBtnRef}
          onClick={onClose}
          aria-label="Close case study"
          className="fixed z-20 grid place-items-center outline-none focus-visible:outline-2 focus-visible:outline-offset-4 cs-close"
          style={{
            top: 'calc(env(safe-area-inset-top) + 1rem)',
            right: 'calc(env(safe-area-inset-right) + 1rem)',
            width: 44,
            height: 44,
            borderRadius: 999,
            backgroundColor: 'oklch(0 0 0 / 0.55)',
            color: 'oklch(1 0 0 / 0.95)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid oklch(1 0 0 / 0.14)',
            outlineColor: 'var(--color-accent, oklch(0.65 0.22 25))',
          }}
        >
          <X className="w-5 h-5" strokeWidth={2} />
        </button>

        {/* ------------- HERO (morph target from card) ------------- */}
        <header
          className="relative w-full overflow-hidden cs-hero"
          style={{
            backgroundColor: project.color,
            height: 'clamp(360px, 62vh, 640px)',
          }}
        >
          <img
            src={project.image}
            alt={project.imageAlt}
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ viewTransitionName: 'cs-image' } as React.CSSProperties}
          />
          {/* Scrim for readable hero text */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, oklch(0 0 0 / 0.82) 0%, oklch(0 0 0 / 0.50) 30%, oklch(0 0 0 / 0.10) 60%, oklch(0 0 0 / 0) 78%)',
            }}
          />

          {/* Hero chrome overlay — index + meta + title */}
          <div
            className="absolute inset-0 flex flex-col justify-end cs-hero-chrome"
            style={{
              padding:
                'clamp(1.25rem, 4vw, 3rem) clamp(1.25rem, 5vw, 4rem)',
              paddingBottom: 'max(clamp(1.5rem, 4vw, 3rem), env(safe-area-inset-bottom))',
            }}
          >
            <div className="flex items-end justify-between gap-6 w-full max-w-6xl mx-auto">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="font-display tabular-nums"
                    style={{
                      fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
                      color: 'oklch(1 0 0 / 0.7)',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                    <span style={{ color: 'oklch(1 0 0 / 0.35)' }}>
                      {' '}
                      / {String(total).padStart(2, '0')}
                    </span>
                  </span>
                  <span
                    className="h-px flex-1 max-w-[120px]"
                    style={{ backgroundColor: 'oklch(1 0 0 / 0.22)' }}
                    aria-hidden="true"
                  />
                  <span
                    className="text-[0.68rem] font-medium uppercase tracking-[0.22em]"
                    style={{
                      color: isAutodisk
                        ? 'var(--color-accent, oklch(0.72 0.22 25))'
                        : 'oklch(1 0 0 / 0.8)',
                    }}
                  >
                    {project.client} · {project.year}
                  </span>
                </div>
                <h1
                  className="font-display"
                  style={{
                    fontSize: 'clamp(2.25rem, 7vw, 5.5rem)',
                    lineHeight: 0.98,
                    letterSpacing: '-0.035em',
                    color: 'oklch(1 0 0 / 0.99)',
                    viewTransitionName: 'cs-title',
                  } as React.CSSProperties}
                >
                  {project.title}
                </h1>
              </div>

              {/* CTA — morphs from the card's "Live" badge */}
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 shrink-0 cs-cta outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
                  style={{
                    backgroundColor: 'var(--color-accent, oklch(0.65 0.22 25))',
                    color: 'oklch(1 0 0 / 0.98)',
                    borderRadius: 2,
                    border: '1px solid oklch(0.65 0.22 25 / 0.6)',
                    viewTransitionName: 'cs-badge',
                    outlineColor: 'var(--color-accent)',
                  } as React.CSSProperties}
                >
                  <span className="text-[0.72rem] font-medium uppercase tracking-[0.18em]">
                    Visit live site
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              ) : (
                <span
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 shrink-0"
                  style={{
                    backgroundColor: 'oklch(1 0 0 / 0.12)',
                    color: 'oklch(1 0 0 / 0.95)',
                    borderRadius: 2,
                    border: '1px solid oklch(1 0 0 / 0.22)',
                    viewTransitionName: 'cs-badge',
                  } as React.CSSProperties}
                >
                  <span className="text-[0.72rem] font-medium uppercase tracking-[0.18em]">
                    On request
                  </span>
                </span>
              )}
            </div>
          </div>
        </header>

        {/* ------------- BODY ------------- */}
        <article
          className="mx-auto w-full"
          style={{
            maxWidth: 1080,
            padding: 'clamp(2rem, 5vw, 4rem) clamp(1.25rem, 5vw, 4rem)',
            paddingBottom: 'max(clamp(3rem, 6vw, 5rem), env(safe-area-inset-bottom))',
          }}
        >
          {/* Lead paragraph — larger, editorial */}
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={reduced ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE_OUT_EXPO }}
            className="font-display"
            style={{
              fontSize: 'clamp(1.35rem, 2.4vw, 1.9rem)',
              lineHeight: 1.3,
              letterSpacing: '-0.015em',
              color: 'var(--text-primary)',
              maxWidth: '32ch',
              fontWeight: 600,
            }}
          >
            {project.description}
          </motion.p>

          {/* Meta grid */}
          <motion.dl
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={reduced ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease: EASE_OUT_EXPO }}
            className="grid cs-meta-grid"
            style={{
              marginTop: 'clamp(2rem, 4vw, 3rem)',
              paddingTop: 'clamp(1.5rem, 2.5vw, 2rem)',
              paddingBottom: 'clamp(1.5rem, 2.5vw, 2rem)',
              borderTop: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
              gap: 'clamp(1.25rem, 2.5vw, 2rem)',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            }}
          >
            <div>
              <dt
                className="text-[0.62rem] font-medium uppercase tracking-[0.22em] mb-2"
                style={{ color: 'var(--text-muted)' }}
              >
                Role
              </dt>
              <dd
                className="font-display"
                style={{
                  fontSize: '1rem',
                  letterSpacing: '-0.01em',
                  color: 'var(--text-primary)',
                }}
              >
                {project.role}
              </dd>
            </div>
            <div>
              <dt
                className="text-[0.62rem] font-medium uppercase tracking-[0.22em] mb-2"
                style={{ color: 'var(--text-muted)' }}
              >
                Client
              </dt>
              <dd
                className="font-display"
                style={{
                  fontSize: '1rem',
                  letterSpacing: '-0.01em',
                  color: 'var(--text-primary)',
                }}
              >
                {project.client}
              </dd>
            </div>
            <div>
              <dt
                className="text-[0.62rem] font-medium uppercase tracking-[0.22em] mb-2"
                style={{ color: 'var(--text-muted)' }}
              >
                Year
              </dt>
              <dd
                className="font-display tabular-nums"
                style={{
                  fontSize: '1rem',
                  letterSpacing: '-0.01em',
                  color: 'var(--text-primary)',
                }}
              >
                {project.year}
              </dd>
            </div>
            <div>
              <dt
                className="text-[0.62rem] font-medium uppercase tracking-[0.22em] mb-2"
                style={{ color: 'var(--text-muted)' }}
              >
                Stack
              </dt>
              <dd
                className="text-sm"
                style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}
              >
                {project.tags.join(', ')}
              </dd>
            </div>
          </motion.dl>

          {/* Overview paragraphs */}
          <div
            style={{
              marginTop: 'clamp(2.5rem, 5vw, 4rem)',
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr)',
              gap: 'clamp(1rem, 2vw, 1.5rem)',
              maxWidth: '65ch',
            }}
          >
            <motion.h2
              initial={reduced ? false : { opacity: 0, y: 14 }}
              whileInView={reduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
              className="font-display"
              style={{
                fontSize: 'clamp(0.72rem, 1vw, 0.8rem)',
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                fontWeight: 500,
                color: 'var(--text-muted)',
              }}
            >
              Overview
            </motion.h2>
            {project.overview.map((para, i) => (
              <motion.p
                key={i}
                initial={reduced ? false : { opacity: 0, y: 14 }}
                whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.6,
                  delay: 0.08 * i,
                  ease: EASE_OUT_EXPO,
                }}
                style={{
                  fontSize: 'clamp(1rem, 1.15vw, 1.075rem)',
                  lineHeight: 1.65,
                  color: 'var(--text-secondary)',
                }}
              >
                {para}
              </motion.p>
            ))}
          </div>

          {/* Highlights */}
          {project.highlights.length > 0 && (
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={reduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
              style={{ marginTop: 'clamp(3rem, 6vw, 5rem)' }}
            >
              <h2
                className="font-display mb-6"
                style={{
                  fontSize: 'clamp(0.72rem, 1vw, 0.8rem)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.22em',
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                }}
              >
                Highlights
              </h2>
              <ul
                className="grid"
                style={{
                  gap: 'clamp(1.25rem, 2.5vw, 2rem)',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                }}
              >
                {project.highlights.map((h, i) => (
                  <motion.li
                    key={h.label}
                    initial={reduced ? false : { opacity: 0, y: 18 }}
                    whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{
                      duration: 0.6,
                      delay: 0.07 * i,
                      ease: EASE_OUT_EXPO,
                    }}
                    style={{
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div
                      className="text-[0.62rem] font-medium uppercase tracking-[0.22em] mb-2"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {h.label}
                    </div>
                    <div
                      className="font-display"
                      style={{
                        fontSize: 'clamp(1.1rem, 1.5vw, 1.35rem)',
                        lineHeight: 1.25,
                        letterSpacing: '-0.015em',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {h.value}
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Mobile CTA (desktop has it in hero) */}
          {project.url && (
            <div
              className="sm:hidden"
              style={{ marginTop: 'clamp(2.5rem, 6vw, 3.5rem)' }}
            >
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{
                  backgroundColor: 'var(--color-accent, oklch(0.65 0.22 25))',
                  color: 'oklch(1 0 0 / 0.98)',
                  borderRadius: 2,
                  outlineColor: 'var(--color-accent)',
                }}
              >
                <span className="text-[0.72rem] font-medium uppercase tracking-[0.18em]">
                  Visit live site
                </span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          )}

          {/* Footer nav — close cue */}
          <div
            className="flex items-center justify-between mt-16 pt-6"
            style={{ borderTop: '1px solid var(--border-subtle)' }}
          >
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{
                color: 'var(--text-secondary)',
                outlineColor: 'var(--color-accent)',
              }}
            >
              <span aria-hidden="true">←</span> Back to archive
            </button>
            <span
              className="text-[0.62rem] font-medium uppercase tracking-[0.22em] tabular-nums"
              style={{ color: 'var(--text-muted)' }}
            >
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </div>
        </article>
      </motion.div>
    </div>,
    document.body
  );
}
