import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

const socials = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/nilsvogt' },
  { label: 'GitHub', href: 'https://github.com/nilsvogt' },
];

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="contact" className="px-5 sm:px-8 py-20 sm:py-32">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mb-6">
            Let's work together.
          </h2>

          <motion.p
            className="text-lg sm:text-xl max-w-[50ch] mb-10"
            style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Have a project in mind? I'm currently available for freelance work.
            Tell me what you're building and I'll tell you how I can help.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-start gap-5 mb-16"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <a
              href="mailto:hello@nilsvogt.com"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium tracking-wide transition-colors hover:bg-[var(--color-accent-hover,oklch(0.58_0.22_25))]"
              style={{
                backgroundColor: 'var(--color-accent, oklch(0.65 0.22 25))',
                color: 'white',
              }}
            >
              hello@nilsvogt.com
              <ArrowUpRight className="w-4 h-4" />
            </a>

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
          </motion.div>

          <motion.footer
            className="pt-10 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            style={{ borderColor: 'var(--border-subtle)' }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              &copy; {new Date().getFullYear()} Nils Vogt
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Built with React, Tailwind CSS & Framer Motion
            </p>
          </motion.footer>
        </motion.div>
      </div>
    </section>
  );
}
