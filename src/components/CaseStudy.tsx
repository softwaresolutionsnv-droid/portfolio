import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { webpSrcSet } from '../lib/responsiveImage';
import { McpDiagram } from './McpDiagram';
import { SpecTile } from './Work';
import type { Werkstuk } from '../lib/content';
import { useLoc, useT } from '../lib/i18n';

export type CaseStudyWerkstuk = Werkstuk & { id: number };

type Props = {
  werkstuk: CaseStudyWerkstuk;
  index: number;
  total: number;
  nextTitle?: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
};

const FOCUSABLE =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

/**
 * The case page — a full-screen dark spread over the site. Keyboard:
 * Esc closes, ←/→ move between werkstukken, Tab is trapped inside.
 */
export function CaseStudy({ werkstuk: project, index, total, nextTitle, onClose, onPrev, onNext }: Props) {
  const t = useT();
  const loc = useLoc();
  const cta =
    project.status === 'live' && project.url
      ? { href: project.url, label: t.caseStudy.visit, external: true }
      : project.status === 'besloten'
        ? { href: '#contact', label: t.caseStudy.requestAccess, external: false }
        : null;

  const scrollRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const onPrevRef = useRef(onPrev);
  const onNextRef = useRef(onNext);
  useEffect(() => {
    onCloseRef.current = onClose;
    onPrevRef.current = onPrev;
    onNextRef.current = onNext;
  });

  const [failedSlug, setFailedSlug] = useState<string | null>(null);
  const imageFailed = failedSlug === project.slug;

  // Lock body scroll, mark background inert, focus close, wire keys, trap Tab.
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

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key === 'Tab' && rootRef.current) {
        const nodes = Array.from(rootRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
          (n) => !n.hasAttribute('disabled') && n.getClientRects().length > 0
        );
        if (nodes.length === 0) return e.preventDefault();
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

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    if (progressBarRef.current) progressBarRef.current.style.transform = 'scaleX(0)';
  }, [project.id]);

  useEffect(() => {
    const el = scrollRef.current;
    const bar = progressBarRef.current;
    if (!el || !bar) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0})`;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const chips = [
    t.groep[project.groep],
    t.herkomst[project.herkomst],
    t.status[project.status],
    project.year,
    project.client,
  ].filter(Boolean);

  const credits = [
    { label: t.plates.specRole, value: loc(project.role) },
    { label: t.plates.specClient, value: project.client },
    { label: t.plates.specYear, value: project.year },
    { label: t.plates.specStack, value: project.tags.join(', ') },
  ].filter((c) => c.value);

  const ctaEl =
    cta ? (
      cta.external ? (
        <a href={cta.href} target="_blank" rel="noopener noreferrer" className="btn btn--solid">
          {cta.label} <span className="arrow" aria-hidden="true">↗</span>
        </a>
      ) : (
        <a href={cta.href} onClick={() => onClose()} className="btn">
          {cta.label} <span className="arrow" aria-hidden="true">↗</span>
        </a>
      )
    ) : null;

  return createPortal(
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200]"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title}: ${t.caseStudy.ariaSuffix}`}
      style={{ backgroundColor: 'rgb(0 0 0 / 0.85)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={scrollRef}
        data-lenis-prevent
        className="cs-surface theme-dark absolute inset-0 overflow-y-auto overflow-x-hidden"
        style={{ backgroundColor: 'var(--bg)', color: 'var(--ink)', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
      >
        {/* reading progress */}
        <div aria-hidden="true" className="sticky top-0 z-30 h-[2px] pointer-events-none">
          <div ref={progressBarRef} className="h-full w-full" style={{ transform: 'scaleX(0)', transformOrigin: '0 50%', background: 'var(--ink)' }} />
        </div>

        {/* fixed chrome */}
        <div className="fixed top-4 left-4 z-20">
          <button type="button" onClick={onClose} className="card !rounded-[4px] py-3.5 px-4 gap-2" aria-label={t.caseStudy.back}>
            <span aria-hidden="true">↖</span> {t.caseStudy.back}
          </button>
        </div>
        <div className="fixed top-4 right-4 z-20">
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label={t.caseStudy.close}
            className="card grid place-items-center w-[50px] h-[50px] !p-0"
          >
            <span aria-hidden="true" className="t-body">✕</span>
          </button>
        </div>

        {/* header */}
        <header className="container pt-32 sm:pt-44">
          <h1 className="t-display-sm" style={{ viewTransitionName: 'cs-title' } as React.CSSProperties}>
            {project.title}
          </h1>
          <div className="hairline mt-8" />
          <div className="flex flex-wrap gap-1 mt-6">
            {chips.map((c) => (
              <span key={c} className="chip">
                {c}
              </span>
            ))}
          </div>
        </header>

        {/* intro + credits + media */}
        <div className="container grid-12 gap-y-10 mt-[var(--sec-md)]">
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-10">
            <p className="t-body-md" style={{ maxWidth: '40ch' }}>
              {loc(project.bovenlaag)}
            </p>
            <div>
              <span className="t-mono bracket block mb-4" style={{ opacity: 0.6 }}>
                {t.caseStudy.credits}
              </span>
              <dl>
                {credits.map((c) => (
                  <div key={c.label} className="grid grid-cols-[7rem_1fr] gap-4 py-3" style={{ borderBottom: '1px solid var(--ink-20)' }}>
                    <dt className="t-body-sm">{c.label}</dt>
                    <dd className="t-body-sm">{c.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="hidden sm:block">{ctaEl}</div>
          </div>

          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            {project.trace ? (
              <div className="grid gap-1 sm:grid-cols-2">
                <div className="sm:col-span-2 tile" style={{ background: 'rgb(var(--c-black))', padding: 'var(--s-lg)' }}>
                  <McpDiagram alt={loc(project.imageAlt)} />
                </div>
                {project.highlights.slice(0, 2).map((h) => (
                  <SpecTile key={h.label.nl} label={loc(h.label)} value={loc(h.value)} big />
                ))}
              </div>
            ) : project.image && !imageFailed ? (
              <div className="tile">
                <picture>
                  <source type="image/webp" srcSet={webpSrcSet(project.image)} sizes="(min-width: 1024px) 58vw, 100vw" />
                  <img
                    src={project.image}
                    alt={loc(project.imageAlt)}
                    draggable={false}
                    decoding="async"
                    fetchPriority="high"
                    onError={() => setFailedSlug(project.slug)}
                    className="w-full h-auto"
                    style={{ viewTransitionName: 'cs-image' } as React.CSSProperties}
                  />
                </picture>
              </div>
            ) : (
              <div className="grid gap-1 grid-cols-2">
                {project.highlights.map((h) => (
                  <SpecTile key={h.label.nl} label={loc(h.label)} value={loc(h.value)} big />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* onderlaag */}
        <article className="container grid-12 gap-y-8 mt-[var(--sec-lg)]">
          <div className="col-span-12 lg:col-span-3">
            <span className="t-mono bracket" style={{ opacity: 0.6 }}>
              {t.caseStudy.overview}
            </span>
          </div>
          <div className="col-span-12 lg:col-span-8 lg:col-start-5 flex flex-col gap-8">
            <p className="t-h4" style={{ maxWidth: '30ch' }}>
              {loc(project.lede)}
            </p>
            {project.onderlaag.map((para, i) => (
              <p key={i} className="t-body-md" style={{ maxWidth: '58ch', opacity: 0.85 }}>
                {loc(para)}
              </p>
            ))}
          </div>

          {project.trace && (
            <>
              <div className="col-span-12 lg:col-span-3 mt-[var(--sec-sm)]">
                <span className="t-mono bracket block" style={{ opacity: 0.6 }}>
                  {t.trace.header}
                </span>
                <p className="t-body-sm mt-3" style={{ opacity: 0.6, maxWidth: '24ch' }}>
                  {t.trace.disclaimer}
                </p>
              </div>
              <div className="col-span-12 lg:col-span-8 lg:col-start-5 mt-[var(--sec-sm)]">
                <div className="tile p-6 sm:p-8 grid gap-6" style={{ background: 'rgb(var(--c-black))' }}>
                  {[
                    [t.trace.vraag, loc(project.trace.vraag), false],
                    [t.trace.aanroep, `→ ${project.trace.aanroep}`, true],
                    [t.trace.antwoord, project.trace.antwoord, true],
                  ].map(([label, value, mono]) => (
                    <div key={label as string} className="grid gap-2 sm:grid-cols-[7rem_1fr] sm:gap-6">
                      <span className="t-mono" style={{ opacity: 0.55 }}>
                        {label as string}
                      </span>
                      {mono ? (
                        <pre className="t-code overflow-x-auto whitespace-pre" style={{ margin: 0 }}>
                          {value as string}
                        </pre>
                      ) : (
                        <p className="t-body">{value as string}</p>
                      )}
                    </div>
                  ))}
                  {project.trace.duiding && (
                    <p className="t-body-sm" style={{ opacity: 0.6 }}>
                      {loc(project.trace.duiding)}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {project.highlights.length > 0 && (
            <>
              <div className="col-span-12 lg:col-span-3 mt-[var(--sec-sm)]">
                <span className="t-mono bracket" style={{ opacity: 0.6 }}>
                  {t.caseStudy.highlights}
                </span>
              </div>
              <dl className="col-span-12 lg:col-span-8 lg:col-start-5 mt-[var(--sec-sm)]" style={{ borderTop: '1px solid var(--ink-20)' }}>
                {project.highlights.map((h) => (
                  <div key={h.label.nl} className="grid grid-cols-[8rem_1fr] gap-4 py-4" style={{ borderBottom: '1px solid var(--ink-20)' }}>
                    <dt className="t-body-sm" style={{ opacity: 0.6 }}>
                      {loc(h.label)}
                    </dt>
                    <dd className="t-body">{loc(h.value)}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}

          {project.gallery.length > 0 && (
            <div className="col-span-12 mt-[var(--sec-md)] grid gap-1 sm:grid-cols-2">
              {project.gallery.map((shot, i) => (
                <figure key={`${shot.image}-${i}`} className={`tile ${/-m-\d+\.png$/.test(shot.image) ? 'sm:row-span-2' : ''}`}>
                  <picture>
                    <source type="image/webp" srcSet={webpSrcSet(shot.image)} sizes="(min-width: 640px) 50vw, 100vw" />
                    <img src={shot.image} alt={loc(shot.alt)} loading="lazy" decoding="async" draggable={false} className="w-full h-full object-cover" />
                  </picture>
                </figure>
              ))}
            </div>
          )}

          <div className="col-span-12 sm:hidden">{ctaEl}</div>

          {/* footer nav */}
          <div className="col-span-12 flex items-center justify-between gap-4 mt-[var(--sec-md)] pt-5 pb-10" style={{ borderTop: '1px solid var(--ink-20)' }}>
            <button type="button" onClick={onClose} className="t-mono inline-flex items-center gap-2">
              <span aria-hidden="true">←</span> {t.caseStudy.back}
            </button>
            <div className="flex items-center gap-2">
              <span className="t-mono hidden md:inline mr-4" style={{ opacity: 0.5 }}>
                {t.caseStudy.leaf} · {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
              </span>
              {onPrev && (
                <button type="button" onClick={onPrev} aria-label={t.caseStudy.prevPlate} className="btn !px-4">
                  <span aria-hidden="true">←</span>
                </button>
              )}
              {onNext && (
                <button type="button" onClick={onNext} aria-label={nextTitle ? `${t.caseStudy.nextPlate}: ${nextTitle}` : t.caseStudy.nextPlate} className="btn">
                  <span className="hidden sm:inline" style={{ opacity: 0.6 }}>
                    {t.caseStudy.next}
                  </span>
                  <span className="hidden sm:inline">{nextTitle}</span>
                  <span className="arrow" aria-hidden="true">→</span>
                </button>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>,
    document.body
  );
}
