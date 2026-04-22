import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { smoothScrollTo } from '../lib/smoothScroll';

const NAV_HEIGHT = 64;

const links = [
  { label: 'Work', id: 'projects' },
  { label: 'About', id: 'about' },
  { label: 'Stack', id: 'skills' },
  { label: 'Contact', id: 'contact' },
];

interface NavProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function Nav({ theme, onToggleTheme }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 40);
  });

  // Track which section is currently in view
  useEffect(() => {
    const sectionIds = links.map((l) => l.id);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: `-${NAV_HEIGHT + 1}px 0px -40% 0px`, threshold: 0 },
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    smoothScrollTo(el, { offset: -NAV_HEIGHT });
  }, []);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'oklch(from var(--bg) l c h / 0.7)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(16px) saturate(1.2)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(1.2)' : 'none',
      }}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
        <a
          href="#"
          className="font-display text-lg tracking-tight"
          style={{ color: 'var(--text-primary)' }}
          onClick={(e) => {
            e.preventDefault();
            smoothScrollTo(0);
            setActiveId(null);
          }}
        >
          Nils Vogt
        </a>

        <div className="relative flex items-center gap-1 sm:gap-2">
          {links.map((link) => {
            const isActive = activeId === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => scrollTo(e, link.id)}
                className="relative px-3 py-1.5 text-sm rounded-md transition-colors duration-200 hover:bg-[var(--bg-surface)]"
                style={{
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-x-1 -bottom-0.5 h-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="ml-2 p-2 rounded-md transition-colors duration-200 hover:bg-[var(--bg-surface)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <motion.span
              key={theme}
              initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="block w-4 h-4"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.span>
          </button>
        </div>
      </nav>
    </motion.header>
  );
}
