import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { CaseStudy, type CaseStudyWerkstuk } from './CaseStudy';
import { Mono, Reveal } from './Reveal';
import { webpSrcSet } from '../lib/responsiveImage';
import { GROEP_VOLGORDE, isPortrait, opensInPlace, siteContent, type Werkstuk } from '../lib/content';
import { useLoc, useT } from '../lib/i18n';
import { getLenis, gsap, reducedMotion } from '../lib/motion';

const werkstukken: CaseStudyWerkstuk[] = siteContent.werkstukken.map((w, i) => ({ ...w, id: i + 1 }));

/* ------------------------------------------------------------------
   Case-page deep links — /work/:slug without a router. The overlay
   state is mirrored into history so werkstukken are shareable URLs.
   ------------------------------------------------------------------ */
const slugToId = new Map(werkstukken.map((w) => [w.slug, w.id]));
const idToSlug = new Map(werkstukken.map((w) => [w.id, w.slug]));

function parseWorkPath(pathname: string): string | null {
  const m = pathname.match(/^\/work\/([a-z0-9-]+)\/?$/i);
  return m ? m[1].toLowerCase() : null;
}
function initialCaseStudyId(): number | null {
  if (typeof window === 'undefined') return null;
  const slug = parseWorkPath(window.location.pathname);
  return slug ? (slugToId.get(slug) ?? null) : null;
}

/* ------------------------------------------------------------------
   Strip tiles. Imagery where it exists; where software has no visual
   surface to show (a diagram-werkstuk without screens) or the capture is still owed
   (BerijdersApp), a black spec tile carries a real scope-fact instead.
   An uitsnede (scherm set) is shown whole at its own ratio, no mat; older
   full-bleed captures keep the cover crop.
   ------------------------------------------------------------------ */
function ImgTile({ src, alt, portrait = false, artefact = false }: { src: string; alt: string; portrait?: boolean; artefact?: boolean }) {
  return (
    <div className={`tile h-full ${artefact ? 'tile--artefact' : ''}`} style={artefact ? undefined : { aspectRatio: portrait ? '390 / 844' : '16 / 10' }}>
      <picture>
        <source type="image/webp" srcSet={webpSrcSet(src)} sizes="(min-width: 1024px) 24vw, 60vw" />
        <img src={src} alt={alt} loading="lazy" decoding="async" draggable={false} className="w-full h-full object-cover" />
      </picture>
    </div>
  );
}

/** `names`: the value is a list of product names, which never break mid-word. */
export function SpecTile({ label, value, wide = false, big = false, names = false }: { label: string; value: string; wide?: boolean; big?: boolean; names?: boolean }) {
  return (
    <div
      className="tile h-full flex flex-col justify-between p-4"
      style={{
        aspectRatio: big ? '16 / 9' : wide ? '16 / 10' : '4 / 3', /* 4:3 holds ~16 mono chars per line, enough for one scope-fact in three lines */
        background: 'rgb(var(--c-black))',
        color: 'rgb(var(--c-off-white))',
      }}
    >
      <span className="t-mono-sm bracket" style={{ opacity: 0.55 }}>
        {label}
      </span>
      <span className={big ? 't-h6' : 't-code tile-value'} style={big ? { maxWidth: '22ch' } : { lineHeight: 1.35, fontSize: 'clamp(0.7rem, 0.8vw, 0.8rem)', hyphens: names ? 'manual' : undefined }}>
        {value}
      </span>
    </div>
  );
}

function Strip({ w }: { w: Werkstuk }) {
  const loc = useLoc();
  // The lead image may also open the gallery (a diagram-werkstuk shows it there); one tile per image.
  const tiles = [{ image: w.image, alt: w.imageAlt, scherm: w.imageScherm }, ...w.gallery].filter(
    (g, i, all) => g.image && all.findIndex((x) => x.image === g.image) === i,
  );

  if (w.diagram && tiles.length === 0) {
    return (
      <>
        {w.diagram.stappen.map((st, i) => (
          <SpecTile key={st.label.nl} label={`${i === 0 ? '' : '→ '}${loc(st.label)}`} value={loc(st.titel)} wide={i === 0} names={i === 0} />
        ))}
      </>
    );
  }
  if (tiles.length === 0) {
    return (
      <>
        {w.highlights.slice(0, 4).map((h, i) => (
          <SpecTile key={h.label.nl} label={loc(h.label)} value={loc(h.value)} wide={i === 0} />
        ))}
      </>
    );
  }
  return (
    <>
      {tiles.map((g) => (
        <ImgTile key={g.image} src={g.image} alt={loc(g.alt)} portrait={isPortrait(g)} artefact={Boolean(g.scherm)} />
      ))}
    </>
  );
}

