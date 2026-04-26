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

type Project = CaseStudyProject;

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
    ],
    highlights: [
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
      'Self-service fleet management portal for lease companies. 24/7 insight into damages, fines, fuel cards, insurance, and lease orders, built on the iWise backoffice API.',
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
      { label: 'Outcome', value: '\u2212 helpdesk tickets' },
    ],
  },
  {
    id: 3,
    title: 'N.B. Onderhoudsdiensten',
    description:
      'Brand identity and marketing site for a Dutch renovation duo. Warm, premium aesthetic built to convert local homeowners. Trust-first, social-proof-forward.',
    tags: ['React', 'TypeScript', 'Tailwind CSS'],
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
      'Built in Next.js with internationalisation (NL/EN) from day one. Sub-second Lighthouse scores across all pages, and a booking flow that converts at roughly 3\u00d7 the local-contractor benchmark.',
    ],
    highlights: [
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

  const inner = (
    <article
      className="relative h-full w-full overflow-hidden select-none flex flex-col"
      style={{
        backgroundColor: project.color,
        borderRadius: '8px',
        // Unified fluid padding scale — consistent on all four sides
        ['--card-pad-x' as string]: 'clamp(1.5rem, 2.5vw, 2.25rem)',
        ['--card-pad-y' as string]: 'clamp(1.5rem, 2.5vw, 2.25rem)',
      }}
    >
      {/* ---------- LAYER 1: background image / shimmer / fallback mark ---------- */}
      {!errored && !loaded && (
        <div
          className="absolute inset-0 shimmer-skeleton pointer-events-none"
          style={{ borderRadius: 'inherit' }}
          aria-hidden="true"
        />
      )}
      {errored ? (
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          {/* Asymmetric, oversized monogram — composition, not a lonely dot */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            className="absolute"
            style={{
              top: '-8%',
              right: '-14%',
              width: '78%',
              height: 'auto',
              opacity: 0.09,
            }}
          >
            <text
              x="50"
              y="72"
              textAnchor="middle"
              fontFamily="'Bricolage Grotesque', system-ui, sans-serif"
              fontSize="100"
              fontWeight="700"
              fill="oklch(1 0 0)"
              letterSpacing="-6"
            >
              {project.title.charAt(0)}
            </text>
          </svg>
          {/* Hairline divider line intersecting the mark, for composition */}
          <div
            className="absolute left-0 right-0"
            style={{
              top: '38%',
              height: '1px',
              background:
                'linear-gradient(to right, oklch(1 0 0 / 0) 0%, oklch(1 0 0 / 0.14) 30%, oklch(1 0 0 / 0.14) 70%, oklch(1 0 0 / 0) 100%)',
            }}
          />
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

      {/* ---------- LAYER 2: scrim for legibility ---------- */}
      {/* Stronger bottom gradient guarantees text contrast on any image */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, oklch(0 0 0 / 0.82) 0%, oklch(0 0 0 / 0.55) 28%, oklch(0 0 0 / 0.15) 55%, oklch(0 0 0 / 0) 72%)',
        }}
      />
      {/* Top soft-darken so HUD chrome stays legible on light image tops */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: '28%',
          background:
            'linear-gradient(to bottom, oklch(0 0 0 / 0.35) 0%, oklch(0 0 0 / 0) 100%)',
        }}
      />
      {/* Inner hairline */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 0 1px oklch(1 0 0 / 0.06)', borderRadius: 'inherit' }}
      />

      {/* ---------- LAYER 3: chrome — flex column with 3 rows ---------- */}
      <div
        className="relative flex flex-col h-full"
        style={{
          padding: 'var(--card-pad-y) var(--card-pad-x)',
          rowGap: 'clamp(1rem, 2vw, 1.5rem)',
        }}
      >
        {/* ROW 1 — HUD: index + destination badge */}
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span
              className="font-display tabular-nums"
              style={{
                fontSize: 'clamp(2.25rem, 4.8vw, 4rem)',
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
                color: 'oklch(1 0 0 / 0.95)',
              }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <span
              className="font-display tabular-nums"
              style={{
                fontSize: 'clamp(0.75rem, 1vw, 0.9rem)',
                color: 'oklch(1 0 0 / 0.55)',
                letterSpacing: '0.05em',
              }}
            >
              / {String(projects.length).padStart(2, '0')}
            </span>
          </div>

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
                  ? 'var(--color-accent, oklch(0.65 0.22 25))'
                  : 'oklch(1 0 0 / 0.45)',
              }}
            />
            <span
              className="text-[0.72rem] font-medium"
              style={{
                color: 'oklch(1 0 0 / 0.85)',
                letterSpacing: '0.02em',
              }}
            >
              {project.url ? 'Live' : 'On request'}
            </span>
            <ArrowUpRight
              className="w-3 h-3"
              style={{ color: 'oklch(1 0 0 / 0.6)' }}
              aria-hidden="true"
            />
          </div>
        </header>

        {/* ROW 2 — flexible spacer, owns the visual breathing room */}
        <div className="flex-1" aria-hidden="true" />

        {/* ROW 3 — content block */}
        <div className="flex flex-col" style={{ rowGap: 'clamp(0.875rem, 1.4vw, 1.25rem)' }}>
          {/* Meta line */}
          <div
            className="text-sm font-medium leading-[1.6]"
            style={{ color: 'oklch(1 0 0 / 0.7)', letterSpacing: '0.02em' }}
          >
            <span style={{ color: 'oklch(1 0 0 / 0.92)' }}>{project.client}</span>
            <span className="mx-2" style={{ color: 'oklch(1 0 0 / 0.28)' }}>
              ·
            </span>
            <span className="tabular-nums">{project.year}</span>
            <span className="mx-2" style={{ color: 'oklch(1 0 0 / 0.28)' }}>
              ·
            </span>
            <span>{project.role}</span>
          </div>

          {/* Title — generous space above (handled by rowGap) AND below */}
          <h3
            className="font-display"
            style={{
              fontSize: 'clamp(1.75rem, 3.2vw, 2.75rem)',
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
              color: 'oklch(1 0 0 / 0.98)',
              maxWidth: '18ch',
              viewTransitionName: morphing ? 'cs-title' : undefined,
            } as React.CSSProperties}
          >
            {project.title}
          </h3>

          {/* Description */}
          <p
            className="text-sm sm:text-base max-w-[52ch]"
            style={{ color: 'oklch(1 0 0 / 0.78)', lineHeight: 1.55 }}
          >
            {project.description}
          </p>

          {/* Tags — visually demoted below a hairline divider */}
          {project.tags.length > 0 && (
            <div
              className="flex items-center gap-3 pt-3"
              style={{ borderTop: '1px solid oklch(1 0 0 / 0.1)' }}
            >
              <ul
                className="flex flex-wrap gap-x-2.5 gap-y-1 text-[0.72rem] tabular-nums"
                style={{ color: 'oklch(1 0 0 / 0.5)' }}
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
                          backgroundColor: 'oklch(1 0 0 / 0.22)',
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
  );

  return (
    <button
      type="button"
      draggable={false}
      onClick={(e) => {
        // Prevent open after a drag gesture
        const el = e.currentTarget as HTMLButtonElement & { __wasDragged?: boolean };
        if (el.__wasDragged) {
          e.preventDefault();
          el.__wasDragged = false;
          return;
        }
        onOpen();
      }}
      className="block h-full w-full text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
      style={{
        outlineColor: 'var(--color-accent, oklch(0.65 0.22 25))',
        background: 'transparent',
        border: 'none',
        padding: 0,
      }}
      aria-label={`Open case study: ${project.title}`}
    >
      {inner}
    </button>
  );
}

/* ------------------------------------------------------------------
   Draggable horizontal rail — inspired by editorial archive galleries
   ------------------------------------------------------------------ */

function ProjectRail() {
  const reduced = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
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
    setProgress(p);

    // find nearest card to left edge + viewport center
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
    setActiveIndex(nearest);
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
      {/* HUD bar + segmented progress — aligned with the section header grid */}
      <div className="max-w-6xl mx-auto w-full px-5 sm:px-8">
        <div
          className="flex items-end justify-between gap-4 mb-4"
          aria-hidden="true"
        >
          <div className="flex items-center gap-3">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: 'var(--color-accent, oklch(0.65 0.22 25))' }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: 'var(--text-muted)', letterSpacing: '0.02em' }}
            >
              Drag, scroll, arrow keys, 1–3
            </span>
          </div>

          <div className="flex items-baseline gap-3 font-display tabular-nums">
            <span
              style={{
                fontSize: 'clamp(1.25rem, 2vw, 1.75rem)',
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span
              className="text-xs"
              style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}
            >
              / {String(projects.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Progress indicator — segmented ticks, one per project (honest) */}
        <div
          className="flex items-center gap-1.5 mb-8"
          role="presentation"
        >
        {projects.map((_, i) => {
          const segmentProgress = Math.min(
            1,
            Math.max(0, progress * (projects.length - 1) - (i - 0.5))
          );
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
              <motion.div
                className="absolute inset-y-0 left-0"
                style={{
                  backgroundColor: 'var(--color-accent, oklch(0.65 0.22 25))',
                  width: `${segmentProgress * 100}%`,
                }}
                transition={{ duration: 0.15 }}
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
          outlineColor: 'var(--color-accent, oklch(0.65 0.22 25))',
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
        return (
          <CaseStudy
            project={p}
            index={idx}
            total={projects.length}
            onClose={closeCaseStudy}
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
      <div className="max-w-6xl mx-auto w-full px-5 sm:px-8 mb-10 sm:mb-14">
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
