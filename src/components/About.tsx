import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const details = [
  { label: 'Based in', value: 'Amsterdam, NL' },
  { label: 'Experience', value: '4+ years' },
  { label: 'Focus', value: 'Web & Mobile' },
  { label: 'Status', value: 'Available for projects', accent: true as const },
];

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" className="px-5 sm:px-8 py-20 sm:py-32">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mb-14 sm:mb-20">
            About
          </h2>

          <div className="grid lg:grid-cols-[1fr_280px] gap-12 lg:gap-20">
            <div>
              <motion.p
                className="text-lg sm:text-xl leading-relaxed mb-6"
                style={{ color: 'var(--text-secondary)', maxWidth: '58ch' }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                Four years building web and mobile products — mostly for scale-ups
                and founders who need a developer that thinks like a product person.
                At Autodisk I took FleetDisk from an unfinished internal tool to a
                polished platform now running live fleets for companies like Van Mossel.
              </motion.p>

              <motion.p
                className="text-lg sm:text-xl leading-relaxed"
                style={{ color: 'var(--text-secondary)', maxWidth: '58ch' }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.25 }}
              >
                My stack spans Vue, Nuxt, React, Angular, Ionic, Node.js, and C++.
                I'm deeply fluent in AI tools and build them into every project
                to move faster without cutting corners. What stays constant is how
                I work: directly, communicatively, and like the product is mine.
              </motion.p>
            </div>

            <motion.div
              className="space-y-6 lg:pt-1"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              {details.map((item) => (
                <div key={item.label}>
                  <p
                    className="text-sm font-medium mb-1"
                    style={{
                      color: 'var(--text-muted)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="text-base inline-flex items-center gap-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {('accent' in item && item.accent) && (
                      <span
                        aria-hidden="true"
                        className="inline-block animate-pulse"
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '9999px',
                          backgroundColor: 'var(--color-accent, oklch(0.65 0.22 25))',
                        }}
                      />
                    )}
                    {item.value}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