/** The groep is the header above its rows, so a row carries herkomst and status only. */
function Row({ w, compact, onOpen }: { w: CaseStudyWerkstuk; compact: boolean; onOpen: () => void }) {
  const t = useT();
  const chips = [t.herkomst[w.herkomst], t.status[w.status]];
  return (
    <div className={`row ${compact ? 'row--compact' : ''}`}>
      {/* A real link to the shareable /work/:slug page; a plain click opens it in place. */}
      <a
        href={`/work/${w.slug}`}
        onClick={(e) => {
          if (!opensInPlace(e)) return;
          e.preventDefault();
          onOpen();
        }}
        aria-label={`${t.work.openAria} ${w.title}, ${w.client} — ${chips.join(', ')}`}
        data-cursor={`${w.title} ( + )`}
        className="container w-full text-left grid-12 items-start gap-y-5 pt-[22px] pb-6"
      >
        <span className="col-span-12 lg:col-span-2 pt-[2px]">
          <span className="t-h6 block">{w.title}</span>
          {w.client && w.client !== w.title && (
            <span className="t-mono block mt-1" style={{ opacity: 0.6 }}>
              {w.client}
            </span>
          )}
        </span>
        <span className="col-span-8 lg:col-span-3 flex flex-wrap gap-1 pt-[3px]">
          {chips.map((c) => (
            <Mono key={c} className="chip">
              {c}
            </Mono>
          ))}
        </span>
        <span className="col-span-4 lg:col-span-1 t-mono paren pt-[6px] text-right lg:text-left whitespace-nowrap">
          <span className="vp">{t.work.view} </span>+
        </span>
        {/* Decorative here (the row's name carries title + chips); every image is captioned inside the case page. */}
        <span className="col-span-12 lg:col-span-6 relative" aria-hidden="true">
          <span className="strip flex justify-start gap-2 lg:absolute lg:left-0 lg:top-0 lg:w-max">
            <Strip w={w} />
          </span>
          {/* keeps the row's height on desktop where the strip is absolute */}
          <span aria-hidden="true" className="strip-h hidden lg:block" />
        </span>
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function Work() {
  const t = useT();
  const loc = useLoc();
  const reduced = reducedMotion();
  const [morphingId, setMorphingId] = useState<number | null>(initialCaseStudyId);
  const [openId, setOpenId] = useState<number | null>(initialCaseStudyId);

  useEffect(() => {
    const l = getLenis();
    if (openId != null) l?.stop();
    else l?.start();
  }, [openId]);

  const transition = useCallback(
    (cb: () => void) => {
      const supports = typeof document !== 'undefined' && 'startViewTransition' in document;
      if (!supports || reduced) return cb();
      (document as Document & { startViewTransition: (cb: () => void) => { finished: Promise<void> } })
        .startViewTransition(() => flushSync(cb))
        .finished.catch(() => {});
    },
    [reduced]
  );

  const openCaseStudy = useCallback(
    (id: number, push = true) => {
      if (push) {
        const slug = idToSlug.get(id);
        if (slug && window.location.pathname !== `/work/${slug}`) window.history.pushState({ cs: slug }, '', `/work/${slug}`);
      }
      flushSync(() => setMorphingId(id));
      transition(() => setOpenId(id));
    },
    [transition]
  );

  const closeCaseStudy = useCallback(
    (push: unknown = true) => {
      if (push && window.location.pathname !== '/') window.history.pushState({}, '', '/');
      transition(() => setOpenId(null));
      setMorphingId(null);
    },
    [transition]
  );

  const swap = useCallback(
    (id: number) => {
      const slug = idToSlug.get(id);
      if (slug) window.history.replaceState({ cs: slug }, '', `/work/${slug}`);
      transition(() => {
        setMorphingId(id);
        setOpenId(id);
      });
    },
    [transition]
  );

  useEffect(() => {
    const slug = parseWorkPath(window.location.pathname);
    if (slug && !slugToId.has(slug)) window.history.replaceState({}, '', '/');
  }, []);

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

  useEffect(() => {
    if (openId == null) {
      document.title = t.baseTitle;
      return;
    }
    const w = werkstukken.find((x) => x.id === openId);
    if (w) document.title = `${w.title} · Nils Vogelaar`;
  }, [openId, t.baseTitle]);

  void morphingId;

  // Rows fade-slide in as they enter; the hairline draws with them.
  useEffect(() => {
    if (reduced) return;
    const rows = Array.from(document.querySelectorAll<HTMLElement>('#work .row'));
    const tweens = rows.map((row) =>
      gsap.fromTo(
        row,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power4.out', scrollTrigger: { trigger: row, start: 'top 92%', once: true } }
      )
    );
    return () => tweens.forEach((tw) => tw.kill());
  }, [reduced]);

  return (
    <section id="work" className="relative" style={{ paddingTop: 'var(--sec-lg)' }}>
      <div className="container grid-12 gap-y-6" style={{ paddingBottom: 'var(--sec-sm)' }}>
        <Reveal as="h2" className="col-span-12 lg:col-span-9 t-h2" style={{ maxWidth: '24ch' }}>
          {loc(siteContent.work.intro)}
        </Reveal>
        <div className="col-span-12 lg:col-span-3 lg:text-right self-end">
          <Mono bracket>{t.work.label}</Mono>
        </div>
      </div>

      {GROEP_VOLGORDE.map((g) => {
        const rows = werkstukken.filter((w) => w.groep === g);
        if (rows.length === 0) return null;
        return (
          <div key={g} className="groep">
            <h3 className="container pb-4">
              <Mono bracket>{t.groep[g]}</Mono>
            </h3>
            {rows.map((w) => (
              <Row key={w.id} w={w} compact={g === 'sites-merk'} onOpen={() => openCaseStudy(w.id)} />
            ))}
          </div>
        );
      })}

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
              nextTitle={next.title}
              onClose={closeCaseStudy}
              onPrev={() => swap(prev.id)}
              onNext={() => swap(next.id)}
            />
          );
        })()}
    </section>
  );
}
