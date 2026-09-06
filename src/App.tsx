/*
DIRECTION CONTRACT — "The Concrete Monograph"

THESIS: the portfolio is a high-end architectural monograph of built work;
it refuses the dark award-portfolio arrangement (kinetic type, preloader,
cursor chrome) it replaces.

OWN-WORLD: cool charcoal / bone duotone, one deep-rust Oxide accent,
Archivo Expanded capitals at monumental scale over Source Serif 4 text,
hairline rules, radius 0, duotone plates that develop to color.

STORY: a prospect leafs through numbered plates of real shipped work,
reads the essay and specifications, and emails from the colophon.

FIRST VIEWPORT: Marginal Index (approved comp): hairline-ruled index of
built work left, stacked monument NILS VOGELAAR right, colossal
blind-embossed numeral behind, serif practice line below.

FORM: concrete architectural monograph, candidate 5 of the steered list,
monograph-native staging (index + plates), seed key c5561a3f.
*/

import { useCallback, useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Nav } from './components/Nav';
import { LangContext, ui, type Lang } from './lib/i18n';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
  });

  // Nederlands is de default én de brontaal (ADR-0003).
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem('lang') as Lang) || 'nl';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
  }, [lang]);

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    []
  );

  const toggleLang = useCallback(() => setLang((l) => (l === 'nl' ? 'en' : 'nl')), []);

  return (
    <LangContext.Provider value={{ lang, toggleLang }}>
    <div
      className="relative min-h-screen theme-transition"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}
    >
      <a href="#main" className="skip-link t-label">
        {ui[lang].skip}
      </a>
      <Nav theme={theme} onToggleTheme={toggleTheme} />
      <main id="main">
        <Hero />
        <Projects />
        <About />
        <Skills />
        <Contact />
      </main>
      <Analytics />
    </div>
    </LangContext.Provider>
  );
}
