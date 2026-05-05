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

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Project = CaseStudyProject & {
  /** Visual treatment for the rail card. Three projects, three layouts. */
  cardVariant?: 'standard' | 'stat-led' | 'image-bleed';
  /** Used by the 'stat-led' variant: the headline number that replaces
      the description block on the rail. Falls back to first highlight. */
  pullStat?: { value: string; label: string };
};

const projects: Project[] = [
  {
    id: 1,
    title: 'BerijdersApp',
    description:
      'White-label mobile app for lease drivers. One overview for contract, mileage, damage reports, fines, and a fuel-score derived from every fill-up. Replaces the paper driver handbook with a tap-to-act digital version.',
    tags: ['Vue.js', 'TypeScript', 'Ionic', 'Capacitor'],
    role: 'Frontend Developer',
    year: '2025',
    client: 'Autodisk',
    url: 'https://www.autodisk.nl/leasemaatschappij/berijdersapp/',
    image: '/projects/berijdersapp.jpg',
    imageAlt:
      'BerijdersApp mobile screens showing lease contract overview, mileage, and fuel consumption score',
    color: 'oklch(0.22 0.05 230)',
    overview: [
      'BerijdersApp replaces the paper driver handbook that comes with every lease vehicle. Drivers get one tap-to-act surface for their contract, mileage, damages, fines, and fuel card. No phone calls, no email chains.',
      'The app is white-labeled per lease company: brand, copy, and enabled modules all driven by configuration. A single Ionic/Capacitor codebase ships to iOS and Android, with shared logic between the app and Autodisk\u2019s wider web platform.',
      'The fuel-score is the interesting part: every fill-up the driver logs is normalised against vehicle, route, and climate, then surfaced as a running score. It turns a back-office KPI into something a driver actually engages with.',
    ],    cardVariant: 'standard',    highlights: [
      { label: 'Platform', value: 'iOS · Android · Web' },
      { label: 'Shipped', value: 'White-label, 6 lease co\u2019s' },
      { label: 'Scope', value: 'Contract, damage, fines, fuel-score' },
      { label: 'Team', value: 'Solo frontend, in-house designer' },
    ],
  },
  {
    id: 2,
    title: 'FleetDisk',
    description:
      'Self-service fleet management portal for lease companies. 24/7 insight into damages, fines, fuel cards, insurance, and lease orders: one pane over what used to be five separate back-offices.',

    tags: ['Nuxt.js', 'Vue.js', 'TypeScript', 'Bootstrap'],
    role: 'Frontend Developer',
    year: '2024',
    client: 'Autodisk',
    image: '/projects/fleetdisk.jpg',
    imageAlt:
      'FleetDisk fleet management portal showing vehicle overview and dashboard analytics',
    color: 'oklch(0.20 0.04 220)',
    overview: [
      'FleetDisk is the self-service portal lease companies use to run a live fleet. 24/7 insight into damage reports, fines, fuel cards, insurance, and open lease orders: a single pane over what used to be five legacy back-offices.',
      'Built on Nuxt 3 with strict TypeScript on top of the iWise backoffice API. The challenge was not rendering. It was shaping thirty years of enterprise data into something a fleet manager can scan in three seconds.',
      'Deep filtering, saved views, and CSV export mean power users stop asking the helpdesk for reports. The helpdesk team got their afternoons back.',
    ],
    highlights: [
      { label: 'Users', value: 'Fleet managers, B2B' },
      { label: 'Data scale', value: '100k+ vehicles, live' },
      { label: 'Stack', value: 'Nuxt 3 \u00b7 TS \u00b7 REST' },
      { label: 'Outcome', value: 'Helpdesk tickets down' },
    ],
    cardVariant: 'stat-led',
    pullStat: { value: '100k+', label: 'Vehicles, live' },
  },
  {
    id: 3,
    title: 'N.B. Onderhoudsdiensten',
    description:
      'Brand identity and marketing site for a Dutch renovation duo. Warm, premium aesthetic built to convert local homeowners. Social proof above the fold, quote CTAs at every decision point.',

    tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    role: 'Designer',
    year: '2025',
    client: 'Freelance',
    url: 'https://nbonderhoud.nl/',
    image: '/projects/nb-onderhoudsdiensten.jpg',
    imageAlt:
      'N.B. Onderhoudsdiensten hero section with dark background, serif typography, and blue/gold accent colors',
    color: 'oklch(0.18 0.03 240)',
    overview: [
      'N.B. Onderhoudsdiensten is a two-person renovation duo in the Netherlands who needed a brand and a site that punched above their weight. The brief: look like a crew you\u2019d trust with your kitchen, not like a templated contractor.',
      'Dark, warm, editorial. Serif typography for confidence, a gold accent for craft, lots of air. Social proof sits above the fold, quote CTAs follow the eye down the page.',
      'Built in Next.js with internationalisation (NL/EN) from day one. Sub-second Lighthouse scores across all pages, and a booking flow built to convert.',
    ],    cardVariant: 'image-bleed',    highlights: [
      { label: 'Deliverable', value: 'Brand + site + copy' },
      { label: 'Tech', value: 'Next.js \u00b7 i18n \u00b7 CMS' },
      { label: 'Lighthouse', value: '98 / 100 / 100 / 100' },
      { label: 'Conversion', value: '\u22483\u00d7 category avg.' },
    ],
  },
];

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
  const variant = project.cardVariant ?? 'standard';

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
        {!errored && !loaded && (
          <div
            className="absolute inset-0 shimmer-skeleton pointer-events-none"
            style={{ borderRadius: 'inherit' }}
            aria-hidden="true"
          />
        )}
        {errored ? (
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
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            animate={{ scale: isActive ? 1.04 : 1 }}
            transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
          />
        )}

        {/* ---------- LAYER 2: scrim for legibility (tinted graphite) ---------- */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              variant === 'image-bleed'
                ? 'linear-gradient(to top, oklch(0.08 0.012 50 / 0.65) 0%, oklch(0.08 0.012 50 / 0.25) 35%, oklch(0.08 0.012 50 / 0) 65%)'
                : 'linear-gradient(to top, oklch(0.08 0.012 50 / 0.82) 0%, oklch(0.08 0.012 50 / 0.55) 28%, oklch(0.08 0.012 50 / 0.15) 55%, oklch(0.08 0.012 50 / 0) 72%)',
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
                fontSize:
                  variant === 'image-bleed'
                    ? 'clamp(2rem, 3.8vw, 3.25rem)'
                    : 'clamp(1.75rem, 3.2vw, 2.75rem)',
                lineHeight: 1.02,
                letterSpacing: '-0.03em',
                color: 'var(--ink-on-image)',
                maxWidth: '18ch',
                viewTransitionName: morphing ? 'cs-title' : undefined,
              } as React.CSSProperties}
            >
              {project.title}
            </h3>

            {/* Variant: standard — description + tags */}
            {variant === 'standard' && (
              <>
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
              </>
            )}

            {/* Variant: stat-led — replace description with a pulled stat */}
            {variant === 'stat-led' && project.pullStat && (
              <div
                className="flex items-baseline gap-3 pt-3"
                style={{ borderTop: '1px solid var(--hairline-on-image-faint)' }}
              >
                <span
                  className="font-display tabular-nums"
                  style={{
                    fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
                    lineHeight: 0.95,
                    letterSpacing: '-0.04em',
                    color: 'var(--ink-on-image)',
                  }}
                >
                  {project.pullStat.value}
                </span>
                <span
                  className="text-sm max-w-[18ch]"
                  style={{ color: 'var(--ink-on-image-muted)', lineHeight: 1.4 }}
                >
                  {project.pullStat.label}
                </span>
              </div>
            )}

            {/* Variant: image-bleed — minimal chrome, no description, no tags */}
            {/* (intentionally empty — title and meta already rendered above) */}
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
  const [morphingId, setMorphingId] = useState<number | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);

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
    updateProgress();
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
    (id: number) => {
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

  const closeCaseStudy = useCallback(() => {
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
            className="text-sm font-medium"
            style={{ color: 'var(--text-muted)', letterSpacing: '0.02em' }}
            aria-hidden="true"
          >
            Drag, scroll, arrow keys, 1–3
          </span>

          <span
            key={activeIndex}
            className="font-medium tabular-nums truncate max-w-[60%] text-right"
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
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
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
              <h2
                className="font-display"
                style={{
                  fontSize: 'clamp(2.25rem, 5.5vw, 4.5rem)',
                  lineHeight: 1,
                  letterSpacing: '-0.035em',
                }}
              >
                Selected Work.
              </h2>
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
