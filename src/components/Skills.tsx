import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

/**
 * "What for what" — not a tool list, an editorial point of view on the stack.
 * Each entry: a bold tool/group name, then one sentence about when I reach for it.
 */
const picks = [
  {
    tools: 'Vue, Nuxt',
    when: 'Default for fast, reactive front-ends. Forms that don\u2019t thrash, tables with thousands of rows, anything that lives.',
  },
  {
    tools: 'React',
    when: 'When the team already knows it, the ecosystem matters more than ergonomics, or a library only ships React.',
  },
  {
    tools: 'Ionic, Capacitor',
    when: 'One codebase to iOS, Android, and the web. For when two native teams isn\u2019t in the budget.',
  },
  {
    tools: 'TypeScript',
    when: 'Always. Plain JS is debt the moment a second person opens the file.',
  },
  {
    tools: 'Node.js, REST, SQL',
    when: 'Backend glue: APIs, schedulers, integrations. Boring on purpose.',
  },
  {
    tools: 'Figma, Tailwind',
    when: 'Where the design happens, and what gets it shipped without a translation step.',
  },
];

export function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="skills" className="px-5 sm:px-8 py-20 sm:py-32">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mb-4">
            How I pick the stack.
          </h2>
          <p
            className="text-base sm:text-lg max-w-[58ch] mb-14 sm:mb-20"
            style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}
          >
            The stack follows the problem, never the other way around. Here is what
            I reach for, and when.
          </p>

          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            {picks.map((p, i) => (
              <motion.div
                key={p.tools}
                className="py-7 sm:py-8 flex gap-6 sm:gap-8"
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  // Vertical hairline between columns on md+
                  ...(i % 2 === 0
                    ? { paddingRight: 'clamp(1rem, 3vw, 2.5rem)' }
                    : { paddingLeft: 'clamp(1rem, 3vw, 2.5rem)' }),
                }}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.06 }}
              >
                <span
                  className="font-display tabular-nums shrink-0"
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem',
                    letterSpacing: '0.04em',
                    paddingTop: '0.35rem',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <h3
                    className="font-display mb-2"
                    style={{
                      fontSize: 'clamp(1.25rem, 2vw, 1.625rem)',
                      lineHeight: 1.15,
                      letterSpacing: '-0.015em',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {p.tools}
                  </h3>
                  <p
                    className="text-base sm:text-[1.0625rem]"
                    style={{
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      maxWidth: '52ch',
                    }}
                  >
                    {p.when}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
