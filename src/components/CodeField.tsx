import { useEffect, useRef, type RefObject } from 'react';
import { reducedMotion, ScrollTrigger } from '../lib/motion';
import CODE from '../data/codemuur.txt?raw';

/**
 * Code field — the hero's material, after ponytail.dev's hero. A wall of dim
 * code rises a row at a time: Nils's own garmin-mcp (Garmin and Hevy synced
 * into Supabase, served to Claude as MCP tools — systems being connected,
 * literally). Out of its cells a shape lights up: a pipeline (three systems
 * into one report), then his silhouette, then nothing, every cell switching
 * on its own with a scramble.
 * Canvas 2D in cached layers: the wall is redrawn only when it moves a row,
 * the lit cells and their glow only while one of them changes; a frame only
 * composites them with a few twinkling characters and a light sweep. Behind
 * the copy everything quietens (text-safe zone); the pointer never touches
 * the field. Reduced motion holds the silhouette, still.
 */

const FADE = 0.45; /* one cell's switch, s */
const SPREAD = 1.3; /* a shape's cells switch within this window, s */
const ROW_S = 0.9; /* the wall rises a row every 0.9s */
const SEQ = [0, 1, -1]; /* pipeline, silhouette, nothing: 9s, 9s, 4s */
const START = [0, 9, 18];
const TOTAL = 22;
const STILL = START[1] + SPREAD + FADE + 0.5; /* reduced motion: the silhouette, fully lit */
const GLYPHS = '01<>{}[]=+*#%$/\\|';
/* every character a lit cell can show, rendered once into an atlas: blitting a
   sprite costs a fraction of shaping text per cell */
const CHARS = [...new Set(CODE + GLYPHS + '·')];
const SLOT = new Int16Array(256).fill(-1);
CHARS.forEach((c, j) => (SLOT[c.charCodeAt(0)] = j));

/* ink: the wall barely there, lit cells held back so the headline wins (9 Oct rule) */
const WALL = 0.1;
const LIT = 0.62;
const BLOCK = 0.07; /* the faint block behind a lit character */
const CUT = 0.4; /* a cell lights when the shape covers this much of it */

/* the pipeline, in a 100-unit square: three systems feed one bus into the
   koppeling, which runs on into one report (the Weekly Report's shape:
   AdManage, AdUp and Triple Whale into one rapport) */
const PIPE = new Path2D(
  'M6 0h24v20H6z M38 0h24v20H38z M70 0h24v20H70z' + /* the systems */
    ' M16.5 20h3v10h-3z M48.5 20h3v10h-3z M80.5 20h3v10h-3z M16.5 28h67v5h-67z' + /* into one bus */
    ' M48.5 33h3v7h-3z M26 40h48v20H26z' + /* the koppeling */
    ' M48.5 60h3v12h-3z M42 71h16l-8 8z M6 80h88v20H6z', /* on into the report */
);
/* the silhouette matte: Vision person segmentation of the hero still, 305x338;
   in its pixels the crown, the chin, the head's centre and its width from the
   profile to the back of the hair */
