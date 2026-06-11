import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { KineticHeading } from './KineticHeading';
import { Magnetic } from './Magnetic';
import { LocalTime } from './LocalTime';
import { smoothScrollTo } from '../lib/smoothScroll';

const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nils-v-342b55176/' },
  { label: 'GitHub', href: 'https://github.com/softwaresolutionsnv-droid' },
];

/**
 * The finale: a full-viewport closing statement. This is the page's second
 * and last Display-scale moment (the first is the hero), and the email CTA
 * is the loudest Ember on the whole page.
 */
export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="contact"
      className="px-5 sm:px-8 pt-24 sm:pt-32 pb-6 sm:pb-8 min-h-[100svh] flex flex-col"
    >
      <div ref={ref} className="max-w-6xl mx-auto w-full flex-1 flex flex-col">
        <motion.p
          className="text-sm font-medium uppercase mb-8 sm:mb-10"
          style={{ color: 'var(--text-muted)', letterSpacing: '0.04em' }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          Up next: your project
        </motion.p>

        <KineticHeading
          as="h2"
          lines={["Let's work", 'together.']}
          skew={2}
          className="font-display"
          style={{
            fontSize: 'clamp(3.25rem, 11.5vw, 9.5rem)',
            lineHeight: 0.92,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
          }}
        />

        <motion.p
          className="text-lg sm:text-xl max-w-[50ch] mt-8 sm:mt-10"
          style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          Scaling something and need a developer who thinks alongside you?
          Tell me what you're building. I'll tell you what it actually takes.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row sm:items-center items-start gap-5 mt-10"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <Magnetic>
            <a
              href="mailto:softwaresolutions.nv@gmail.com"
              className="inline-flex items-center gap-2 px-7 py-4 text-sm sm:text-base font-medium tracking-wide transition-colors hover:bg-[var(--color-accent-hover,oklch(0.58_0.22_25))]"
              style={{
                backgroundColor: 'var(--color-accent, oklch(0.65 0.22 25))',
                color: 'white',
              }}
            >
              softwaresolutions.nv@gmail.com
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </Magnetic>

          <div className="flex items-center gap-5">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium py-3.5 transition-colors hover:opacity-70"
                style={{ color: 'var(--text-secondary)' }}
              >
                {social.label}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Living status line */}
        <motion.p
          className="inline-flex items-center gap-2 text-sm mt-10"
          style={{ color: 'var(--text-muted)' }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <span
            aria-hidden="true"
            className="inline-block animate-pulse"
            style={{
              width: 7,
              height: 7,
              borderRadius: 9999,
              backgroundColor: 'var(--color-accent-subtle)',
            }}
          />
          Available for new projects · Amsterdam · <LocalTime />
        </motion.p>

        <div className="flex-1" aria-hidden="true" />

        <motion.footer
          className="pt-8 mt-16 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          style={{ borderColor: 'var(--border-subtle)' }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            &copy; {new Date().getFullYear()} Nils Vogelaar
          </p>
          <p
            className="text-sm hidden sm:block"
            style={{ color: 'var(--text-muted)' }}
          >
            Built with React, Tailwind CSS & Framer Motion
          </p>
          <button
            type="button"
            onClick={() => smoothScrollTo(0)}
            className="inline-flex items-center gap-1.5 text-sm transition-colors hover:opacity-70"
            style={{ color: 'var(--text-secondary)' }}
          >
            Back to top
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </motion.footer>
      </div>
    </section>
  );
}
