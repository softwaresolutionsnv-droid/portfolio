import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useVelocitySkew } from '../lib/kinetic';
import { LocalTime } from './LocalTime';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

function RevealLine({
  children,
  delay,
  play,
  className = '',
}: {
  children: React.ReactNode;
  delay: number;
  play: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const shown = reduced || play;
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={reduced ? false : { y: '110%', opacity: 0 }}
        animate={shown ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
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

export function Hero({ play }: { play: boolean }) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Kinetic exit: as the hero scrolls away, the headline lines shear apart
  // horizontally while the block fades. Transform/opacity only.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const drift1 = useTransform(scrollYProgress, [0, 1], ['0%', '-7%']);
  const drift2 = useTransform(scrollYProgress, [0, 1], ['0%', '5%']);
  const drift3 = useTransform(scrollYProgress, [0, 1], ['0%', '-3.5%']);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const skewY = useVelocitySkew(1.6);

  return (
    <section
      ref={sectionRef}
      className="min-h-[100svh] flex items-end pb-16 sm:pb-24 pt-32 px-5 sm:px-8 relative"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Eyebrow — with the live Amsterdam clock */}
        <RevealLine delay={0.15} play={play}>
          <p
            className="text-sm sm:text-base mb-6 tracking-wide uppercase"
            style={{ color: 'var(--text-muted)', letterSpacing: '0.04em' }}
          >
            Freelance Developer & Designer · Amsterdam{' '}
            <LocalTime /> · Available
          </p>
        </RevealLine>

        {/* Headline — masked line reveals on entrance, shear-apart on exit */}
        <motion.h1
          className="font-display text-[clamp(2.8rem,8vw,7rem)] leading-[0.95] mb-8 max-w-[18ch]"
          style={{
            color: 'var(--text-primary)',
            skewY,
            opacity: reduced ? 1 : fade,
            transformOrigin: '0% 100%',
          }}
        >
          <motion.span className="block" style={{ x: reduced ? 0 : drift1 }}>
            <RevealLine delay={0.3} play={play}>
              I build products
            </RevealLine>
          </motion.span>
          <motion.span className="block" style={{ x: reduced ? 0 : drift2 }}>
            <RevealLine delay={0.4} play={play}>
              with the thinking
            </RevealLine>
          </motion.span>
          <motion.span className="block" style={{ x: reduced ? 0 : drift3 }}>
            <RevealLine delay={0.5} play={play} className="inline-flex">
              <motion.span
                style={{ color: 'var(--color-accent, oklch(0.65 0.22 25))' }}
                initial={reduced ? false : { scale: 1 }}
                animate={play && !reduced ? { scale: [1, 1.06, 1] } : {}}
                transition={{
                  delay: 1.1,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                  times: [0, 0.5, 1],
                }}
              >
                behind them.
              </motion.span>
            </RevealLine>
          </motion.span>
        </motion.h1>

        {/* Horizontal rule — sweeps left to right */}
        <motion.div
          className="h-px mb-10 origin-left"
          style={{ backgroundColor: 'var(--border)' }}
          initial={reduced ? false : { scaleX: 0 }}
          animate={reduced || play ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.8,
            ease: EASE_OUT_EXPO,
          }}
        />

        {/* Body text */}
        <RevealLine delay={0.95} play={play}>
          <p
            className="text-lg sm:text-xl max-w-[52ch] mb-10"
            style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}
          >
            Fluent in product, design, and code. And in the AI tools
            that let one person move at team speed. No agency overhead,
            no handoffs. Direct communication and full ownership,
            from the first conversation to launch day.
          </p>
        </RevealLine>

        {/* CTAs — both ghost. The loudest Ember on the page lives in the finale. */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={
            reduced || play ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.6, delay: 1.15, ease: EASE_OUT_EXPO }}
        >
          <a
            href="#projects"
            className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-medium tracking-wide border transition-colors hover:bg-[var(--bg-surface)]"
            style={{
              borderColor: 'var(--text-primary)',
              color: 'var(--text-primary)',
            }}
          >
            View Selected Work
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-medium tracking-wide transition-colors hover:opacity-70"
            style={{
              color: 'var(--text-secondary)',
            }}
          >
            Start a conversation →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
