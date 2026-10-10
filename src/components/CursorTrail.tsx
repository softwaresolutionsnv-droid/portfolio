import { useEffect, useRef } from 'react';
import { reducedMotion } from '../lib/motion';

/**
 * Cursor trail — the pointer stirs a velocity field that decays every frame;
 * wherever the field is moving, the 16px grid lights an ordered pattern of
 * 2px dots (up to 7 of the 4×4 sub-positions, densest where it moves
 * fastest). The pointer leaves a halftone wake that settles within half a
 * second. Canvas 2D, so the hero dither stays the one WebGL surface; the
 * loop only runs while something is still moving. Off on touch and under
 * reduced motion. Dots take the live theme's ink.
 */

const CELL = 16; /* grid cell, CSS px */
const SUB = 4; /* sub-dot pitch inside a cell */
const DOT = 2; /* dot size, CSS px */
const RADIUS = 0.04; /* stir radius, share of the viewport height */
const STRENGTH = 0.04; /* how much of the pointer's travel (px) one stir adds */
const MAX_DOTS = 7;

/* Fill order of the 4×4 sub-grid (ordered dither): the first n light up at level n. */
const ORDER: [number, number][] = [
  [0, 0], [2, 2], [2, 0], [0, 2], [1, 1], [3, 3], [3, 1],
];

export function CursorTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || reducedMotion() || window.matchMedia('(pointer: coarse)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, cols = 0, rows = 0, dpr = 1;
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cols = Math.ceil(w / CELL);
      rows = Math.ceil(h / CELL);
      vx = new Float32Array(cols * rows);
      vy = new Float32Array(cols * rows);
    };
    resize();

    /* dot colour follows the section theme */
    const html = document.documentElement;
    let ink = '';
    const readInk = () => {
      const rgb = getComputedStyle(html).getPropertyValue('--ink-rgb').trim().split(/\s+/).join(',');
      ink = `rgb(${rgb})`;
    };
    readInk();
    const mo = new MutationObserver(readInk);
    mo.observe(html, { attributes: true, attributeFilter: ['data-theme'] });

    let last: [number, number] | null = null;
    let cur: [number, number] | null = null;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      cur = [e.clientX, e.clientY];
      if (!last) last = cur;
      start();
    };
    const onLeave = () => {
      last = cur = null;
    };

    /* add the pointer's travel since the last frame into the field, gaussian around it */
    const stir = () => {
      if (!cur || !last) return;
      const dx = cur[0] - last[0];
      const dy = cur[1] - last[1];
      last = cur;
      if (dx === 0 && dy === 0) return;
      const r = RADIUS * h;
      const reach = Math.ceil((r * 2.6) / CELL);
      const cx = Math.floor(cur[0] / CELL);
      const cy = Math.floor(cur[1] / CELL);
      for (let y = Math.max(0, cy - reach); y <= Math.min(rows - 1, cy + reach); y++) {
        for (let x = Math.max(0, cx - reach); x <= Math.min(cols - 1, cx + reach); x++) {
          const px = (x + 0.5) * CELL - cur[0];
          const py = (y + 0.5) * CELL - cur[1];
          const k = Math.exp(-(px * px + py * py) / (r * r)) * STRENGTH;
          if (k < 1e-3) continue;
          const i = y * cols + x;
          vx[i] += dx * k;
          vy[i] += dy * k;
        }
      }
    };

    let raf = 0;
    let running = false;
    let prev = 0;
    const frame = (now: number) => {
      const dt = prev ? Math.min(now - prev, 64) : 16;
      prev = now;
      stir();
      const decay = 1 - Math.min(0.5, dt / 250);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = ink;
      let alive = false;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const a = vx[i], b = vy[i];
          if (a === 0 && b === 0) continue;
          const m = Math.hypot(a, b);
          if (m < 0.004) {
            vx[i] = vy[i] = 0;
            continue;
          }
          alive = true;
          vx[i] = a * decay;
          vy[i] = b * decay;
          const n = Math.min(MAX_DOTS, Math.floor(Math.min(1, m) * MAX_DOTS));
          for (let d = 0; d < n; d++) {
            const [sx, sy] = ORDER[d];
            ctx.fillRect(x * CELL + sx * SUB + 1, y * CELL + sy * SUB + 1, DOT, DOT);
          }
        }
      }
      if (alive || cur !== last) raf = requestAnimationFrame(frame);
      else {
        running = false;
        prev = 0;
      }
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="cursor-trail" aria-hidden="true" />;
}
