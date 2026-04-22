import { motion, useReducedMotion } from 'framer-motion';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { ArrowUpRight } from 'lucide-react';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Project = {
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
  },
  {
    id: 2,
    title: 'FleetDisk',
    description:
      'Self-service fleet management portal for lease companies. 24/7 insight into damages, fines, fuel cards, insurance, and lease orders — built on the iWise backoffice API.',
    tags: ['Nuxt.js', 'Vue.js', 'TypeScript', 'Bootstrap'],
    role: 'Frontend Developer',
    year: '2024',
    client: 'Autodisk',
    image: '/projects/fleetdisk.jpg',
    imageAlt:
      'FleetDisk fleet management portal showing vehicle overview and dashboard analytics',
    color: 'oklch(0.20 0.04 220)',
  },
  {
    id: 3,
    title: 'N.B. Onderhoudsdiensten',
    description:
      'Brand identity and marketing site for a Dutch renovation duo. Warm, premium aesthetic built to convert local homeowners — trust-first, social-proof-forward.',
    tags: ['React', 'TypeScript', 'Tailwind CSS'],
    role: 'Designer',
    year: '2025',
    client: 'Freelance',
    url: 'https://nbonderhoud.nl/',
    image: '/projects/nb-onderhoudsdiensten.jpg',
    imageAlt:
      'N.B. Onderhoudsdiensten hero section with dark background, serif typography, and blue/gold accent colors',
    color: 'oklch(0.18 0.03 240)',
  },
];

/* ------------------------------------------------------------------ */

function ProjectCard({
  project,
  index,
  isActive,
}: {
  project: Project;
  index: number;
  isActive: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const isAutodisk = project.client === 'Autodisk';

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
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 400ms ease' }}
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
            className="flex items-center gap-1.5 px-2.5 py-1 shrink-0"
            style={{
              backgroundColor: project.url
                ? 'var(--color-accent, oklch(0.65 0.22 25))'
                : 'oklch(1 0 0 / 0.12)',
              borderRadius: '2px',
              border: project.url
                ? '1px solid oklch(0.65 0.22 25 / 0.6)'
                : '1px solid oklch(1 0 0 / 0.22)',
            }}
          >
            <span
              className="text-[0.62rem] font-medium uppercase tracking-[0.18em]"
              style={{ color: 'oklch(1 0 0 / 0.95)' }}
            >
              {project.url ? 'Live' : 'On request'}
            </span>
            <ArrowUpRight
              className="w-3 h-3"
              style={{ color: 'oklch(1 0 0 / 0.95)' }}
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
            className="text-[0.68rem] font-medium uppercase tracking-[0.18em] leading-[1.6]"
            style={{ color: 'oklch(1 0 0 / 0.65)' }}
          >
            <span
              style={{
                color: isAutodisk
                  ? 'var(--color-accent, oklch(0.72 0.22 25))'
                  : 'oklch(1 0 0 / 0.8)',
              }}
            >
              {project.client}
            </span>
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
            }}
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

  return project.url ? (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      draggable={false}
      onClick={(e) => {
        // Prevent link navigation after a drag
        const el = e.currentTarget as HTMLAnchorElement & { __wasDragged?: boolean };
        if (el.__wasDragged) {
          e.preventDefault();
          el.__wasDragged = false;
        }
      }}
      className="block h-full w-full outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
      style={{ outlineColor: 'var(--color-accent, oklch(0.65 0.22 25))' }}
      aria-label={`${project.title} — opens in new tab`}
    >
      {inner}
    </a>
  ) : (
    <a
      href="#contact"
      draggable={false}
      onClick={(e) => {
        const el = e.currentTarget as HTMLAnchorElement & { __wasDragged?: boolean };
        if (el.__wasDragged) {
          e.preventDefault();
          el.__wasDragged = false;
        }
      }}
      className="block h-full w-full outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
      style={{ outlineColor: 'var(--color-accent, oklch(0.65 0.22 25))' }}
      aria-label={`${project.title} — details on request, jumps to contact`}
    >
      {inner}
    </a>
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

  // Pointer-based drag (mouse; touch already scrolls natively)
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
    el.setPointerCapture(e.pointerId);
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const s = dragState.current;
    if (!s.active) return;
    const el = railRef.current;
    if (!el) return;
    const dx = e.clientX - s.startX;
    s.moved = Math.max(s.moved, Math.abs(dx));
    el.scrollLeft = s.startScroll - dx;
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
    // Mark link as dragged to suppress the click that follows, if any.
    if (s.moved > 6) {
      const target = e.target as HTMLElement | null;
      const a = target?.closest('a') as (HTMLAnchorElement & { __wasDragged?: boolean }) | null;
      if (a) a.__wasDragged = true;
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
              className="text-[0.68rem] font-medium uppercase tracking-[0.22em]"
              style={{ color: 'var(--text-muted)' }}
            >
              Drag · Scroll · Arrow keys · 1–3
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
        aria-label="Selected work — horizontal gallery. Use arrow keys to navigate."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        className="rail-scroll flex gap-4 sm:gap-6 overflow-x-auto overflow-y-hidden pb-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          scrollSnapType: 'x mandatory',
          scrollPaddingLeft: 'clamp(20px, 6vw, 80px)',
          paddingLeft: 'clamp(20px, 6vw, 80px)',
          paddingRight: 'clamp(20px, 6vw, 80px)',
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
              width: 'clamp(280px, 62vw, 720px)',
              height: 'clamp(380px, 70vh, 620px)',
              scrollSnapAlign: 'center',
            }}
          >
            <ProjectCard project={project} index={i} isActive={activeIndex === i} />
          </div>
        ))}
      </div>
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
                Archive / 2024 — 2025
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
