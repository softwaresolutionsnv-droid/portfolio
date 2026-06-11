import { useCallback, useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Nav } from './components/Nav';
import { AnimatedBackground } from './components/AnimatedBackground';
import { SmoothScroll } from './components/SmoothScroll';
import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
  });

  // The hero holds its entrance until the preloader veil starts lifting.
  const [introDone, setIntroDone] = useState(false);
  const handleReveal = useCallback(() => setIntroDone(true), []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <div className="relative min-h-screen grain" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}>
      <SmoothScroll />
      <AnimatedBackground />
      <CustomCursor />
      <Preloader onReveal={handleReveal} />
      <Nav theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero play={introDone} />
        <Projects />
        <About />
        <Skills />
        <Contact />
      </main>
      <Analytics />
    </div>
  );
}
