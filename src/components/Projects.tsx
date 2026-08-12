import { motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { CaseStudy, type CaseStudyProject } from './CaseStudy';
import { webpSrcSet } from '../lib/responsiveImage';
import { siteContent } from '../lib/content';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const BASE_TITLE = 'Nils Vogelaar — Developer & Designer';

type Project = CaseStudyProject;

/** CMS-managed projects. Ids are assigned from build order (1-based) and
    drive the open state plus the deep-link maps below. */
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

/* ------------------------------------------------------------------
   A plate — the monograph's project pattern (DESIGN.md §5). Full-width,
   hairline-separated, never boxed: colossal thin numeral overlapping
   the image edge, Headline title, serif lede, spec captions. The image
   rests in duotone and develops to color when attended.
   ------------------------------------------------------------------ */

function Plate({
  project,
  index,
  morphing,
  onOpen,
}: {
  project: Project;
  index: number;
  /** True while this plate owns the view-transition-name. */
  morphing: boolean;
  onOpen: () => void;
}) {
  const reduced = useReducedMotion();
  const [errored, setErrored] = useState(false);
  const [developed, setDeveloped] = useState(false);

  const no = String(index + 1).padStart(2, '0');
  const flipped = index % 2 === 1;

  const specs: { label: string; value: string }[] = [
    { label: 'Client', value: project.client },
    { label: 'Year', value: project.year },
    { label: 'Role', value: project.role },
    { label: 'Stack', value: project.tags.join(', ') },
  ];

  return (
    <article
      id={`plate-${no}`}
      className={`plate relative ${developed ? 'is-developed' : ''}`}
      style={{ padding: 'clamp(4rem, 9vh, 8rem) 0' }}
    >
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-10">
        {/* Plate heading row */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={reduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.0, ease: EASE }}
          className={`flex flex-wrap items-end gap-x-8 gap-y-4 mb-8 sm:mb-10 ${
            flipped ? 'flex-row-reverse text-right' : ''
          }`}
        >
          {/* The numeral crosses onto the plate image — the plate's one
              plane-crossing moment (DESIGN.md §5). */}
          <span
            className="t-numeral plate-no leading-none relative z-10 pointer-events-none"
            aria-hidden="true"
            style={{
              fontSize: 'clamp(5rem, 13vw, 12rem)',
              /* color owned by .plate-no in index.css — the Develop inks it */
              marginBottom: 'calc(-2.5rem - 0.3em)',
              viewTransitionName: morphing ? 'cs-badge' : undefined,
            } as React.CSSProperties}
          >
            {no}
          </span>
          <div className={`pb-3 min-w-0 ${flipped ? 'ml-0 mr-auto' : 'ml-0'}`}>
            <p className="t-label mb-3" style={{ color: 'var(--text-muted)' }}>
              Plate {no} — {project.client}
            </p>
            <h3
              className="t-headline"
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                color: 'var(--text-primary)',
                viewTransitionName: morphing ? 'cs-title' : undefined,
              } as React.CSSProperties}
            >
              {project.title}
            </h3>
          </div>
        </motion.div>

        {/* Image + caption grid */}
        <div
          className={`grid gap-8 lg:gap-12 lg:grid-cols-[2fr_minmax(280px,1fr)] ${
            flipped ? 'lg:[direction:rtl]' : ''
          }`}
        >
          {/* The plate image — develops from duotone when attended */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={reduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            onViewportEnter={() => setDeveloped(true)}
            transition={{ duration: 1.1, ease: EASE }}
            className="relative min-w-0"
            style={{ direction: 'ltr' }}
          >
            {errored || !project.image ? (
              /* Missing artwork: a blind-embossed typographic plate. */
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
            ) : (
              <picture>
                <source
                  type="image/webp"
                  srcSet={webpSrcSet(project.image)}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                />
                <img
                  src={project.image}
                  alt={project.imageAlt}
                  draggable={false}
                  className="plate-img block w-full h-auto"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  decoding="async"
                  onError={() => setErrored(true)}
                  style={{
                    border: '1px solid var(--border-subtle)',
                    viewTransitionName: morphing ? 'cs-image' : undefined,
                  } as React.CSSProperties}
                />
              </picture>
            )}
          </motion.div>

          {/* Caption column */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={reduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
            className="flex flex-col self-end min-w-0"
            style={{ direction: 'ltr' }}
          >
            <p
              className="t-serif"
              style={{
                fontSize: '1.0625rem',
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
                maxWidth: '52ch',
              }}
            >
              {project.description}
            </p>

            <dl className="mt-8" style={{ borderTop: '1px solid var(--border)' }}>
              {specs.map((s) => (
                <div
                  key={s.label}
                  className="grid grid-cols-[6rem_1fr] gap-4 py-3"
                  style={{ borderBottom: '1px solid var(--border-subtle)' }}
                >
                  <dt className="t-label" style={{ color: 'var(--text-muted)', paddingTop: 2 }}>
                    {s.label}
                  </dt>
                  <dd
                    className="t-serif m-0"
                    style={{ fontSize: '0.9375rem', lineHeight: 1.5, color: 'var(--text-primary)' }}
                  >
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>

            <span
              className="t-label mt-8 inline-flex items-center gap-2"
              aria-hidden="true"
              style={{ color: 'var(--text-primary)' }}
            >
              Open the plate <span aria-hidden="true">→</span>
            </span>
          </motion.div>
        </div>
      </div>

      {/* Stretched-link overlay — one click target for the whole plate. */}
      <button
        type="button"
        onClick={onOpen}
        className="absolute inset-0 w-full outline-none focus-visible:outline-2 focus-visible:-outline-offset-2"
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          outlineColor: 'var(--accent-ink)',
        }}
        aria-label={`Open case study: ${project.title}`}
      />
    </article>
  );
}

/* ------------------------------------------------------------------ */

export function Projects() {
  const reduced = useReducedMotion();

  // morphingId = plate currently owning the view-transition-name
  // openId     = case study actually rendered
  // Both seed from the URL so /work/:slug deep links open with no morph.
  const [morphingId, setMorphingId] = useState<number | null>(initialCaseStudyId);
  const [openId, setOpenId] = useState<number | null>(initialCaseStudyId);

  const openCaseStudy = useCallback(
    (id: number, push = true) => {
      if (push) {
        const slug = idToSlug.get(id);
        if (slug && window.location.pathname !== `/work/${slug}`) {
          window.history.pushState({ cs: slug }, '', `/work/${slug}`);
        }
      }
      const supports = typeof document !== 'undefined' && 'startViewTransition' in document;
      if (!supports || reduced) {
        setMorphingId(id);
        setOpenId(id);
        return;
      }
      flushSync(() => setMorphingId(id));
      const vt = (
        document as Document & {
          startViewTransition: (cb: () => void) => { finished: Promise<void> };
        }
      ).startViewTransition(() => {
        flushSync(() => setOpenId(id));
      });
      vt.finished.catch(() => {});
    },
    [reduced]
  );

  const closeCaseStudy = useCallback(
    (push: unknown = true) => {
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
    },
    [reduced]
  );

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

  const swap = useCallback(
    (id: number) => {
      // In-place swap replaces the history entry, so Back still closes.
      const slug = idToSlug.get(id);
      if (slug) window.history.replaceState({ cs: slug }, '', `/work/${slug}`);
      const supports = typeof document !== 'undefined' && 'startViewTransition' in document;
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
    },
    [reduced]
  );

  return (
    <section id="projects">
      {/* Section opener: a quiet ruled row, not a display moment. */}
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-10 pt-16 sm:pt-24">
        <div
          className="flex items-baseline justify-between pb-5"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <h2 className="t-label" style={{ color: 'var(--text-muted)' }}>
            The plates — built work
          </h2>
          <span className="t-index" style={{ color: 'var(--text-muted)' }}>
            {String(projects.length).padStart(2, '0')} works · more under NDA
          </span>
        </div>
      </div>

      {projects.map((project, i) => (
        <div key={project.id}>
          <Plate
            project={project}
            index={i}
            morphing={morphingId === project.id && openId !== project.id}
            onOpen={() => openCaseStudy(project.id)}
          />
          {i < projects.length - 1 && (
            <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-10" aria-hidden="true">
              <div style={{ height: 1, backgroundColor: 'var(--border-subtle)' }} />
            </div>
          )}
        </div>
      ))}

      {/* Case study overlay */}
      {openId !== null &&
        (() => {
          const p = projects.find((x) => x.id === openId);
          if (!p) return null;
          const idx = projects.findIndex((x) => x.id === openId);
          const prev = projects[(idx - 1 + projects.length) % projects.length];
          const next = projects[(idx + 1) % projects.length];
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
    </section>
  );
}