const MATTE = { src: '/hero-silhouette.png', crown: 5, chin: 206, cx: 107, front: 8, back: 210 };

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const hash = (a: number, b: number) => {
  let h = Math.imul(a, 374761393) + Math.imul(b, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

type Shape = { on: Uint8Array; n: number; box: [number, number, number, number] };

type Props = {
  className?: string;
  /** the copy over the field: from just above its content box down, the field quietens */
  safe?: RefObject<HTMLElement | null>;
  /** the share of the current shape's cells that are lit, 0..1 */
  onSignal?: (p: number) => void;
  /** pause control (WCAG 2.2.2): freezes the field on the current frame */
  paused?: boolean;
};

export function CodeField({ className, safe, onSignal, paused = false }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const signalRef = useRef(onSignal);
  const pausedRef = useRef(paused);
  const freezeRef = useRef<(f: boolean) => void>(() => {});
  useEffect(() => {
    signalRef.current = onSignal;
  }, [onSignal]);
  useEffect(() => {
    pausedRef.current = paused;
    freezeRef.current(paused);
  }, [paused]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      signalRef.current?.(1);
      return;
    }
    const reduced = reducedMotion();
    const layer = () => document.createElement('canvas');
    const wall = layer(), lit = layer(), glow1 = layer(), glow2 = layer(), sweep = layer(), scratch = layer(), atlas = layer();
    const css = getComputedStyle(document.documentElement);
    const rgb = (v: string) => `rgb(${css.getPropertyValue(v).trim().split(/\s+/).join(',')})`;
    const INK = rgb('--c-off-white');
    const matte = new Image();

    let w = 0, h = 0, dpr = 1, cw = 7, lh = 16, cols = 0, rows = 0;
    let font = '';
    let slot = 0, ah = 0; /* atlas cell, device px */
    const PAD = 2;
    let shapes: Shape[] = [];
    let union: number[] = [];
    let safeTop = Infinity;
    let wallRow = -1;
    let dirty = true;
    let exit = 0;
    let lastSignal = -1;

    /* 0 above the copy, 1 behind it, fading in over 96px */
    const dimAt = (y: number) => clamp((y - (safeTop - 96)) / 96);
    const charAt = (x: number, y: number, row: number) => CODE[((y + row) * cols + x) % CODE.length];
    /* one character from the atlas onto cell x,y, pixel-aligned (g carries the dpr transform) */
    const blit = (g: CanvasRenderingContext2D, ch: string, x: number, y: number) =>
      g.drawImage(atlas, SLOT[ch.charCodeAt(0)] * slot, 0, slot, ah,
        (Math.round(x * cw * dpr) - PAD) / dpr, Math.round(y * lh * dpr) / dpr, slot / dpr, ah / dpr);

    /* which cells a drawing covers: draw it at full size, average each cell */
    const stencil = (draw: (g: CanvasRenderingContext2D) => void, keep?: (cx: number, cy: number) => number) => {
      const W = Math.ceil(cols * cw), H = rows * lh;
      scratch.width = W;
      scratch.height = H;
      const g = scratch.getContext('2d', { willReadFrequently: true })!;
      g.fillStyle = '#000';
      g.fillRect(0, 0, W, H);
      g.fillStyle = '#fff';
      draw(g);
      const px = g.getImageData(0, 0, W, H).data;
      const sum = new Float32Array(cols * rows);
      for (let y = 0; y < H; y++) {
        const r = Math.floor(y / lh) * cols;
        for (let x = 0; x < W; x++) {
          const v = px[(y * W + x) * 4];
          if (v) sum[r + Math.floor(x / cw)] += v;
        }
      }
      const on = new Uint8Array(cols * rows);
      for (let i = 0; i < on.length; i++) {
        if (sum[i] / (cw * lh * 255) < CUT) continue;
        const cx = (i % cols + 0.5) * cw, cy = (Math.floor(i / cols) + 0.5) * lh;
        if (!keep || hash(i, 7) < keep(cx, cy)) on[i] = 1;
      }
      return on;
    };
    const shapeOf = (on: Uint8Array): Shape => {
      let n = 0, x0 = Infinity, y0 = Infinity, x1 = 0, y1 = 0;
      on.forEach((v, i) => {
        if (!v) return;
        n++;
        const x = (i % cols) * cw, y = Math.floor(i / cols) * lh;
        x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x + cw); y1 = Math.max(y1, y + lh);
      });
      return { on, n, box: [x0, y0, x1, y1] };
    };

    const measureSafe = () => {
      const el = safe?.current;
      if (!el) return;
      const pad = parseFloat(getComputedStyle(el).paddingTop) || 0;
      safeTop = el.getBoundingClientRect().top + pad - canvas.getBoundingClientRect().top - 16;
      wallRow = -1;
      dirty = true;
    };

    const layout = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      if (!w || !h || !matte.naturalWidth) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      for (const c of [canvas, wall, lit]) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      glow1.width = Math.ceil(canvas.width / 4);
      glow1.height = Math.ceil(canvas.height / 4);
      glow2.width = Math.ceil(glow1.width / 2);
      glow2.height = Math.ceil(glow1.height / 2);
      const narrow = w < 640;
      const fs = narrow ? 11 : 12;
      lh = Math.round(fs * 1.32);
      font = `400 ${fs}px "Sometype Mono", ui-monospace, monospace`;
      ctx.font = font;
      cw = ctx.measureText('M').width;
      cols = Math.ceil(w / cw);
      rows = Math.ceil(h / lh);
      slot = Math.ceil(cw * dpr) + 2 * PAD;
      ah = Math.ceil(lh * dpr);
      atlas.width = slot * CHARS.length;
      atlas.height = ah;
      const a = atlas.getContext('2d')!;
      a.font = `500 ${fs * dpr}px "Sometype Mono", ui-monospace, monospace`;
      a.textBaseline = 'middle';
      a.fillStyle = INK;
      CHARS.forEach((c, j) => a.fillText(c, j * slot + PAD, ah / 2));

      /* placement: the bust runs 75% of the hero tall from just under the nav,
         the head right of centre (centred on phones) looking at the headline,
         never wider than 82% of the screen and never past its right edge; the
         pipeline stands as tall as the head, on the same spot */
      const k = Math.min((h * 0.75) / (matte.naturalHeight - MATTE.crown), (w * 0.82) / (MATTE.back - MATTE.front));
      const hx = Math.min((narrow ? 0.5 : 0.76) * w, w - 16 - (MATTE.back - MATTE.cx) * k);
      const top = 76;
      const mx = hx - MATTE.cx * k, my = top - MATTE.crown * k;
      const mw = matte.naturalWidth * k, mh = matte.naturalHeight * k;
      const headH = (MATTE.chin - MATTE.crown) * k;
      const u = headH / 100;
      shapes = [
        shapeOf(
          stencil((g) => {
            g.setTransform(u, 0, 0, u, hx - 50 * u, top);
            g.fill(PIPE);
          }),
        ),
        /* the still's frame cuts the bust at its foot and right shoulder: those
           edges dissolve cell by cell instead of ending on a straight line */
        shapeOf(
          stencil(
            (g) => g.drawImage(matte, mx, my, mw, mh),
            (cx, cy) => Math.min(1, (my + mh - cy) / (mh * 0.22), (mx + mw - cx) / (mw * 0.12)),
          ),
        ),
      ];
      union = [];
      for (let i = 0; i < cols * rows; i++) if (shapes.some((s) => s.on[i])) union.push(i);
      measureSafe();
    };

    const drawWall = (row: number) => {
      const g = wall.getContext('2d')!;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      g.font = font;
      g.textBaseline = 'middle';
      g.fillStyle = INK;
      for (let y = 0; y < rows; y++) {
        const at = ((y + row) * cols) % CODE.length;
        let line = CODE.slice(at, at + cols);
        if (line.length < cols) line += CODE.slice(0, cols - line.length);
        g.globalAlpha = WALL * (1 - 0.5 * dimAt((y + 0.5) * lh));
        g.fillText(line, 0, (y + 0.5) * lh);
      }
      wallRow = row;
    };

    /* where t falls in the loop: lt = time into it, k = the shape on now */
    const phase = (t: number) => {
      const lt = ((t % TOTAL) + TOTAL) % TOTAL;
      let k = 0;
      while (k + 1 < SEQ.length && lt >= START[k + 1]) k++;
      return { lt, k };
    };

    /* the lit cells at time t; returns the share of the current shape that is lit */
    const drawLit = (t: number, row: number, lt: number, k: number) => {
      const cur = shapes[SEQ[k]], prev = shapes[SEQ[(k + SEQ.length - 1) % SEQ.length]];
      const g = lit.getContext('2d')!;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      g.fillStyle = INK;
      let sumCur = 0, sumPrev = 0;
      for (const i of union) {
        const a = prev?.on[i] ?? 0, b = cur?.on[i] ?? 0;
        if (!a && !b) continue;
        const sw = START[k] + hash(i, k) * SPREAD;
        const p = clamp((lt - sw) / FADE);
        const out = 1 - clamp((exit - (0.05 + hash(i, 5) * 0.5)) / 0.1);
        const v = (a + (b - a) * p) * out;
        if (b) sumCur += v;
        if (a) sumPrev += v;
        const scramble = (a !== b && lt > sw - 0.25 && lt < sw + FADE) || (out > 0 && out < 1);
        if (v <= 0.01 && !scramble) continue;
        const x = i % cols, y = Math.floor(i / cols);
        const dim = 1 - 0.55 * dimAt((y + 0.5) * lh);
        g.globalAlpha = v * BLOCK * dim;
        g.fillRect(x * cw, y * lh, cw + 0.5, lh + 0.5);
        g.globalAlpha = Math.max(v, scramble ? 0.5 : 0) * LIT * dim;
        const ch = scramble ? GLYPHS[Math.floor(hash(i, Math.floor(t * 18)) * GLYPHS.length)] : charAt(x, y, row);
        blit(g, ch === ' ' ? '·' : ch, x, y);
      }
      /* glow: the lit layer shrunk twice and stretched back, so it blooms in its own colour */
      for (const [src, dst] of [[lit, glow1], [glow1, glow2]]) {
        const gg = dst.getContext('2d')!;
        gg.imageSmoothingQuality = 'high';
        gg.clearRect(0, 0, dst.width, dst.height);
        gg.drawImage(src, 0, 0, dst.width, dst.height);
      }
      return { share: cur ? sumCur / cur.n : prev ? sumPrev / prev.n : 0, cur };
    };

    const compose = (t: number, row: number, cur?: Shape) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(wall, 0, 0, w, h);
      if (!reduced) {
        /* a few characters of the wall flare up, each on its own clock */
        for (let s = 0; s < 40; s++) {
          const tk = t * 0.7 + hash(s, 9);
          const i = Math.floor(hash(s, Math.floor(tk)) * cols * rows), x = i % cols, y = Math.floor(i / cols);
          ctx.globalAlpha = Math.max(0, Math.sin((tk - Math.floor(tk)) * Math.PI)) * 0.5 * (1 - 0.8 * dimAt((y + 0.5) * lh));
          blit(ctx, charAt(x, y, row), x, y);
        }
      }
      ctx.globalAlpha = 0.9;
      ctx.drawImage(glow2, 0, 0, w, h);
      ctx.globalAlpha = 0.6;
      ctx.drawImage(glow1, 0, 0, w, h);
      ctx.globalAlpha = 1;
      ctx.drawImage(lit, 0, 0, w, h);

      /* a soft band of light crosses the shape every ~14.5s */
      const ph = ((t * 0.11) % 1.6) - 0.3;
      if (reduced || !cur || ph < -0.15 || ph > 1.15) return;
      const [x0, y0, x1, y1] = cur.box;
      const bw = x1 - x0, bh = y1 - y0;
      const sw = Math.ceil(bw * dpr), sh = Math.ceil(bh * dpr);
      if (sweep.width !== sw || sweep.height !== sh) {
        sweep.width = sw;
        sweep.height = sh;
      }
      const g = sweep.getContext('2d')!;
      g.globalCompositeOperation = 'source-over';
      g.clearRect(0, 0, sw, sh);
      g.drawImage(lit, x0 * dpr, y0 * dpr, sw, sh, 0, 0, sw, sh);
      const cx = sw * ph, d = sw * 0.14;
      const band = g.createLinearGradient(cx - d, sh * 0.3, cx + d, 0);
      band.addColorStop(0, 'rgba(0,0,0,0)');
      band.addColorStop(0.5, 'rgba(0,0,0,1)');
      band.addColorStop(1, 'rgba(0,0,0,0)');
      g.globalCompositeOperation = 'destination-in';
      g.fillStyle = band;
      g.fillRect(0, 0, sw, sh);
      /* the sweep adds light, so it stays out of the text-safe zone (the 11px eyebrow keeps 4.5:1) */
      const fade = g.createLinearGradient(0, (safeTop - 96 - y0) * dpr, 0, (safeTop - 16 - y0) * dpr);
      fade.addColorStop(0, 'rgba(0,0,0,1)');
      fade.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = fade;
      g.fillRect(0, 0, sw, sh);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.55;
      ctx.drawImage(sweep, x0, y0, bw, bh);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    };

    /* the clock: frozen by the pause control (and for good under reduced motion) */
    let t0 = performance.now() + 250;
    let tFrozen = reduced ? STILL : 0;
    let frozen = reduced || pausedRef.current;
    const now = () => (frozen ? tFrozen : (performance.now() - t0) / 1000);
    freezeRef.current = (f: boolean) => {
      if (reduced || f === frozen) return;
      if (f) tFrozen = now();
      else t0 = performance.now() - tFrozen * 1000;
      frozen = f;
      dirty = true;
    };

    let ready = false;
    let visible = true;
    let raf = 0;
    let last = 0;
    let state: ReturnType<typeof drawLit> | null = null;
    const frame = (ms: number) => {
      raf = requestAnimationFrame(frame);
      if (!ready || !visible || ms - last < 32) return;
      if (frozen && !dirty) return;
      last = ms;
      const t = now();
      const row = reduced ? 0 : Math.floor(Math.max(0, t) / ROW_S);
      const moved = row !== wallRow;
      if (moved) drawWall(row);
      /* the lit layer only changes when the wall moves a row, during a switch, or on a scroll or resize */
      const { lt, k } = phase(t);
      if (moved || dirty || !state || lt - START[k] < SPREAD + FADE + 0.05) state = drawLit(t, row, lt, k);
      dirty = false;
      compose(t, row, state.cur);
      if (Math.abs(state.share - lastSignal) > 0.004) {
        lastSignal = state.share;
        signalRef.current?.(reduced ? 1 : state.share);
      }
    };

    const ro = new ResizeObserver(() => {
      if (canvas.clientWidth === w && canvas.clientHeight === h) return;
      layout();
      wallRow = -1;
      dirty = true;
    });
    const zro = new ResizeObserver(measureSafe);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    /* exit: the shape falls back into the wall as the hero scrolls away */
    const exitST = reduced
      ? null
      : ScrollTrigger.create({
          trigger: canvas,
          start: 'top top',
          end: 'bottom top',
          onUpdate: (self) => {
            exit = self.progress;
            dirty = true;
          },
        });

    let cancelled = false;
    matte.src = MATTE.src;
    Promise.all([
      matte.decode(),
      document.fonts.load(`400 12px "Sometype Mono"`),
      document.fonts.load(`500 12px "Sometype Mono"`),
    ])
      .then(() => {
        if (cancelled) return;
        t0 = performance.now() + 250; /* the intro starts once the wall can be set */
        layout();
        ro.observe(canvas);
        if (safe?.current) zro.observe(safe.current);
        io.observe(canvas);
        ready = true;
        raf = requestAnimationFrame(frame);
      })
      .catch(() => signalRef.current?.(1)); /* no field: the hero keeps its dark ground and the copy */

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      exitST?.kill();
      ro.disconnect();
      zro.disconnect();
      io.disconnect();
      freezeRef.current = () => {};
    };
  }, [safe]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
