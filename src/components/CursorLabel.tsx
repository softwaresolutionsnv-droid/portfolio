import { useEffect, useRef } from 'react';
import { gsap, reducedMotion, typeText } from '../lib/motion';

/**
 * Cursor label — a small black mono tag that hangs off the pointer, its
 * bottom-left corner on the tip, whenever the pointer is over an element
 * carrying `data-cursor="…"`. The text types in through the glyph pool and
 * types back out on leave. The native cursor stays. Hidden on touch (CSS);
 * under reduced motion the tag follows without lag and without the decode.
 */
export function CursorLabel() {
  const ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const txt = textRef.current;
    if (!el || !txt) return;
    const reduced = reducedMotion();
    const x = gsap.quickTo(el, 'x', { duration: reduced ? 0 : 0.25, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: reduced ? 0 : 0.25, ease: 'power3.out' });
    let current = '';
    let placed = false;
    let hide: gsap.core.Tween | null = null;

    const show = (label: string) => {
      if (label === current) return;
      current = label;
      hide?.kill();
      if (label) {
        el.classList.add('is-on');
        typeText(txt, 'in', label, Math.min(650, 220 + label.length * 22));
      } else {
        const out = txt.textContent ?? '';
        typeText(txt, 'out', out, 280);
        hide = gsap.delayedCall(reduced ? 0 : 0.28, () => el.classList.remove('is-on'));
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      if (!placed) {
        gsap.set(el, { x: e.clientX, y: e.clientY }); /* first contact: no fly-in from the corner */
        placed = true;
      }
      x(e.clientX);
      y(e.clientY);
      const target = (e.target as Element | null)?.closest<HTMLElement>('[data-cursor]');
      show(target?.dataset.cursor ?? '');
    };
    const onLeave = () => show('');
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onLeave, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      hide?.kill();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onLeave);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="cursor-label" aria-hidden="true">
      <span ref={textRef} />
    </div>
  );
}
