import { motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { CaseStudy, type CaseStudyWerkstuk } from './CaseStudy';
import { McpDiagram } from './McpDiagram';
import { webpSrcSet } from '../lib/responsiveImage';
import { siteContent, GROEP_VOLGORDE } from '../lib/content';
import { useLoc, useT } from '../lib/i18n';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Plaat = CaseStudyWerkstuk;

/** Werkstukken in display order — content.json is pre-sorted by groep
    (apps-ai → mcp-tooling → sites-merk); ids are global (1-based) and
    drive the open state plus the deep-link maps below. */
const werkstukken: Plaat[] = siteContent.werkstukken.map((w, i) => ({
  ...w,
  id: i + 1,
}));

/* ------------------------------------------------------------------
   Case-page deep links — /work/:slug without a router. The overlay
   state is mirrored into history so werkstukken are shareable URLs and
   browser back/forward behaves like navigation.
   ------------------------------------------------------------------ */

const slugToId = new Map(werkstukken.map((w) => [w.slug, w.id]));
const idToSlug = new Map(werkstukken.map((w) => [w.id, w.slug]));

function parseWorkPath(pathname: string): string | null {
  const m = pathname.match(/^\/work\/([a-z0-9-]+)\/?$/i);
  return m ? m[1].toLowerCase() : null;
}

/** Case page to open on first paint when loaded via /work/:slug. */
function initialCaseStudyId(): number | null {
  if (typeof window === 'undefined') return null;
  const slug = parseWorkPath(window.location.pathname);
  return slug ? (slugToId.get(slug) ?? null) : null;
}

/* ------------------------------------------------------------------
   A plate — the monograph's werkstuk pattern (DESIGN.md §5). Full-width,
   hairline-separated, never boxed: colossal thin numeral overlapping
   the image edge, Headline title, serif bovenlaag, spec captions. The
   image rests in duotone and develops to color when attended.
   ------------------------------------------------------------------ */

function Plate({
  werkstuk,
  index,
  morphing,
  onOpen,
}: {
  werkstuk: Plaat;
  index: number;
  /** True while this plate owns the view-transition-name. */
  morphing: boolean;
  onOpen: () => void;
}) {
  const reduced = useReducedMotion();
  const t = useT();
  const loc = useLoc();
  const [errored, setErrored] = useState(false);
  const [developed, setDeveloped] = useState(false);

  const no = String(index + 1).padStart(2, '0');
  const flipped = index % 2 === 1;

  const specs: { label: string; value: string }[] = [
    { label: t.plates.specClient, value: werkstuk.client },
    { label: t.plates.specYear, value: werkstuk.year },
    { label: t.plates.specRole, value: loc(werkstuk.role) },
    { label: t.plates.specHerkomst, value: t.herkomst[werkstuk.herkomst] },
    { label: t.plates.specStatus, value: t.status[werkstuk.status] },
    { label: t.plates.specStack, value: werkstuk.tags.join(', ') },
  ].filter((s) => s.value);

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
              {t.nav.plate} {no} — {t.herkomst[werkstuk.herkomst]}
              {werkstuk.client ? ` · ${werkstuk.client}` : ''} · {t.status[werkstuk.status]}
            </p>
            <h3
              className="t-headline"
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                color: 'var(--text-primary)',
                viewTransitionName: morphing ? 'cs-title' : undefined,
              } as React.CSSProperties}
            >
              {werkstuk.title}
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
            {werkstuk.slug === 'garmin-mcp' ? (
              /* Onzichtbare software krijgt een diagram, geen artefact. */
              <McpDiagram alt={loc(werkstuk.imageAlt)} />
            ) : errored || !werkstuk.image ? (
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
                  {werkstuk.title}
                </span>
              </div>
            ) : (
              <picture>
                <source
                  type="image/webp"
                  srcSet={webpSrcSet(werkstuk.image)}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                />
                <img
                  src={werkstuk.image}
                  alt={loc(werkstuk.imageAlt)}
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
              {loc(werkstuk.bovenlaag)}
            </p>

            <dl className="mt-8" style={{ borderTop: '1px solid var(--border)' }}>
              {specs.map((s) => (
                <div
                  key={s.label}
                  className="grid grid-cols-[7rem_1fr] gap-4 py-3"
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
              {t.plates.open} <span aria-hidden="true">→</span>
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
        aria-label={`${t.plates.openAria} ${werkstuk.title}`}
      />
    </article>
  );
}

/* ------------------------------------------------------------------ */

export function Projects() {
  const reduced = useReducedMotion();
  const t = useT();

  // morphingId = plate currently owning the view-transition-name
  // openId     = case page actually rendered
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

  // Document title mirrors the open case page.
  useEffect(() => {
    if (openId == null) {
      document.title = t.baseTitle;
      return;
    }
    const w = werkstukken.find((x) => x.id === openId);
    if (w) document.title = `${w.title} · Nils Vogelaar`;
  }, [openId, t.baseTitle]);

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

  /* De drie benoemde groepen, in vaste volgorde — de volgorde draagt de
     positionering. Lege groepen (nog zonder werkstuk) worden overgeslagen. */
  const groepen = GROEP_VOLGORDE.map((g) => ({
    groep: g,
    items: werkstukken.filter((w) => w.groep === g),
  })).filter((g) => g.items.length > 0);

  return (
    <section id="projects">
      {/* Section opener: a quiet ruled row, not a display moment. */}
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-10 pt-16 sm:pt-24">
        <div
          className="flex items-baseline justify-between pb-5"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <h2 className="t-label" style={{ color: 'var(--text-muted)' }}>
            {t.plates.header}
          </h2>
          <span className="t-index" style={{ color: 'var(--text-muted)' }}>
            {String(werkstukken.length).padStart(2, '0')} {t.plates.counterSuffix}
          </span>
        </div>
      </div>

      {groepen.map(({ groep, items }) => (
        <div key={groep}>
          {/* Groepskop — a ruled row naming the cluster. */}
          <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-10 pt-14 sm:pt-20">
            <div
              className="flex items-baseline justify-between pb-4"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <h3 className="t-headline" style={{ fontSize: '1.125rem', color: 'var(--text-primary)' }}>
                {t.groep[groep]}
              </h3>
              <span className="t-index" style={{ color: 'var(--text-muted)' }}>
                {String(items.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {items.map((werkstuk, i) => {
            const globalIndex = werkstuk.id - 1;
            return (
              <div key={werkstuk.id}>
                <Plate
                  werkstuk={werkstuk}
                  index={globalIndex}
                  morphing={morphingId === werkstuk.id && openId !== werkstuk.id}
                  onOpen={() => openCaseStudy(werkstuk.id)}
                />
                {i < items.length - 1 && (
                  <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-10" aria-hidden="true">
                    <div style={{ height: 1, backgroundColor: 'var(--border-subtle)' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* Case page overlay */}
      {openId !== null &&
        (() => {
          const w = werkstukken.find((x) => x.id === openId);
          if (!w) return null;
          const idx = werkstukken.findIndex((x) => x.id === openId);
          const prev = werkstukken[(idx - 1 + werkstukken.length) % werkstukken.length];
          const next = werkstukken[(idx + 1) % werkstukken.length];
          return (
            <CaseStudy
              werkstuk={w}
              index={idx}
              total={werkstukken.length}
              nextTitle={werkstukken.length > 1 ? next.title : undefined}
              onClose={closeCaseStudy}
              onPrev={werkstukken.length > 1 ? () => swap(prev.id) : undefined}
              onNext={werkstukken.length > 1 ? () => swap(next.id) : undefined}
            />
          );
        })()}
    </section>
  );
}
