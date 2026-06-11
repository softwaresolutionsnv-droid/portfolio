import { motion, useReducedMotion } from 'framer-motion';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { flushSync } from 'react-dom';
import { ArrowUpRight } from 'lucide-react';
import { CaseStudy, type CaseStudyProject } from './CaseStudy';
import { KineticHeading } from './KineticHeading';
import { webpSrcSet } from '../lib/responsiveImage';
import { siteContent } from '../lib/content';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const BASE_TITLE = 'Nils Vogelaar — Developer & Designer';

type Project = CaseStudyProject;

/** CMS-managed projects. Ids are assigned from build order (1-based) and
    drive the morph/open state plus the deep-link maps below. */
const projects: Project[] = siteContent.projects.map((p, i) => ({
  ...p,
  id: i + 1,
}));

/* ------------------------------------------------------------------
   Case-study deep links — /work/:slug without a router. The overlay
   state is mirrored into history so projects are shareable URLs and
   browser back/forward behaves like navigation.
   ------------------------------------------------------------------ */

const slugToId = new Map(projects.map((p) => [p.slug, p.id]));
const idToSlug = new Map(projects.map((p) => [p.id, p.slug]));

function parseWorkPath(pathname: string): string | null {
  const m = pathname.match(/^\/work\/([a-z0-9-]+)\/?$/i);
  return m ? m[1].toLowerCase() : null;
}

/** Case study to open on first paint when loaded via /work/:slug. */
function initialCaseStudyId(): number | null {
  if (typeof window === 'undefined') return null;
  const slug = parseWorkPath(window.location.pathname);
  return slug ? (slugToId.get(slug) ?? null) : null;
}

/* ------------------------------------------------------------------ */

