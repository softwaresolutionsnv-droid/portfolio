import { useEffect, useRef, useState } from 'react';
import { Mark } from './Mark';
import { LangSwitch } from './BottomBar';
import { kennismakingLink, siteContent } from '../lib/content';
import { availabilityCopy } from '../lib/availability';
import { useLang, useLoc, useT } from '../lib/i18n';
import { decode, focusSection, scrollToId } from '../lib/motion';

/**
 * Floating nav pill, top centre: mark · section tagline (mono, decodes on
 * change) · menu toggle. The menu drops down *inside* the pill (lamalama
 * grammar): 50px rows with hairlines that draw from the left, an outline
 * button and two solid CTAs; the page behind blurs and dims.
 * Right stack (desktop): contact card + "this is me" fold-out.
 */
export function Nav({ tagline }: { tagline: string }) {
  const t = useT();
  const loc = useLoc();
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [me, setMe] = useState(false);
  const tagRef = useRef<HTMLSpanElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (tagRef.current) decode(tagRef.current, 600, tagline);
  }, [tagline]);

  // Esc / click-outside close. Esc from inside the menu hands focus back to the toggle,
  // since the menu goes inert under it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (pillRef.current?.contains(document.activeElement)) burgerRef.current?.focus();
      setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      if (!pillRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  /* In-page links: the section takes focus, so the next Tab continues from
     where the visitor landed instead of from the (now inert) menu. */
  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setOpen(false);
    focusSection(id);
    setTimeout(() => scrollToId(id), 30);
  };

  const status = availabilityCopy(siteContent.availability, lang);
  const email = siteContent.contact.email;
  const items: [string, string][] = [
    ['oplossingen', t.nav.oplossingen],
    ['work', t.nav.work],
    ['werkwijze', t.nav.werkwijze],
    ['about', t.nav.about],
    ['contact', t.nav.contact],
  ];

  return (
    <>
      {/* Scrim behind the open menu */}
      <div aria-hidden="true" className={`menu-scrim ${open ? 'is-open' : ''}`} />

      {/* Pill */}
      <header className="fixed top-4 left-0 right-0 z-[100] pointer-events-none px-4">
        <div
          ref={pillRef}
          className={`navbar pointer-events-auto mx-auto flex flex-col ${open ? 'is-open' : ''}`}
          style={{ width: 'min(438px, 100%)' }}
        >
          <div className="flex items-center justify-between h-[50px] pl-[9px] pr-[7px]">
            <a href="#hero" onClick={(e) => go(e, 'hero')} aria-label={t.nav.home} className="p-1">
              <Mark size={26} />
            </a>
            <span className="t-mono text-center absolute left-1/2 -translate-x-1/2 pointer-events-none">
              <span ref={tagRef} aria-hidden="true">{tagline}</span>
              <span className="sr-only">{tagline}</span>
            </span>
            <button
              ref={burgerRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? t.nav.close : t.nav.menu}
              className="burger flex flex-col gap-[3px] py-3 px-[7px]"
            >
              <span className="block h-[2px] w-4" style={{ background: 'currentColor' }} />
              <span className="block h-[2px] w-4" style={{ background: 'currentColor' }} />
              <span className="block h-[2px] w-4" style={{ background: 'currentColor' }} />
            </button>
          </div>

          {/* Dropdown */}
          <div
            id="site-menu"
            className="overflow-hidden"
            style={{
              display: 'grid',
              gridTemplateRows: open ? '1fr' : '0fr',
              transition: 'grid-template-rows 550ms var(--ease-out)',
            }}
          >
            <nav className="min-h-0 menu" aria-label={t.nav.menu} inert={!open}>
              <ul className="flex flex-col">
                {items.map(([id, label], i) => (
                  <li key={id} className="menu-row" style={{ ['--i' as string]: i }}>
                    <a href={`#${id}`} onClick={(e) => go(e, id)} className="menu-link flex items-center h-[50px] w-full text-left pl-11 pr-4 t-h6">
                      {label}
                      <span className="pix ml-auto" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-1 p-4 pt-4 menu-row" style={{ ['--i' as string]: items.length }}>
                {/* Language + address first: the NL/EN switch is the one control a phone reader must be able to find without scrolling. */}
                <div className="flex items-center justify-between pb-3 t-mono">
                  <a href={`mailto:${email}`} className="py-1" style={{ opacity: 0.7 }}>{email}</a>
                  <LangSwitch />
                </div>
                <a href={siteContent.contact.socials[0].href} target="_blank" rel="noopener noreferrer" className="btn justify-center w-full">
                  LinkedIn <span className="arrow" aria-hidden="true">↗</span>
                </a>
                <div className="grid grid-cols-2 gap-1">
                  <a {...kennismakingLink(t.nav.subjectCall)} className="btn btn--solid justify-center">
                    {t.nav.planCall}
                  </a>
                  <a href={`mailto:${email}?subject=${encodeURIComponent(t.nav.subjectProject)}`} className="btn btn--solid justify-center">
                    {t.nav.startProject}
                  </a>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Right stack — desktop */}
      <aside aria-label={t.nav.contact} className="fixed top-4 right-4 z-[100] hidden lg:flex flex-col gap-1 w-[160px]">
        <a href={`mailto:${email}`} className="side-card side-card--contact flex items-center gap-3 p-1 pr-3 t-mono whitespace-nowrap">
          <span className="grid place-items-center w-10 h-10 rounded-[3px] flex-shrink-0" style={{ background: 'rgb(var(--c-dark))', color: 'rgb(var(--c-off-white))' }}>
            <Mark size={20} />
          </span>
          {t.nav.contact}
        </a>
        <div className="side-card">
          <button
            type="button"
            onClick={() => setMe((v) => !v)}
            aria-expanded={me}
            aria-controls="me-panel"
            className="flex items-center justify-between w-full px-3 t-mono" style={{ paddingTop: 12, paddingBottom: 12 }}
          >
            <span>{t.nav.thisIsMe}</span>
            <span className="paren" aria-hidden="true">{me ? '-' : '+'}</span>
          </button>
          <div
            id="me-panel"
            inert={!me}
            className="overflow-hidden"
            style={{
              display: 'grid',
              gridTemplateRows: me ? '1fr' : '0fr',
              transition: 'grid-template-rows 500ms var(--ease-out)',
            }}
          >
            <div className="min-h-0">
              <div className="px-3 pb-3 flex flex-col gap-3">
                <div className="hairline" style={{ background: 'currentColor', opacity: 0.15 }} />
                <p className="t-body-sm" style={{ opacity: 0.85 }}>{loc(siteContent.about.intro).split('. ')[0]}.</p>
                <p className="t-mono inline-flex items-center gap-2">
                  <span className="dot" aria-hidden="true" />
                  {status.about}
                </p>
                <a href={siteContent.contact.socials[0].href} target="_blank" rel="noopener noreferrer" className="t-mono py-1">
                  LinkedIn <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
