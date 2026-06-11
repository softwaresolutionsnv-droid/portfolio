import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { KineticHeading } from './KineticHeading';
import { siteContent } from '../lib/content';

/**
 * "What for what" — not a tool list, an editorial point of view on the stack.
 * Each entry: a bold tool/group name, then one sentence about when I reach
 * for it. CMS-managed.
 */
const picks = siteContent.skills.picks;

export function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="skills" className="px-5 sm:px-8 py-20 sm:py-32">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <KineticHeading
            as="h2"
            lines={['How I pick', 'the stack.']}
            className="font-display text-3xl sm:text-4xl md:text-5xl mb-4"
          />
          <p
            className="text-base sm:text-lg max-w-[58ch] mb-14 sm:mb-20"
            style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}
          >
            {siteContent.skills.intro}
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