function ProjectCard({
  project,
  index,
  isActive,
  morphing,
  onOpen,
}: {
  project: Project;
  index: number;
  isActive: boolean;
  /** True while this specific card owns the view-transition-name */
  morphing: boolean;
  onOpen: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div
      className="relative h-full w-full"
      style={{
        // Outline shows on the wrapper when the inner button has keyboard focus.
        // Asymmetric y-padding: tighter top (just a folio + status badge),
        // generous bottom so the title gets a real moment.
        ['--card-pad-x' as string]: 'clamp(1.5rem, 2.5vw, 2.25rem)',
        ['--card-pad-top' as string]: 'clamp(1.125rem, 1.8vw, 1.5rem)',
        ['--card-pad-bottom' as string]: 'clamp(1.75rem, 3vw, 2.75rem)',
      }}
    >
      <article
        className="relative h-full w-full overflow-hidden select-none flex flex-col"
        style={{
          backgroundColor: project.color,
          borderRadius: '8px',
        }}
      >
        {/* ---------- LAYER 1: background image / shimmer / fallback ---------- */}
        {!errored && !loaded && !!project.image && (
          <div
            className="absolute inset-0 shimmer-skeleton pointer-events-none"
            style={{ borderRadius: 'inherit' }}
            aria-hidden="true"
          />
        )}
        {errored || !project.image ? (
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden grid place-items-center"
            aria-hidden="true"
          >
            {/* Flat tinted block + Title typography. No gradient hairline. */}
            <span
              className="font-display"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                letterSpacing: '-0.03em',
                color: 'var(--ink-on-image-subtle)',
              }}
            >
              {project.title}
            </span>
          </div>
        ) : (
          <picture>
            <source type="image/webp" srcSet={webpSrcSet(project.image)} sizes="(min-width: 1024px) 50vw, 100vw" />
            <motion.img
              src={project.image}
              alt={project.imageAlt}
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{
                opacity: loaded ? 1 : 0,
                transition: 'opacity 400ms ease',
                viewTransitionName: morphing ? 'cs-image' : undefined,
              } as React.CSSProperties}
              // Active card carries LCP weight; load it eagerly with high
              // priority so the rail's hero image isn't gated behind lazy
              // observation. Inactive cards stay lazy.
              loading={isActive ? 'eager' : 'lazy'}
              fetchPriority={isActive ? 'high' : 'auto'}
              decoding="async"
              onLoad={() => setLoaded(true)}
              onError={() => setErrored(true)}
              animate={{ scale: isActive ? 1.04 : 1 }}
              transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
            />
          </picture>
        )}

        {/* ---------- LAYER 2: scrim for legibility (tinted graphite) ---------- */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, oklch(0.08 0.012 50 / 0.82) 0%, oklch(0.08 0.012 50 / 0.55) 28%, oklch(0.08 0.012 50 / 0.15) 55%, oklch(0.08 0.012 50 / 0) 72%)',
          }}
        />
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            height: '28%',
            background:
              'linear-gradient(to bottom, oklch(0.08 0.012 50 / 0.35) 0%, oklch(0.08 0.012 50 / 0) 100%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 0 1px var(--hairline-on-image-faint)', borderRadius: 'inherit' }}
        />

        {/* ---------- LAYER 3: chrome ---------- */}
        <div
          className="relative flex flex-col h-full"
          style={{
            padding: 'var(--card-pad-top) var(--card-pad-x) var(--card-pad-bottom)',
            rowGap: 'clamp(1rem, 2vw, 1.5rem)',
          }}
        >
          {/* ROW 1 — HUD: quiet folio marker + destination badge.
              Folio is a small label-scale tabular-nums marker, not a
              Display-scale number — the title at the foot of the card
              is the only Display element on this surface. */}
          <header className="flex items-center justify-between gap-4">
            <span
              className="font-medium tabular-nums"
              style={{
                fontSize: '0.78rem',
                letterSpacing: '0.08em',
                color: 'var(--ink-on-image-muted)',
              }}
            >
              <span style={{ color: 'var(--ink-on-image)' }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span style={{ color: 'var(--ink-on-image-subtle)' }}>
                {' / ' + String(projects.length).padStart(2, '0')}
              </span>
            </span>

            {project.showBadge && (
            <div
              className="flex items-center gap-1.5 shrink-0"
              style={{
                viewTransitionName: morphing ? 'cs-badge' : undefined,
              } as React.CSSProperties}
            >
              <span
                aria-hidden="true"
                className="inline-block"
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '9999px',
                  backgroundColor: project.url
                    ? 'var(--color-accent)'
                    : 'var(--ink-on-image-subtle)',
                }}
              />
              <span
                className="text-[0.72rem] font-medium"
                style={{
                  color: 'var(--ink-on-image-muted)',
                  letterSpacing: '0.02em',
                }}
              >
                {project.url ? 'Live' : 'On request'}
              </span>
              <ArrowUpRight
                className="w-3 h-3"
                style={{ color: 'var(--ink-on-image-subtle)' }}
                aria-hidden="true"
              />
            </div>
            )}
          </header>

          {/* ROW 2 — flexible spacer */}
          <div className="flex-1" aria-hidden="true" />

          {/* ROW 3 — variant-specific content block */}
          <div className="flex flex-col" style={{ rowGap: 'clamp(0.875rem, 1.4vw, 1.25rem)' }}>
            {/* Meta line — Client · Year only. Role lives in the case study. */}
            <div
              className="text-sm font-medium leading-[1.6]"
              style={{ color: 'var(--ink-on-image-muted)', letterSpacing: '0.02em' }}
            >
              <span style={{ color: 'var(--ink-on-image)' }}>{project.client}</span>
              <span className="mx-2" style={{ color: 'var(--ink-on-image-subtle)' }}>
                ·
              </span>
              <span className="tabular-nums">{project.year}</span>
            </div>

            {/* Title — always present, always view-transition target */}
            <h3
              className="font-display"
              style={{
                fontSize: 'clamp(1.75rem, 3.2vw, 2.75rem)',
                lineHeight: 1.02,
                letterSpacing: '-0.03em',
                color: 'var(--ink-on-image)',
                maxWidth: '18ch',
                viewTransitionName: morphing ? 'cs-title' : undefined,
              } as React.CSSProperties}
            >
              {project.title}
            </h3>

            {/* Description + tags — one card vocabulary for every project */}
            <p
              className="text-sm sm:text-base max-w-[52ch]"
              style={{ color: 'var(--ink-on-image-muted)', lineHeight: 1.55 }}
            >
              {project.description}
            </p>
            {project.tags.length > 0 && (
              <div
                className="flex items-center gap-3 pt-3"
                style={{ borderTop: '1px solid var(--hairline-on-image-faint)' }}
              >
                <ul
                  className="flex flex-wrap gap-x-2.5 gap-y-1 text-[0.72rem] tabular-nums"
                  style={{ color: 'var(--ink-on-image-subtle)' }}
                >
                  {project.tags.map((tag, i) => (
                    <li key={tag} className="flex items-center gap-2.5">
                      {i > 0 && (
                        <span
                          aria-hidden="true"
                          className="inline-block"
                          style={{
                            width: '3px',
                            height: '3px',
                            backgroundColor: 'var(--hairline-on-image)',
                          }}
                        />
                      )}
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Stretched-link button overlay. Owns the click + a11y label.
          Sits over the article so the article keeps its semantic chrome
          (heading, paragraphs, lists) instead of being collapsed under
          a single button label. */}
      <button
        type="button"
        draggable={false}
        onClick={(e) => {
          const el = e.currentTarget as HTMLButtonElement & { __wasDragged?: boolean };
          if (el.__wasDragged) {
            e.preventDefault();
            el.__wasDragged = false;
            return;
          }
          onOpen();
        }}
        data-cursor="view"
        className="absolute inset-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{
          outlineColor: 'var(--color-accent)',
          background: 'transparent',
          border: 'none',
          padding: 0,
          borderRadius: '8px',
          cursor: 'pointer',
        }}
        aria-label={`Open case study: ${project.title}`}
      />
    </div>
  );
}

