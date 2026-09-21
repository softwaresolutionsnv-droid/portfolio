import { useEffect, useRef, useState } from 'react';
import { gsap, reducedMotion } from '../lib/motion';

/**
 * Cursor label — a mono tag trailing the pointer (GSAP quickTo) whenever it
 * is over an element carrying `data-cursor="…"`. Hidden on touch (CSS).
 */
export function CursorLabel() {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState('');

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const x = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });
    const onMove = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      const target = (e.target as Element | null)?.closest<HTMLElement>('[data-cursor]');
      setText(target?.dataset.cursor ?? '');
    };
    const onLeave = () => setText('');
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onLeave, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onLeave);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={`cursor-label ${text ? 'is-on' : ''}`} aria-hidden="true">
      <span>{text}</span>
    </div>
  );
}
