import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { smoothScrollTo } from '../lib/smoothScroll';

const NAV_HEIGHT = 64;
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

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
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 40);
  });

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

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
    e.stopPropagation();
    const el = document.getElementById(id);
    if (!el) return;
    setMenuOpen(false);
    smoothScrollTo(el, { offset: -NAV_HEIGHT });
  }, []);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled || menuOpen ? 'oklch(from var(--bg) l c h / 0.7)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
        backdropFilter: scrolled || menuOpen ? 'blur(16px) saturate(1.2)' : 'none',
        WebkitBackdropFilter: scrolled || menuOpen ? 'blur(16px) saturate(1.2)' : 'none',
      }}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
        <a
          href="#"
          className="flex items-center gap-2.5 font-display text-lg tracking-tight"
          style={{ color: 'var(--text-primary)' }}
          onClick={(e) => {
            e.preventDefault();
            setMenuOpen(false);
            smoothScrollTo(0);
            setActiveId(null);
          }}
        >
          {/* Logomark — theme-aware brand icon */}
          <img
            src={theme === 'dark' ? '/icons/nils-primary-dark.svg' : '/icons/nils-primary-light.svg'}
            alt=""
            aria-hidden="true"
            width="28"
            height="28"
            className="shrink-0"
          />
          <span className="hidden sm:inline">Nils Vogelaar</span>
        </a>

        {/* Desktop nav — hidden on mobile */}
        <div className="relative hidden sm:flex items-center gap-1 sm:gap-2">
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

        {/* Mobile controls — theme toggle + hamburger, both 44x44 hit area */}
        <div className="flex sm:hidden items-center gap-1">
          <button
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex items-center justify-center w-11 h-11 rounded-md transition-colors duration-200 hover:bg-[var(--bg-surface)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <motion.span
              key={theme}
              initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="block w-5 h-5"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.span>
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="inline-flex items-center justify-center w-11 h-11 -mr-2 rounded-md transition-colors duration-200 hover:bg-[var(--bg-surface)]"
            style={{ color: 'var(--text-primary)' }}
          >
            <motion.span
              key={menuOpen ? 'x' : 'menu'}
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
              className="block w-5 h-5"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.span>
          </button>
        </div>
      </nav>

      {/* Mobile drawer — full-width, slides down under the nav row */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            key="mobile-nav"
            className="sm:hidden overflow-hidden"
            style={{ borderTop: '1px solid var(--border-subtle)' }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
          >
            <ul className="px-5 py-2">
              {links.map((link) => {
                const isActive = activeId === link.id;
                return (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => scrollTo(e, link.id)}
                      className="flex items-center justify-between py-4 text-base font-medium tracking-tight"
                      style={{
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                        borderBottom: '1px solid var(--border-subtle)',
                      }}
                    >
                      <span>{link.label}</span>
                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="block w-2 h-2 rounded-full"
                          style={{ backgroundColor: 'var(--color-accent)' }}
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
