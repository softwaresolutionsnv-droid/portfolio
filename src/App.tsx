import { useCallback, useEffect, useMemo, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Work } from './components/Work';
import { Oplossingen } from './components/Oplossingen';
import { Werkwijze } from './components/Werkwijze';
import { About } from './components/About';
import { Colophon, Contact } from './components/Contact';
import { CursorLabel } from './components/CursorLabel';
import { CursorTrail } from './components/CursorTrail';
import { LangContext, ui, type Lang } from './lib/i18n';
import { ScrollTrigger, startLenis, watchSections } from './lib/motion';

/** A stored language we no longer ship, or storage that throws (sandboxed, blocked), falls back to NL. */
function storedLang(): Lang {
  try {
    const l = localStorage.getItem('lang');
    return l === 'en' || l === 'nl' ? l : 'nl';
  } catch {
    return 'nl';
  }
}

export default function App() {
  // Nederlands is de default én de brontaal (ADR-0003).
  const [lang, setLangState] = useState<Lang>(storedLang);
  const [tagline, setTagline] = useState(ui[lang].nav.taglines.hero);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem('lang', lang);
    } catch {
      /* the choice holds for this visit only */
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);

  useEffect(() => startLenis(), []);

  // Sections own the theme and the nav tagline.
  const sections = useMemo(
    () => [
      { id: 'hero', theme: 'dark', tagline: ui[lang].nav.taglines.hero },
      { id: 'oplossingen', theme: 'light', tagline: ui[lang].nav.taglines.oplossingen },
      { id: 'work', theme: 'dark', tagline: ui[lang].nav.taglines.work },
      { id: 'werkwijze', theme: 'light', tagline: ui[lang].nav.taglines.werkwijze },
      { id: 'about', theme: 'light', tagline: ui[lang].nav.taglines.about },
      { id: 'contact', theme: 'green', tagline: ui[lang].nav.taglines.contact, blend: true },
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
    <LangContext.Provider value={{ lang, setLang }}>
      <a href="#main" className="skip-link t-mono">
        {ui[lang].skip}
      </a>
      <Nav tagline={tagline} />
      <main id="main">
        <Hero />
        <Oplossingen />
        <Work />
        <Werkwijze />
        <About />
        <Contact />
      </main>
      <Colophon />
      <CursorTrail />
      <CursorLabel />
      <Analytics />
    </LangContext.Provider>
  );
}
