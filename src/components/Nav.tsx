import { useEffect, useState } from 'react';
import { siteContent } from '../lib/content';

/**
 * Monograph header: a single hairline row. Wordmark left, the plate
 * index center (desktop), essay/colophon links and the text theme
 * toggle right. Transparent at rest; solid + hairline after 40px of
 * scroll. No blur, no icons, no drawer — DESIGN.md §5.
 */

const NAV_HEIGHT = 64;

const plateIds = siteContent.projects.map((_, i) => `plate-${String(i + 1).padStart(2, '0')}`);

interface NavProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function Nav({ theme, onToggleTheme }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activePlate, setActivePlate] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track which plate is in view so its number carries the Oxide. One
  // observer over plates AND the sections after them, so entering the
  // essay/specs/colophon reliably clears the active number.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          setActivePlate(id.startsWith('plate-') ? id : null);
        }
      },
      { rootMargin: `-${NAV_HEIGHT + 1}px 0px -55% 0px`, threshold: 0 }
    );
    for (const id of [...plateIds, 'about', 'skills', 'contact']) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height: NAV_HEIGHT,
        backgroundColor: scrolled
          ? 'color-mix(in oklab, var(--bg) 95%, transparent)'
          : 'transparent',
        borderBottom: scrolled
          ? '1px solid var(--border-subtle)'
          : '1px solid transparent',
        transition: 'background-color 300ms ease, border-color 300ms ease',
      }}
    >
      <nav className="mx-auto h-full flex items-center justify-between px-5 sm:px-10 max-w-[1600px]">
        <a
          href="#"
          className="t-label outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
          style={{ color: 'var(--text-primary)', outlineColor: 'var(--accent-ink)' }}
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0 });
          }}
        >
          N.Vogelaar
        </a>

        {/* Plate index — desktop only */}
        <div className="hidden md:flex items-center gap-6" aria-label="Plate index">
          {plateIds.map((id, i) => {
            const isActive = activePlate === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                className="t-index py-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
                aria-label={`Plate ${String(i + 1).padStart(2, '0')}: ${siteContent.projects[i].title}`}
                style={{
                  color: isActive ? 'var(--accent-ink)' : 'var(--text-muted)',
                  outlineColor: 'var(--accent-ink)',
                  transition: 'color 300ms ease',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-5 sm:gap-8">
          <a
            href="#about"
            className="t-index hidden sm:block py-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
            style={{ color: 'var(--text-secondary)', outlineColor: 'var(--accent-ink)' }}
          >
            Essay
          </a>
          <a
            href="#contact"
            aria-label="Contact"
            className="t-index py-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
            style={{ color: 'var(--text-secondary)', outlineColor: 'var(--accent-ink)' }}
          >
            Colophon
          </a>
          <button
            onClick={onToggleTheme}
            className="t-index py-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
            style={{ color: 'var(--text-secondary)', outlineColor: 'var(--accent-ink)' }}
            aria-label={theme === 'dark' ? 'Switch to day theme' : 'Switch to night theme'}
          >
            {theme === 'dark' ? 'Day' : 'Night'}
          </button>
        </div>
      </nav>
    </header>
  );
}
