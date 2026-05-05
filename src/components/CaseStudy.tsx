import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { getLenis } from '../lib/smoothScroll';
import { webpSrcSet } from '../lib/responsiveImage';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export type CaseStudyProject = {
  id: number;
  title: string;
  /** Card-level summary. Used on the rail card only. */
  description: string;
  /**
   * Editorial lead used inside the case-study modal. Required: the modal
   * must never repeat the rail card description verbatim at Display scale.
   * Write a sentence that only earns its place inside the case study.
   */
  lede: string;
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
  /** Title of the next case study, shown in the footer as anticipation. */
  nextTitle?: string;
  onClose: () => void;
  /** Optional: navigate to previous case study (in-place swap). */
  onPrev?: () => void;
  /** Optional: navigate to next case study (in-place swap). */
  onNext?: () => void;
};

/**
 * Full-screen cinematic case study. Morphs from the rail card via the
 * View Transitions API (see Projects.tsx). Mobile-first: swipe-down to
 * dismiss, safe-area padded, native-feeling.
 */
export function CaseStudy({ project, index, total, nextTitle, onClose, onPrev, onNext }: Props) {
  const reduced = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  // DOM ref for the scroll-progress bar — updated imperatively to avoid
  // re-rendering the whole modal on every scroll tick.
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Latest-callback refs so the mount-only keydown listener always invokes
  // the fresh prev/next/close passed by the parent (callbacks are recreated
  // each render, so a closure over props would go stale on prop swap).
  const onCloseRef = useRef(onClose);
  const onPrevRef = useRef(onPrev);
  const onNextRef = useRef(onNext);
  useEffect(() => {
    onCloseRef.current = onClose;
    onPrevRef.current = onPrev;
    onNextRef.current = onNext;
  });

  // Lede is required by the data contract; the body shows the full overview.
  const lead = project.lede;
  const bodyOverview = project.overview;

  // Root ref for focus trap (queries focusable descendants on demand).
  const rootRef = useRef<HTMLDivElement>(null);

  // Lock body scroll, mark page background as inert, focus close button,
  // wire Escape + arrow nav, and trap Tab inside the dialog.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    // Lenis intercepts wheel events globally — pause it so the modal's
    // overflow-y-auto container can receive them directly.
    const lenis = getLenis();
    lenis?.stop();

    // Mark every direct child of <body> outside the dialog as `inert` so
    // assistive tech and keyboard tabbing skip them. Restore on unmount.
    const root = rootRef.current;
    const inerted: HTMLElement[] = [];
    if (root) {
      Array.from(document.body.children).forEach((node) => {
        if (node === root) return;
        const el = node as HTMLElement;
        if (el.hasAttribute('inert')) return;
        el.setAttribute('inert', '');
        el.setAttribute('aria-hidden', 'true');
        inerted.push(el);
      });
    }

    const FOCUSABLE =
      'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      // Trap Tab within the dialog
      if (e.key === 'Tab' && rootRef.current) {
        const nodes = Array.from(
          rootRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
        ).filter((n) => !n.hasAttribute('disabled') && n.offsetParent !== null);
        if (nodes.length === 0) {
          e.preventDefault();
          return;
        }
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && (active === first || !rootRef.current.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
        return;
      }
      // Don't hijack arrows while the user is typing or focused in a control.
      const target = e.target as HTMLElement | null;
      if (target && target.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (e.key === 'ArrowLeft' && onPrevRef.current) {
        e.preventDefault();
        onPrevRef.current();
      } else if (e.key === 'ArrowRight' && onNextRef.current) {
        e.preventDefault();
        onNextRef.current();
      }
    };
    window.addEventListener('keydown', onKey);

    // Focus on the next animation frame — view transitions paint synchronously,
    // so this is enough without racing the 300ms timeout we used to use.
    const raf = requestAnimationFrame(() => closeBtnRef.current?.focus());

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
      window.removeEventListener('keydown', onKey);
      cancelAnimationFrame(raf);
      inerted.forEach((el) => {
        el.removeAttribute('inert');
        el.removeAttribute('aria-hidden');
      });
      lenis?.start();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swipe-down-to-close gesture removed — it was intercepting normal
  // scroll on touch devices. Use the close button or Esc key to dismiss.

  // When the project swaps in-place (prev/next), reset scroll position so
  // the new case study starts at its hero, not mid-article.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = 0;
    if (progressBarRef.current) progressBarRef.current.style.transform = 'scaleX(0)';
  }, [project.id]);

  // Wire the scroll-progress bar imperatively — no state update, no re-render.
  useEffect(() => {
    const el = scrollRef.current;
    const bar = progressBarRef.current;
    if (!el || !bar) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
      bar.style.transform = `scaleX(${progress})`;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
    // Re-attach when the scroll container is ready; project.id causes the
    // container to remount (portal stays, but content flushes) — no-op safe.
  }, []);

  return createPortal(
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] cs-root"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title}: case study`}
      style={{
        backgroundColor: 'var(--scrim-strong)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Scroll-progress beacon — a 2px Ember strip at the top of the modal.
          This is the One Beacon on this surface: a sales artifact whose
          north star is The Signal Fire should not render a beaconless
          viewport, even when the project has no live URL. The bar updates
          imperatively from rAF-cadence scroll events; no CSS transition
          needed (the easing was lagging real scroll position by ~120ms). */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          zIndex: 30,
          pointerEvents: 'none',
          backgroundColor: 'transparent',
        }}
      >
        <div
          ref={progressBarRef}
          style={{
            height: '100%',
            width: '100%',
            transform: 'scaleX(0)',
            transformOrigin: '0% 50%',
            backgroundColor: 'var(--color-accent)',
          }}
        />
      </div>

      <motion.div
        ref={scrollRef}
        initial={reduced ? { opacity: 0 } : false}
        animate={reduced ? { opacity: 1 } : {}}
        transition={{ duration: 0.2 }}
        className="cs-surface absolute inset-0 overflow-y-auto overflow-x-hidden"
        data-lenis-prevent
        style={{
          backgroundColor: 'var(--bg)',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
        }}
      >
        {/* CLOSE BUTTON — floats over hero, always visible.
            The offset tracks the same fluid scale as the hero chrome and
            article body (clamp 1.25rem → 3rem) so the disk sits on the
            same optical gutter as the title and meta, not jammed against
            the viewport edge at wide viewports. */}
        <button
          ref={closeBtnRef}
          onClick={onClose}
          aria-label="Close case study"
          className="fixed z-20 grid place-items-center outline-none focus-visible:outline-2 focus-visible:outline-offset-4 cs-close"
          style={{
            top: 'calc(env(safe-area-inset-top) + clamp(1rem, 3vw, 2rem))',
            right: 'calc(env(safe-area-inset-right) + clamp(1rem, 4vw, 3rem))',
            width: 44,
            height: 44,
            borderRadius: 999,
            // Solid disk per DESIGN.md §4 "Case-study close button". The One
            // Blur Rule reserves backdrop-filter for the nav scroll state only.
            backgroundColor: 'var(--disk-on-image)',
            color: 'var(--ink-on-image)',
            border: '1px solid var(--hairline-on-image)',
            outlineColor: 'var(--color-accent)',
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
          <picture>
            <source
              type="image/webp"
              srcSet={webpSrcSet(project.image)}
              sizes="100vw"
            />
            <img
              src={project.image}
              alt={project.imageAlt}
              draggable={false}
              decoding="async"
              fetchPriority="high"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ viewTransitionName: 'cs-image' } as React.CSSProperties}
            />
          </picture>
          {/* Scrim for readable hero text — tinted graphite so warmth
              survives over imagery in either theme. */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, oklch(0.08 0.012 50 / 0.82) 0%, oklch(0.08 0.012 50 / 0.50) 30%, oklch(0.08 0.012 50 / 0.10) 60%, oklch(0.08 0.012 50 / 0) 78%)',
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
                      color: 'var(--ink-on-image-muted)',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                    <span style={{ color: 'var(--ink-on-image-subtle)' }}>
                      {' '}
                      / {String(total).padStart(2, '0')}
                    </span>
                  </span>
                  <span
                    className="h-px flex-1 max-w-[120px]"
                    style={{ backgroundColor: 'var(--hairline-on-image)' }}
                    aria-hidden="true"
                  />
                  <span
                    className="text-[0.68rem] font-medium uppercase tracking-[0.22em]"
                    style={{
                      color: 'var(--ink-on-image-muted)',
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
                    color: 'var(--ink-on-image)',
                    viewTransitionName: 'cs-title',
                  } as React.CSSProperties}
                >
                  {project.title}
                </h1>
              </div>

              {/* CTA — morphs from the card's "Live" badge.
                  This is the One Beacon on this surface. Focus ring is
                  text-tinted so it doesn't disappear into the Ember fill.
                  When the project has no public URL, route the beacon to
                  the contact section instead of rendering a dead pill. */}
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 shrink-0 cs-cta outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    color: 'var(--ink-on-image)',
                    borderRadius: 0,
                    border: '1px solid var(--color-accent-hover)',
                    viewTransitionName: 'cs-badge',
                    outlineColor: 'var(--ink-on-image)',
                  } as React.CSSProperties}
                >
                  <span className="text-sm font-medium">Visit live site</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              ) : (
                <a
                  href="#contact"
                  onClick={() => onClose()}
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--color-accent)',
                    borderRadius: 0,
                    border: '1px solid var(--color-accent)',
                    viewTransitionName: 'cs-badge',
                    outlineColor: 'var(--color-accent)',
                  } as React.CSSProperties}
                >
                  <span className="text-sm font-medium">Request access</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
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
          {/* Lead paragraph — larger, editorial. Required by the data
              contract so it is never the rail card description repeated. */}
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={reduced ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.10, ease: EASE_OUT_EXPO }}
            className="font-display"
            style={{
              fontSize: 'clamp(1.35rem, 2.4vw, 1.9rem)',
              lineHeight: 1.4,
              letterSpacing: '-0.015em',
              color: 'var(--text-primary)',
              maxWidth: '38ch',
              fontWeight: 600,
            }}
          >
            {lead}
          </motion.p>

          {/* Meta dl removed: client+year already live in the hero eyebrow,
              role lives next to the title, and stack is carried as a row of
              the highlights list below. Three repetitions of the same facts
              was the SaaS "credits row" the brand explicitly rejects. */}

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
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--text-muted)',
                letterSpacing: '0.02em',
              }}
            >
              Overview
            </motion.h2>
            {bodyOverview.map((para, i) => (
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

          {/* Highlights — rendered as an inline definition list, not a
              metric grid. The hero-metric template (label/value tiles in a
              tidy auto-fit grid) is a SaaS cliché the brand explicitly
              rejects; an editorial dl reads as journalism, not pricing. */}
          {project.highlights.length > 0 && (
            <motion.dl
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={reduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
              style={{
                marginTop: 'clamp(3rem, 6vw, 5rem)',
                maxWidth: '60ch',
                display: 'grid',
                rowGap: '0.5rem',
                columnGap: '2rem',
                gridTemplateColumns: 'minmax(7rem, max-content) 1fr',
              }}
            >
              {project.highlights.map((h, i) => (
                <motion.div
                  key={h.label}
                  initial={reduced ? false : { opacity: 0, y: 14 }}
                  whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    duration: 0.5,
                    delay: 0.05 * i,
                    ease: EASE_OUT_EXPO,
                  }}
                  style={{ display: 'contents' }}
                >
                  <dt
                    className="text-sm font-medium"
                    style={{
                      color: 'var(--text-muted)',
                      paddingTop: '0.5rem',
                      borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)',
                    }}
                  >
                    {h.label}
                  </dt>
                  <dd
                    style={{
                      fontSize: '1rem',
                      lineHeight: 1.55,
                      color: 'var(--text-primary)',
                      paddingTop: '0.5rem',
                      borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)',
                      margin: 0,
                    }}
                  >
                    {h.value}
                  </dd>
                </motion.div>
              ))}
            </motion.dl>
          )}

          {/* Mobile CTA (desktop has it in hero). Mirrors the URL/no-URL
              branch so URL-less projects still expose a beacon on phones. */}
          <div
            className="sm:hidden"
            style={{ marginTop: 'clamp(2.5rem, 6vw, 3.5rem)' }}
          >
            {project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--ink-on-image)',
                  borderRadius: 0,
                  outlineColor: 'var(--color-accent)',
                }}
              >
                <span className="text-sm font-medium">Visit live site</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            ) : (
              <a
                href="#contact"
                onClick={() => onClose()}
                className="inline-flex items-center gap-2 px-5 py-3 outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--color-accent)',
                  borderRadius: 0,
                  border: '1px solid var(--color-accent)',
                  outlineColor: 'var(--color-accent)',
                }}
              >
                <span className="text-sm font-medium">Request access</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            )}
          </div>

          {/* Footer nav — close cue + prev/next teaser between case studies.
              The footer index used to repeat the hero's "02 / 03"; we now
              promote the next project's title so navigation reads as
              anticipation, not chrome talking to itself.
              Keyboard: ← prev, → next, Esc close. */}
          <div
            className="flex items-center justify-between gap-4 mt-16 pt-6"
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
            <div className="flex items-center gap-3">
              {onPrev && (
                <button
                  type="button"
                  onClick={onPrev}
                  aria-label="Previous case study"
                  className="grid place-items-center outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
                  style={{
                    width: 44,
                    height: 44,
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: 999,
                    outlineColor: 'var(--color-accent)',
                  }}
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
              {onNext && (
                <button
                  type="button"
                  onClick={onNext}
                  className="hidden sm:inline-flex items-center gap-3 pl-3 pr-2 py-2 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
                  style={{
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border)',
                    borderRadius: 999,
                    outlineColor: 'var(--color-accent)',
                  }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>Next</span>
                  <span className="font-medium">{nextTitle}</span>
                  <span
                    aria-hidden="true"
                    className="grid place-items-center"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      backgroundColor: 'var(--color-accent)',
                      color: 'var(--ink-on-image)',
                    }}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              )}
              {onNext && (
                <button
                  type="button"
                  onClick={onNext}
                  aria-label={nextTitle ? `Next case study: ${nextTitle}` : 'Next case study'}
                  className="sm:hidden grid place-items-center outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
                  style={{
                    width: 44,
                    height: 44,
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: 999,
                    outlineColor: 'var(--color-accent)',
                  }}
                >
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </article>
      </motion.div>
    </div>,
    document.body
  );
}
