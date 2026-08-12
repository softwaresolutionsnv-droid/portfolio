import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { webpSrcSet } from '../lib/responsiveImage';
import type { ProjectContent } from '../lib/content';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export type CaseStudyProject = ProjectContent & { id: number };

type Props = {
  project: CaseStudyProject;
  index: number;
  total: number;
  /** Title of the next case study, shown in the footer as anticipation. */
  nextTitle?: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
};

/**
 * The open plate — a full-screen monograph spread. Morphs from the
 * plate via the View Transitions API (see Projects.tsx). Keyboard:
 * Esc closes, ←/→ move between plates.
 */
export function CaseStudy({ project, index, total, nextTitle, onClose, onPrev, onNext }: Props) {
  const reduced = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Latest-callback refs so the mount-only keydown listener always invokes
  // the fresh prev/next/close passed by the parent.
  const onCloseRef = useRef(onClose);
  const onPrevRef = useRef(onPrev);
  const onNextRef = useRef(onNext);
  useEffect(() => {
    onCloseRef.current = onClose;
    onPrevRef.current = onPrev;
    onNextRef.current = onNext;
  });

  // Missing/broken hero asset degrades to a typographic plate.
  const [failedSlug, setFailedSlug] = useState<string | null>(null);
  const imageFailed = failedSlug === project.slug;

  const rootRef = useRef<HTMLDivElement>(null);

  // Lock body scroll, mark background inert, focus close, wire keys,
  // trap Tab inside the dialog.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

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
      if (e.key === 'Tab' && rootRef.current) {
        const nodes = Array.from(
          rootRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
        // getClientRects (not offsetParent) so the fixed close button
        // stays inside the Tab cycle.
        ).filter((n) => !n.hasAttribute('disabled') && n.getClientRects().length > 0);
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
    };
  }, []);

  // Reset scroll when the project swaps in place.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = 0;
    if (progressBarRef.current) progressBarRef.current.style.transform = 'scaleX(0)';
  }, [project.id]);

  // Scroll-progress hairline — updated imperatively.
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
  }, []);

  const no = String(index + 1).padStart(2, '0');

  return createPortal(
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200]"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title}: case study`}
      style={{ backgroundColor: 'var(--scrim-strong)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Reading-progress hairline — Oxide, functional. */}
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
        }}
      >
        <div
          ref={progressBarRef}
          style={{
            height: '100%',
            width: '100%',
            transform: 'scaleX(0)',
            transformOrigin: '0% 50%',
            backgroundColor: 'var(--accent-ink)',
          }}
        />
      </div>

      <motion.div
        ref={scrollRef}
        initial={reduced ? { opacity: 0 } : false}
        animate={reduced ? { opacity: 1 } : {}}
        transition={{ duration: 0.2 }}
        className="cs-surface absolute inset-0 overflow-y-auto overflow-x-hidden"
        style={{
          backgroundColor: 'var(--bg)',
          boxShadow: '0 40px 120px -40px oklch(0 0 0 / 0.5)',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
        }}
      >
        {/* Close — a square hairline control, typeset mark. */}
        <button
          ref={closeBtnRef}
          onClick={onClose}
          aria-label="Close case study"
          className="cs-close fixed z-20 grid place-items-center outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
          style={{
            top: 'calc(env(safe-area-inset-top) + clamp(1rem, 3vw, 2rem))',
            right: 'calc(env(safe-area-inset-right) + clamp(1rem, 4vw, 3rem))',
            width: 44,
            height: 44,
            backgroundColor: 'var(--bg)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            outlineColor: 'var(--accent-ink)',
            fontSize: '1rem',
            lineHeight: 1,
          }}
        >
          <span aria-hidden="true">✕</span>
        </button>

        {/* ------------- SPREAD HEADER ------------- */}
        <header className="mx-auto w-full max-w-[1200px] px-5 sm:px-10 pt-24 sm:pt-28">
          <div
            className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 pb-6"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <div className="min-w-0">
              <p className="t-label mb-3" style={{ color: 'var(--text-muted)' }}>
                Plate {no} / {String(total).padStart(2, '0')} — {project.client} · {project.year}
              </p>
              <h1
                className="t-headline"
                style={{
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                  color: 'var(--text-primary)',
                  viewTransitionName: 'cs-title',
                } as React.CSSProperties}
              >
                {project.title}
              </h1>
            </div>

            {project.showCta &&
              (project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="t-label inline-flex items-center gap-2 shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    color: 'oklch(0.96 0.004 90)',
                    padding: '14px 24px',
                    outlineColor: 'var(--accent-ink)',
                    viewTransitionName: 'cs-badge',
                    transition: 'background-color 200ms ease',
                  } as React.CSSProperties}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-accent-hover)')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-accent)')
                  }
                >
                  Visit live site <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <a
                  href="#contact"
                  onClick={() => onClose()}
                  className="t-label inline-flex items-center gap-2 shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
                  style={{
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border)',
                    padding: '13px 23px',
                    outlineColor: 'var(--accent-ink)',
                    viewTransitionName: 'cs-badge',
                  } as React.CSSProperties}
                >
                  Request access <span aria-hidden="true">↗</span>
                </a>
              ))}
          </div>
        </header>

        {/* ------------- HERO PLATE (morph target) ------------- */}
        <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-10 pt-8 sm:pt-10">
          {project.image && !imageFailed ? (
            <picture>
              <source type="image/webp" srcSet={webpSrcSet(project.image)} sizes="(min-width: 1200px) 1120px, 100vw" />
              <img
                src={project.image}
                alt={project.imageAlt}
                draggable={false}
                decoding="async"
                fetchPriority="high"
                onError={() => setFailedSlug(project.slug)}
                className="block w-full h-auto"
                style={{
                  border: '1px solid var(--border-subtle)',
                  viewTransitionName: 'cs-image',
                } as React.CSSProperties}
              />
            </picture>
          ) : (
            <div
              className="grid place-items-center"
              aria-hidden="true"
              style={{
                aspectRatio: '16 / 10',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <span
                className="t-headline text-center px-6"
                style={{
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                  color: 'var(--emboss)',
                  filter: 'contrast(1.2)',
                }}
              >
                {project.title}
              </span>
            </div>
          )}
        </div>

        {/* ------------- BODY ------------- */}
        <article
          className="mx-auto w-full max-w-[1200px] px-5 sm:px-10"
          style={{
            paddingTop: 'clamp(2.5rem, 5vw, 4rem)',
            paddingBottom: 'max(clamp(3rem, 6vw, 5rem), env(safe-area-inset-bottom))',
          }}
        >
          {/* Lede — the spread's serif opening. */}
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={reduced ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="t-serif"
            style={{
              fontSize: 'clamp(1.375rem, 2.4vw, 1.75rem)',
              lineHeight: 1.5,
              color: 'var(--text-primary)',
              maxWidth: '40ch',
            }}
          >
            {project.lede}
          </motion.p>

          {/* Overview */}
          <div
            style={{
              marginTop: 'clamp(2.5rem, 5vw, 4rem)',
              display: 'grid',
              gap: 'clamp(1rem, 2vw, 1.5rem)',
              maxWidth: '62ch',
            }}
          >
            <h2 className="t-label" style={{ color: 'var(--text-muted)' }}>
              Overview
            </h2>
            {project.overview.map((para, i) => (
              <motion.p
                key={i}
                initial={reduced ? false : { opacity: 0, y: 16 }}
                whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.9, delay: 0.12 * i, ease: EASE }}
                className="t-serif"
                style={{
                  fontSize: '1.125rem',
                  lineHeight: 1.75,
                  color: 'var(--text-secondary)',
                }}
              >
                {para}
              </motion.p>
            ))}
          </div>

          {/* Highlights — a ruled spec table. */}
          {project.highlights.length > 0 && (
            <div style={{ marginTop: 'clamp(3rem, 6vw, 5rem)', maxWidth: '62ch' }}>
            <h2 className="t-label" style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Highlights
            </h2>
            <motion.dl
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={reduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.9, ease: EASE }}
              style={{
                borderTop: '1px solid var(--border)',
              }}
            >
              {project.highlights.map((h) => (
                <div
                  key={h.label}
                  className="grid grid-cols-[8rem_1fr] gap-4 py-3"
                  style={{ borderBottom: '1px solid var(--border-subtle)' }}
                >
                  <dt className="t-label" style={{ color: 'var(--text-muted)', paddingTop: 2 }}>
                    {h.label}
                  </dt>
                  <dd
                    className="t-serif m-0"
                    style={{ fontSize: '1rem', lineHeight: 1.55, color: 'var(--text-primary)' }}
                  >
                    {h.value}
                  </dd>
                </div>
              ))}
            </motion.dl>
            </div>
          )}

          {/* Gallery — additional plates, stacked. */}
          {project.gallery.length > 0 && (
            <div style={{ marginTop: 'clamp(3rem, 6vw, 5rem)' }}>
            <h2 className="t-label" style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Gallery
            </h2>
            <div
              style={{
                display: 'grid',
                gap: 'clamp(1.25rem, 2.5vw, 2rem)',
              }}
            >
              {project.gallery.map((shot, i) => (
                <motion.figure
                  key={`${shot.image}-${i}`}
                  initial={reduced ? false : { opacity: 0, y: 20 }}
                  whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.9, ease: EASE }}
                  style={{ margin: 0, border: '1px solid var(--border-subtle)' }}
                >
                  <picture>
                    <source
                      type="image/webp"
                      srcSet={webpSrcSet(shot.image)}
                      sizes="(min-width: 1200px) 1120px, 100vw"
                    />
                    <img
                      src={shot.image}
                      alt={shot.alt}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className="block w-full h-auto"
                    />
                  </picture>
                </motion.figure>
              ))}
            </div>
            </div>
          )}

          {/* Mobile CTA (desktop has it in the header). */}
          <div className="sm:hidden" style={{ marginTop: 'clamp(2.5rem, 6vw, 3.5rem)' }}>
            {project.showCta &&
              (project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="t-label inline-flex items-center gap-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    color: 'oklch(0.96 0.004 90)',
                    padding: '14px 24px',
                    outlineColor: 'var(--accent-ink)',
                  }}
                >
                  Visit live site <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <a
                  href="#contact"
                  onClick={() => onClose()}
                  className="t-label inline-flex items-center gap-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
                  style={{
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border)',
                    padding: '13px 23px',
                    outlineColor: 'var(--accent-ink)',
                  }}
                >
                  Request access <span aria-hidden="true">↗</span>
                </a>
              ))}
          </div>

          {/* Footer nav — back to index, prev/next plate. */}
          <div
            className="flex items-center justify-between gap-4 mt-16 pt-6"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <button
              onClick={onClose}
              className="t-index inline-flex items-center gap-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{
                color: 'var(--text-secondary)',
                background: 'none',
                border: 'none',
                padding: '8px 0',
                cursor: 'pointer',
                outlineColor: 'var(--accent-ink)',
              }}
            >
              <span aria-hidden="true">←</span> Back to the index
            </button>
            <div className="flex items-center gap-4">
              {/* Surface the existing ←/→ keyboard navigation. */}
              <span
                className="t-index hidden md:inline"
                style={{ color: 'var(--text-muted)' }}
              >
                Leaf with ← →
              </span>
              {onPrev && (
                <button
                  type="button"
                  onClick={onPrev}
                  aria-label="Previous plate"
                  className="grid place-items-center outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
                  style={{
                    width: 44,
                    height: 44,
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                    background: 'none',
                    cursor: 'pointer',
                    outlineColor: 'var(--accent-ink)',
                  }}
                >
                  <span aria-hidden="true">←</span>
                </button>
              )}
              {onNext && (
                <button
                  type="button"
                  onClick={onNext}
                  aria-label={nextTitle ? `Next plate: ${nextTitle}` : 'Next plate'}
                  className="inline-flex items-center gap-3 outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
                  style={{
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border)',
                    background: 'none',
                    padding: '11px 16px',
                    cursor: 'pointer',
                    outlineColor: 'var(--accent-ink)',
                  }}
                >
                  <span className="t-index hidden sm:inline" style={{ color: 'var(--text-muted)' }}>
                    Next
                  </span>
                  <span className="t-index hidden sm:inline">{nextTitle}</span>
                  <span aria-hidden="true">→</span>
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
