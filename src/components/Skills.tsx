import { motion, useReducedMotion } from 'framer-motion';
import { siteContent } from '../lib/content';
import { useLoc, useT } from '../lib/i18n';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const picks = siteContent.skills.picks;

/**
 * Specifications — the stack as a ruled spec table: tool column in
 * engraved capitals, rationale in serif.
 */
export function Skills() {
  const reduced = useReducedMotion();
  const t = useT();
  const loc = useLoc();

  return (
    <section id="skills" style={{ padding: 'clamp(5rem, 12vh, 10rem) 0', paddingTop: 0 }}>
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-10">
        <div
          className="flex flex-wrap items-baseline justify-between gap-4 pb-5 mb-10 sm:mb-14"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <h2 className="t-label" style={{ color: 'var(--text-muted)' }}>
            {t.skills.header}
          </h2>
          <p
            className="t-serif"
            style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '52ch' }}
          >
            {loc(siteContent.skills.intro)}
          </p>
        </div>

        <div style={{ borderTop: '1px solid var(--border)' }}>
          {picks.map((p, i) => (
            <motion.div
              key={p.tools}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={reduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, delay: Math.min(i * 0.06, 0.3), ease: EASE }}
              className="grid gap-2 sm:gap-8 py-6 sm:grid-cols-[minmax(180px,280px)_1fr]"
              style={{ borderBottom: '1px solid var(--border-subtle)' }}
            >
              <h3
                className="t-headline"
                style={{ fontSize: '1.125rem', color: 'var(--text-primary)' }}
              >
                {p.tools}
              </h3>
              <p
                className="t-serif m-0"
                style={{
                  fontSize: '1.0625rem',
                  lineHeight: 1.65,
                  color: 'var(--text-secondary)',
                  maxWidth: '58ch',
                }}
              >
                {loc(p.when)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
