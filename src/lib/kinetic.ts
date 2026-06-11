import { useEffect } from 'react';
import {
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from 'framer-motion';

/**
 * Scroll-velocity skew — the kinetic-typography signature.
 *
 * Returns a MotionValue in degrees that shears display type with scroll
 * momentum and springs back to rest. Transform-only, zero re-renders.
 * Collapses to 0deg for reduced-motion users.
 */
export function useVelocitySkew(maxDeg = 1.4): MotionValue<number> {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { stiffness: 280, damping: 50, mass: 0.6 });

  // Gate through a motion value so reduced-motion changes apply without
  // rebuilding the transform chain.
  const factor = useMotionValue(reduced ? 0 : 1);
  useEffect(() => {
    factor.set(reduced ? 0 : 1);
  }, [reduced, factor]);

  const skew = useTransform(smooth, [-3000, 3000], [maxDeg, -maxDeg], {
    clamp: true,
  });
  return useTransform([skew, factor], ([s, f]) => (s as number) * (f as number));
}
