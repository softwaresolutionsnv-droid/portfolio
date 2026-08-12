import { motion, useReducedMotion } from 'framer-motion';
import { siteContent } from '../lib/content';
import { availabilityCopy } from '../lib/availability';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const status = availabilityCopy(siteContent.availability);

/** First sentence of the card description — the index row's annotation. */
function firstSentence(text: string): string {
  const i = text.indexOf('. ');
  return i === -1 ? text : text.slice(0, i + 1);
}

const rows = siteContent.projects.map((p, i) => ({
  no: String(i + 1).padStart(2, '0'),
  id: `plate-${String(i + 1).padStart(2, '0')}`,
  title: p.title,
  year: p.year,
  note: firstSentence(p.description),
}));

/** Entrance: mass, not energy — fade + ≤24px rise, museum-slow. */
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.0, delay, ease: EASE },
});

/**
 * Title page — the approved "Marginal Index" composition. Index of
 * built work left; stacked Monument name right with a colossal
 * blind-embossed numeral behind it; serif practice line below.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const r = (delay: number) => (reduced ? {} : rise(delay));

  return (
    <section
      className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden"
      aria-label="Title page"
    >
      {/* Colossal blind-embossed numeral — set into the wall, not on it. */}
      <div
        aria-hidden="true"
        className="t-numeral absolute pointer-events-none select-none"
        style={{
          fontSize: 'clamp(20rem, 55vh, 44rem)',
          color: 'var(--emboss)',
          right: '-0.08em',
          top: '40%',
          transform: 'translateY(-50%)',
          fontWeight: 100,
        }}
      >
        01
      </div>

      {/* Monument first in the DOM so tab/reading order announces the name
          before the index; CSS order handles the desktop composition. */}
      <div className="relative mx-auto w-full max-w-[1600px] px-5 sm:px-10 pt-28 pb-10 sm:pb-14 grid gap-14 lg:gap-10 lg:grid-cols-[minmax(300px,420px)_1fr]">
        {/* ---------- The monument (right on desktop) ---------- */}
        <div className="lg:order-2 flex flex-col justify-end min-w-0">
          <motion.p
            {...r(0.15)}
            className="t-label mb-8"
            style={{ color: 'var(--text-muted)' }}
          >
            Designer — Developer, {siteContent.contact.location} · {status.hero}
          </motion.p>

          <motion.h1
            {...r(0.3)}
            className="t-monument raking-light"
            style={{ color: 'var(--text-primary)' }}
          >
            Nils
            <br />
            Vogelaar
          </motion.h1>

          <motion.p
            {...r(0.5)}
            className="t-serif mt-10"
            style={{
              fontSize: 'clamp(1.0625rem, 1.4vw, 1.25rem)',
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              maxWidth: '52ch',
            }}
          >
            I design and build web and mobile products for scale-ups, founders,
            and local businesses that need to punch above their weight. One
            person from first conversation to launch day: no handoffs, no
            account managers.
          </motion.p>
        </div>

        {/* ---------- The index of built work (left on desktop) ---------- */}
        <motion.nav
          {...r(0.55)}
          aria-label="Index of built work"
          className="lg:order-1 self-end lg:pr-10 lg:border-r"
          style={{ borderColor: 'var(--border)' }}
        >
          <p className="t-label mb-6" style={{ color: 'var(--text-muted)' }}>
            Index of built work
          </p>
          <ul style={{ borderTop: '1px solid var(--border)' }}>
            {rows.map((row, i) => (
              <li key={row.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <a
                  href={`#${row.id}`}
                  className="group block py-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
                  style={{ outlineColor: 'var(--accent-ink)' }}
                >
                  <span
                    className="t-index flex items-baseline gap-3"
                    style={{
                      color: i === 0 ? 'var(--accent-ink)' : 'var(--text-primary)',
                    }}
                  >
                    <span>{row.no}</span>
                    <span className="t-label" style={{ color: 'inherit' }}>
                      {row.title}
                    </span>
                    <span className="ml-auto" style={{ color: 'var(--text-muted)' }}>
                      {row.year}
                    </span>
                  </span>
                  <span
                    className="t-serif block mt-1.5"
                    style={{
                      fontSize: '0.9375rem',
                      lineHeight: 1.5,
                      color: 'var(--text-secondary)',
                      maxWidth: '44ch',
                    }}
                  >
                    {row.note}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </motion.nav>
      </div>

      {/* Base hairline closing the title page */}
      <div
        className="mx-auto w-full max-w-[1600px] px-5 sm:px-10"
        aria-hidden="true"
      >
        <div style={{ height: 1, backgroundColor: 'var(--border)' }} />
      </div>
    </section>
  );
}
