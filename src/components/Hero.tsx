import { motion, useReducedMotion } from 'framer-motion';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

function RevealLine({
  children,
  delay,
  className = '',
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={reduced ? false : { y: '110%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        transition={{
          y: { duration: 0.8, delay, ease: EASE_OUT_EXPO },
          opacity: { duration: 0.4, delay, ease: 'easeOut' },
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section className="min-h-[100svh] flex items-end pb-16 sm:pb-24 pt-32 px-5 sm:px-8 relative">
      <div className="max-w-6xl mx-auto w-full">
        {/* Eyebrow */}
        <RevealLine delay={0.15}>
          <p
            className="text-sm sm:text-base mb-6 tracking-wide uppercase"
            style={{ color: 'var(--text-muted)' }}
          >
            Freelance Developer & Designer — Amsterdam
          </p>
        </RevealLine>

        {/* Headline — each visual line reveals independently */}
        <h1
          className="font-display text-[clamp(2.8rem,8vw,7rem)] leading-[0.95] mb-8 max-w-[18ch]"
          style={{ color: 'var(--text-primary)' }}
        >
          <RevealLine delay={0.3}>I build digital</RevealLine>
          <RevealLine delay={0.4}>products that</RevealLine>
          <RevealLine delay={0.5} className="inline-flex">
            <motion.span
              style={{ color: 'var(--color-accent, oklch(0.65 0.22 25))' }}
              initial={reduced ? false : { scale: 1 }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{
                delay: 1.1,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
                times: [0, 0.5, 1],
              }}
            >
              work.
            </motion.span>
          </RevealLine>
        </h1>

        {/* Horizontal rule — sweeps left to right */}
        <motion.div
          className="h-px mb-10 origin-left"
          style={{ backgroundColor: 'var(--border)' }}
          initial={reduced ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: 0.9,
            delay: 0.8,
            ease: EASE_OUT_EXPO,
          }}
        />

        {/* Body text */}
        <RevealLine delay={0.95}>
          <p
            className="text-lg sm:text-xl max-w-[52ch] mb-10"
            style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}
          >
            I turn hard product problems into clean, fast software.
            No agency overhead, no handoffs — one person responsible
            for the whole thing, from first commit to launch day.
          </p>
        </RevealLine>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.15, ease: EASE_OUT_EXPO }}
        >
          <a
            href="#projects"
            className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-medium tracking-wide transition-colors"
            style={{
              backgroundColor: 'var(--color-accent, oklch(0.65 0.22 25))',
              color: 'white',
            }}
          >
            View Selected Work
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-medium tracking-wide border transition-colors hover:bg-[var(--bg-surface)]"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            Start a Conversation
          </a>
        </motion.div>
      </div>
    </section>
  );
}
