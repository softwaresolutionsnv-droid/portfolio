import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';

type CursorMode = 'default' | 'hover' | 'view' | 'drag';

const LABELS: Partial<Record<CursorMode, string>> = {
  view: 'View',
  drag: 'Drag',
};

/**
 * Contextual cursor: a small blend-mode dot that grows over interactive
 * elements and swaps to a labeled disk over surfaces that need a verb
 * ("View" on project cards, "Drag" on the work rail).
 *
 * Mouse-only — never mounts for touch / coarse pointers. Position is driven
 * by motion values, so tracking costs zero React renders.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<CursorMode>('default');
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Tight spring: present, never laggy.
  const sx = useSpring(x, { stiffness: 900, damping: 60, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 900, damping: 60, mass: 0.3 });

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.setAttribute('data-custom-cursor', '');

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const tagged = target?.closest<HTMLElement>('[data-cursor]');
      const taggedMode = tagged?.dataset.cursor as CursorMode | undefined;
      if (taggedMode) {
        setMode(taggedMode);
        return;
      }
      if (target?.closest('a, button, [role="button"]')) {
        setMode('hover');
        return;
      }
      setMode('default');
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    document.documentElement.addEventListener('pointerenter', onEnter);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.documentElement.removeEventListener('pointerenter', onEnter);
      document.documentElement.removeAttribute('data-custom-cursor');
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const label = LABELS[mode];

  return (
    <div className="pointer-events-none fixed inset-0 z-[500]" aria-hidden="true">
      {/* Dot — near-white + difference blend stays legible on both themes */}
      <motion.div
        className="fixed top-0 left-0 rounded-full"
        style={{
          x: sx,
          y: sy,
          marginLeft: -5,
          marginTop: -5,
          width: 10,
          height: 10,
          backgroundColor: 'oklch(0.98 0.006 50)',
          mixBlendMode: 'difference',
          opacity: visible ? 1 : 0,
          transition: 'opacity 200ms ease',
        }}
        animate={{ scale: label ? 0 : mode === 'hover' ? 2.4 : 1 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Contextual verb disk */}
      <AnimatePresence>
        {label && visible && (
          <motion.div
            key={label}
            className="fixed top-0 left-0 grid place-items-center rounded-full"
            style={{
              x: sx,
              y: sy,
              marginLeft: -32,
              marginTop: -32,
              width: 64,
              height: 64,
              backgroundColor: 'var(--disk-on-image)',
              color: 'var(--ink-on-image)',
              border: '1px solid var(--hairline-on-image)',
            }}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              className="text-xs font-medium"
              style={{ letterSpacing: '0.04em' }}
            >
              {label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
