import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const details = [
  { label: 'Based in', value: 'Amsterdam, NL' },
  { label: 'Experience', value: '4+ years' },
  { label: 'Focus', value: 'Web & Mobile' },
  { label: 'Status', value: 'Available for projects' },
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
                I've been building web and mobile products for over four years —
                mostly for founders and companies who want clean code, real accountability,
                and a developer who treats their product like it actually matters.
              </motion.p>

              <motion.p
                className="text-lg sm:text-xl leading-relaxed"
                style={{ color: 'var(--text-secondary)', maxWidth: '58ch' }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.25 }}
              >
                My stack spans Vue, Nuxt, React, Angular, Ionic, Node.js, and C++ —
                I reach for whatever the problem actually needs. What stays constant
                is the architecture: accessible, maintainable, and ready for the next
                person who opens the codebase.
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
                    className="text-xs uppercase tracking-widest mb-1"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {item.label}
                  </p>
                  <p className="text-base" style={{ color: 'var(--text-primary)' }}>
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
