import { useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { decode, gsap, reducedMotion, ScrollTrigger } from '../lib/motion';

/**
 * Reveal — word (or line) masks that slide up on enter. The page's one
 * text motion; used for every headline and lede, never for UI copy.
 */
type RevealProps = {
  as?: keyof HTMLElementTagNameMap;
  children?: string;
  lines?: string[];
  className?: string;
  style?: CSSProperties;
  delay?: number;
  once?: boolean;
  id?: string;
};

export function Reveal({ as = 'p', children, lines, className, style, delay = 0, id }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  // Layout effect: spans are hidden before the first paint, so the reveal
  // starts from hidden rather than flashing visible → hidden → visible.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const parts = el.querySelectorAll<HTMLElement>('.rv > span');
    gsap.set(parts, { yPercent: 110 });
    const tween = gsap.to(parts, {
      yPercent: 0,
      duration: 1.0,
      ease: 'power4.out',
      stagger: lines ? 0.09 : 0.014,
      delay,
      paused: true,
    });
    const st = ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => tween.play() });
    return () => {
      st.kill();
      tween.kill();
    };
  }, [children, lines, delay]);

  const segments: ReactNode[] = lines
    ? lines.map((line, i) => (
        <span key={i} className="rv" style={{ display: 'block' }}>
          <span>{line}</span>
        </span>
      ))
    : (children ?? '')
        .split(' ')
        .flatMap((w, i, arr) => [
          <span key={i} className="rv">
            <span>{w}</span>
          </span>,
          i < arr.length - 1 ? ' ' : null,
        ]);

  const Tag = as as 'div'; // ponytail: narrowed for TS; the real tag is `as`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Tag ref={ref as any} className={className} style={style} id={id}>{segments}</Tag>;
}

/** Mono label that decodes into place when it enters the viewport. */
export function Mono({
  children,
  bracket = false,
  className = '',
  style,
  as = 'span',
}: {
  children: string;
  bracket?: boolean;
  className?: string;
  style?: CSSProperties;
  as?: keyof HTMLElementTagNameMap;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.dataset.text = children;
    let cancel: (() => void) | undefined;
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        cancel = decode(el) ?? undefined;
      },
    });
    return () => {
      st.kill();
      cancel?.();
    };
  }, [children]);
  const Tag = as as 'div'; // ponytail: narrowed for TS; the real tag is `as`
  // The decode scrambles the visible glyphs for ~700ms; assistive tech reads the sr-only copy instead.
  return (
    <Tag className={`t-mono ${bracket ? 'bracket' : ''} ${className}`} style={style}>
      <span ref={ref} aria-hidden="true">{children}</span>
      <span className="sr-only">{children}</span>
    </Tag>
  );
}
