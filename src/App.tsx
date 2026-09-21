/*
DIRECTION CONTRACT — "Signal"

THESIS: a solo designer-developer's proof-site in the lamalama.com grammar
(pinned by the owner, 6 Sep 2026): bold grotesk caps at line-height .8,
mono UI voice in [ brackets ], a dither field as material, sections that
own the theme. It refuses the monograph stillness it replaces.

OWN-WORLD: dark #1A1C1C ground, off-white #F9F4EB ink, one signal field
(green #D0FF7E) at the close; Geist display + Sometype Mono; 4px radius
on chrome, 0 on media; black chips and cards; hairlines; Lenis + GSAP
power4.out reveals; OGL glyph-dither hero.

STORY: a warm lead lands on a promise, scrolls a list of shipped work with
image strips, reads what Nils does in three columns, meets him, and mails.

FIRST VIEWPORT: dither field full-bleed; floating nav bar top-centre with
a section tagline; contact card + "this is me" stack top-right; [ NILS
VOGELAAR ] eyebrow, three-line display promise bottom-left, practice line
bottom-right, ruled meta bar with live clock and NL/EN below.

FORM: literal translation of lamalama.com (owner-pinned reference; no
concept roll — brief-pinned direction beats the roll).

FINISH: unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, and DESIGN.md.
*/

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Work } from './components/Work';
import { Services } from './components/Services';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { CursorLabel } from './components/CursorLabel';
import { BottomBar } from './components/BottomBar';
import { LangContext, ui, type Lang } from './lib/i18n';
import { ScrollTrigger, startLenis, watchSections } from './lib/motion';

export default function App() {
  // Nederlands is de default én de brontaal (ADR-0003).
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem('lang') as Lang) || 'nl');
  const [tagline, setTagline] = useState(ui[lang].nav.taglines.hero);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleLang = useCallback(() => setLangState((l) => (l === 'nl' ? 'en' : 'nl')), []);

  useEffect(() => startLenis(), []);

  // Sections own the theme and the nav tagline.
  const sections = useMemo(
    () => [
      { id: 'hero', theme: 'dark', tagline: ui[lang].nav.taglines.hero },
      { id: 'work', theme: 'dark', tagline: ui[lang].nav.taglines.work },
      { id: 'services', theme: 'light', tagline: ui[lang].nav.taglines.services },
      { id: 'about', theme: 'light', tagline: ui[lang].nav.taglines.about },
      { id: 'contact', theme: 'green', tagline: ui[lang].nav.taglines.contact },
    ],
    [lang]
  );
  useEffect(() => {
    const stop = watchSections(sections, setTagline);
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);
    return () => {
      stop();
      window.removeEventListener('load', refresh);
    };
  }, [sections]);

  return (
    <LangContext.Provider value={{ lang, toggleLang, setLang }}>
      <a href="#main" className="skip-link t-mono">
        {ui[lang].skip}
      </a>
      <Nav tagline={tagline} />
      <main id="main">
        <Hero />
        <Work />
        <Services />
        <About />
        <Contact />
        {/* One meta bar: sticky at the viewport bottom for the whole page, docks above the copyright line at the end. */}
        <BottomBar sticky />
      </main>
      <CursorLabel />
      <Analytics />
    </LangContext.Provider>
  );
}
