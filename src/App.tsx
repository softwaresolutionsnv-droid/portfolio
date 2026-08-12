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

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    []
  );

  return (
    <div
      className="relative min-h-screen theme-transition"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}
    >
      <a href="#main" className="skip-link t-label">
        Skip to content
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
  );
}