/* ------------------------------------------------------------------
   Draggable horizontal rail — inspired by editorial archive galleries
   ------------------------------------------------------------------ */

function ProjectRail() {
  const reduced = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const segmentRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Cinematic case-study state
  // morphingId = card currently owning view-transition-name (before/after the transition)
  // openId     = case study that is actually rendered on screen
  // Both seed from the URL so /work/:slug deep links open over the rail
  // with no morph (there is no source card on screen yet).
  const [morphingId, setMorphingId] = useState<number | null>(initialCaseStudyId);
  const [openId, setOpenId] = useState<number | null>(initialCaseStudyId);

  // Drag state — use pointer events for mouse AND trackpad click-drag.
  // Native scroll + wheel still works on top (no preventDefault on wheel).
  const dragState = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: 0,
  });

  const updateProgress = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const p = max <= 0 ? 0 : el.scrollLeft / max;

    // Imperatively update each segment's fill — no setState, no re-render.
    segmentRefs.current.forEach((seg, i) => {
      if (!seg) return;
      const segmentProgress = Math.min(
        1,
        Math.max(0, p * (projects.length - 1) - (i - 0.5))
      );
      seg.style.transform = `scaleX(${segmentProgress})`;
    });

    // Find nearest card to viewport center; only setState when it changes.
    const center = el.scrollLeft + el.clientWidth / 2;
    let nearest = 0;
    let best = Infinity;
    cardRefs.current.forEach((c, i) => {
      if (!c) return;
      const mid = c.offsetLeft + c.offsetWidth / 2;
      const d = Math.abs(mid - center);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    setActiveIndex((prev) => (prev === nearest ? prev : nearest));
  }, []);

  useLayoutEffect(() => {
    // Scheduled (not called inline) because updateProgress sets activeIndex;
    // rAF still lands before the next paint.
    const raf = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(raf);
  }, [updateProgress]);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const onScroll = () => updateProgress();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateProgress);
    };
  }, [updateProgress]);

  // Pointer-based drag (mouse; touch already scrolls natively).
  // IMPORTANT: we do NOT call setPointerCapture on pointerdown, because
  // capturing would retarget the subsequent `click` event to the rail and
  // swallow clicks on card buttons. Instead, capture lazily once actual
  // drag movement passes a small threshold.
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return; // let native touch scroll handle it
    const el = railRef.current;
    if (!el) return;
    dragState.current = {
      active: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: 0,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const s = dragState.current;
    if (!s.active) return;
    const el = railRef.current;
    if (!el) return;
    const dx = e.clientX - s.startX;
    s.moved = Math.max(s.moved, Math.abs(dx));
    // Only begin capturing (and visually dragging) once we've passed the slop
    if (!isDragging && s.moved > 5) {
      el.setPointerCapture(e.pointerId);
      setIsDragging(true);
    }
    if (isDragging || s.moved > 5) {
      el.scrollLeft = s.startScroll - dx;
    }
  };

  const endDrag = (e: React.PointerEvent) => {
    const s = dragState.current;
    if (!s.active) return;
    s.active = false;
    setIsDragging(false);
    const el = railRef.current;
    if (el && el.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId);
    }
    // Mark the card wrapper (now a <button>) as dragged to suppress click
    if (s.moved > 6) {
      const target = e.target as HTMLElement | null;
      const btn = target?.closest('button') as
        | (HTMLButtonElement & { __wasDragged?: boolean })
        | null;
      if (btn) btn.__wasDragged = true;
    }
  };

  // Arrow-key + Home/End + digit navigation when rail is focused
  const onKeyDown = (e: React.KeyboardEvent) => {
    let next = activeIndex;
    if (e.key === 'ArrowRight') next = Math.min(projects.length - 1, activeIndex + 1);
    else if (e.key === 'ArrowLeft') next = Math.max(0, activeIndex - 1);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = projects.length - 1;
    else if (/^[1-9]$/.test(e.key)) {
      const i = parseInt(e.key, 10) - 1;
      if (i < projects.length) next = i;
      else return;
    } else {
      return;
    }
    e.preventDefault();
    const card = cardRefs.current[next];
    const el = railRef.current;
    if (!card || !el) return;
    const target = card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2;
    el.scrollTo({ left: target, behavior: reduced ? 'auto' : 'smooth' });
  };

  // ---------- Cinematic case-study open/close ----------

  const openCaseStudy = useCallback(
    (id: number, push = true) => {
      if (push) {
        const slug = idToSlug.get(id);
        if (slug && window.location.pathname !== `/work/${slug}`) {
          window.history.pushState({ cs: slug }, '', `/work/${slug}`);
        }
      }
      // Fallback: no View Transitions (Firefox) or reduced-motion users
      const supports = typeof document !== 'undefined' && 'startViewTransition' in document;
      if (!supports || reduced) {
        setMorphingId(id);
        setOpenId(id);
        return;
      }
      // 1. Synchronously mount the view-transition-name on the card
      flushSync(() => setMorphingId(id));
      // 2. Capture old state + run new state in one frame
      const vt = (
        document as Document & {
          startViewTransition: (cb: () => void) => { finished: Promise<void> };
        }
      ).startViewTransition(() => {
        flushSync(() => setOpenId(id));
      });
      vt.finished.catch(() => {
        /* transition cancelled, no-op */
      });
    },
    [reduced]
  );

  // `push` may receive a DOM event when used directly as an event handler;
  // any truthy value means "record this close in history".
  const closeCaseStudy = useCallback((push: unknown = true) => {
    if (push && window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    const supports = typeof document !== 'undefined' && 'startViewTransition' in document;
    if (!supports || reduced) {
      setOpenId(null);
      setMorphingId(null);
      return;
    }
    const vt = (
      document as Document & {
        startViewTransition: (cb: () => void) => { finished: Promise<void> };
      }
    ).startViewTransition(() => {
      flushSync(() => setOpenId(null));
    });
    vt.finished.finally(() => setMorphingId(null));
  }, [reduced]);

  // Unknown /work/:slug deep links fall back to the root URL.
  useEffect(() => {
    const slug = parseWorkPath(window.location.pathname);
    if (slug && !slugToId.has(slug)) window.history.replaceState({}, '', '/');
  }, []);

  // Browser back/forward drives the overlay.
  useEffect(() => {
    const onPop = () => {
      const slug = parseWorkPath(window.location.pathname);
      const id = slug ? slugToId.get(slug) : undefined;
      if (id != null) openCaseStudy(id, false);
      else closeCaseStudy(false);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [openCaseStudy, closeCaseStudy]);

  // Document title mirrors the open case study.
  useEffect(() => {
    if (openId == null) {
      document.title = BASE_TITLE;
      return;
    }
    const p = projects.find((x) => x.id === openId);
    if (p) document.title = `${p.title} · Nils Vogelaar`;
  }, [openId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
      viewport={{ once: true, margin: '-80px' }}
    >
      {/* HUD bar + segmented progress — aligned with the section header grid.
          Right slot shows the active project's title so it's content, not a
          duplicate counter (the segmented progress already tracks position). */}
      <div className="max-w-6xl mx-auto w-full px-5 sm:px-8">
        <div
          className="flex items-end justify-between gap-4 mb-3"
        >
          <span
            className="hidden sm:inline text-sm font-medium whitespace-nowrap"
            style={{ color: 'var(--text-muted)', letterSpacing: '0.02em' }}
            aria-hidden="true"
          >
            Drag, scroll, or press 1–{Math.min(projects.length, 9)}
          </span>

          <span
            key={activeIndex}
            className="font-medium tabular-nums truncate ml-auto max-w-full sm:max-w-[60%] text-right"
            style={{
              fontSize: '0.78rem',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
            }}
            aria-live="polite"
          >
            <span style={{ color: 'var(--text-secondary)' }}>
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className="mx-2" style={{ color: 'var(--text-muted)' }}>·</span>
            <span style={{ color: 'var(--text-primary)' }}>
              {projects[activeIndex]?.title}
            </span>
          </span>
        </div>

        {/* Progress indicator — segmented ticks, one per project. Mechanical
            chrome, demoted to text-muted; the One Beacon on this surface is
            the per-card Live badge. Updated imperatively via segmentRefs. */}
        <div
          className="flex items-center gap-1.5 mb-6"
          role="presentation"
        >
        {projects.map((_, i) => {
          const isCurrent = i === activeIndex;
          return (
            <div
              key={i}
              className="relative flex-1 h-px overflow-hidden"
              style={{
                backgroundColor: 'var(--border-subtle)',
                opacity: isCurrent ? 1 : 0.85,
              }}
            >
              <div
                ref={(el) => {
                  segmentRefs.current[i] = el;
                }}
                className="absolute inset-0"
                style={{
                  backgroundColor: 'var(--text-muted)',
                  transformOrigin: '0% 50%',
                  transform: 'scaleX(0)',
                  transition: 'transform 120ms linear',
                }}
              />
            </div>
          );
        })}
        </div>
      </div>

      {/* The rail */}
      <div
        ref={railRef}
        tabIndex={0}
        role="region"
        aria-label="Selected work: horizontal gallery. Use arrow keys to navigate."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        data-cursor="drag"
        className="rail-scroll flex gap-4 sm:gap-6 overflow-x-auto overflow-y-hidden pb-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          scrollSnapType: 'x mandatory',
          scrollPaddingLeft: 'clamp(16px, 4vw, 48px)',
          paddingLeft: 'clamp(16px, 4vw, 48px)',
          paddingRight: 'clamp(16px, 4vw, 48px)',
          scrollBehavior: isDragging ? 'auto' : undefined,
          outlineColor: 'var(--color-accent)',
        }}
      >
        {projects.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="shrink-0"
            style={{
              width: 'min(92vw, 1100px)',
              height: 'clamp(440px, 78vh, 720px)',
              scrollSnapAlign: 'center',
              scrollSnapStop: 'always',
            }}
          >
            <ProjectCard
              project={project}
              index={i}
              isActive={activeIndex === i}
              morphing={morphingId === project.id && openId !== project.id}
              onOpen={() => openCaseStudy(project.id)}
            />
          </div>
        ))}
      </div>

      {/* Cinematic case study overlay */}
      {openId !== null && (() => {
        const p = projects.find((x) => x.id === openId);
        if (!p) return null;
        const idx = projects.findIndex((x) => x.id === openId);
        const prev = projects[(idx - 1 + projects.length) % projects.length];
        const next = projects[(idx + 1) % projects.length];
        const swap = (id: number) => {
          // In-place swap replaces the history entry, so Back still closes.
          const slug = idToSlug.get(id);
          if (slug) window.history.replaceState({ cs: slug }, '', `/work/${slug}`);
          const supports =
            typeof document !== 'undefined' && 'startViewTransition' in document;
          if (!supports || reduced) {
            setMorphingId(id);
            setOpenId(id);
            return;
          }
          const vt = (
            document as Document & {
              startViewTransition: (cb: () => void) => { finished: Promise<void> };
            }
          ).startViewTransition(() => {
            flushSync(() => {
              setMorphingId(id);
              setOpenId(id);
            });
          });
          vt.finished.catch(() => {});
        };
        return (
          <CaseStudy
            project={p}
            index={idx}
            total={projects.length}
            nextTitle={projects.length > 1 ? next.title : undefined}
            onClose={closeCaseStudy}
            onPrev={projects.length > 1 ? () => swap(prev.id) : undefined}
            onNext={projects.length > 1 ? () => swap(next.id) : undefined}
          />
        );
      })()}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */

export function Projects() {
  return (
    <section id="projects" className="py-20 sm:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto w-full px-5 sm:px-8 mb-8 sm:mb-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          viewport={{ once: true }}
        >
          <div
            className="flex items-end justify-between border-b pb-6"
            style={{ borderColor: 'var(--border)' }}
          >
            <div>
              <span
                className="block text-xs font-medium uppercase tracking-[0.18em] mb-3"
                style={{ color: 'var(--text-muted)' }}
              >
                Archive · 2024 / 2025
              </span>
              <KineticHeading
                as="h2"
                lines={['Selected Work.']}
                className="font-display"
                style={{
                  fontSize: 'clamp(2.25rem, 5.5vw, 4.5rem)',
                  lineHeight: 1,
                  letterSpacing: '-0.035em',
                }}
              />
            </div>
            <span
              className="font-display text-sm tabular-nums hidden sm:block pb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              {String(projects.length).padStart(2, '0')} projects
            </span>
          </div>
        </motion.div>
      </div>

      <ProjectRail />

      <div className="max-w-6xl mx-auto w-full px-5 sm:px-8">
        <motion.p
          className="mt-14 sm:mt-16 text-sm max-w-[50ch]"
          style={{ color: 'var(--text-muted)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          Additional projects available under NDA. Details on request.
        </motion.p>
      </div>
    </section>
  );
}
