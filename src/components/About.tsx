import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { KineticHeading } from './KineticHeading';
import { ProgressParagraph } from './ProgressParagraph';
import { siteContent } from '../lib/content';
import { availabilityCopy } from '../lib/availability';

const status = availabilityCopy(siteContent.availability);

// The status row is derived from the CMS availability state; the other
// rows are CMS-managed copy.
const details = [
  ...siteContent.about.details,
  { label: 'Status', value: status.about, accent: true as const },
];

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" className="px-5 sm:px-8 py-20 sm:py-32">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <KineticHeading
            as="h2"
            lines={['About']}
            className="font-display text-3xl sm:text-4xl md:text-5xl mb-14 sm:mb-20"
          />

          <div className="grid lg:grid-cols-[1fr_280px] gap-12 lg:gap-20">
            <div>
              {/* Kinetic signature: words brighten as the visitor reads down */}
              <ProgressParagraph
                className="text-lg sm:text-xl leading-relaxed mb-6"
                style={{ color: 'var(--text-primary)', maxWidth: '58ch' }}
                text={siteContent.about.intro}
              />

              <motion.p
                className="text-lg sm:text-xl leading-relaxed"
                style={{ color: 'var(--text-secondary)', maxWidth: '58ch' }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.25 }}
              >
                {siteContent.about.body}
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
                        className={status.pulse ? 'inline-block animate-pulse' : 'inline-block'}
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '9999px',
                          backgroundColor: status.dotColor,
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
