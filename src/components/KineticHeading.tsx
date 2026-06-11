import { motion, useReducedMotion } from 'framer-motion';
import { useVelocitySkew } from '../lib/kinetic';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Props = {
  /** One entry per visual line. Each line gets its own mask + stagger. */
  lines: string[];
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  style?: React.CSSProperties;
  /** Per-line stagger in seconds. */
  stagger?: number;
  delay?: number;
  /** Max scroll-velocity shear in degrees. */
  skew?: number;
};

/**
 * Section heading with the system's two kinetic signatures:
 * masked line reveals on entrance, scroll-velocity skew at rest.
 */
export function KineticHeading({
  lines,
  as = 'h2',
  className = '',
  style,
  stagger = 0.09,
  delay = 0,
  skew = 1.4,
}: Props) {
  const reduced = useReducedMotion();
  const skewY = useVelocitySkew(skew);
  const Tag = motion[as];

  return (
    <Tag className={className} style={{ ...style, skewY, transformOrigin: '0% 100%' }}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={reduced ? false : { y: '110%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{
              duration: 0.9,
              delay: delay + i * stagger,
              ease: EASE_OUT_EXPO,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
