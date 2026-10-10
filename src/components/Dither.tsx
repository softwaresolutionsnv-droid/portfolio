import { Component, useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { Mesh, Program, Renderer, RenderTarget, Texture, Triangle } from 'ogl';
import { gsap, reducedMotion, ScrollTrigger } from '../lib/motion';

/**
 * Dither field — the hero's material. Two passes: a cell pass (one fragment
 * per 6px cell) turns the luminance of a looping <video> (poster still
 * until it plays) into a glyph level; a glyph pass stamps the 3x5 bitmaps
 * at full resolution. Everything that varies per cell — placement,
 * texture fetch, contour — runs ~40x
 * fewer times than a per-fragment shader would. Renders at 30fps, only while
 * visible and only while something changed; freezes on the poster
 * under reduced motion. The portrait stays below the headline: small, dimmed,
 * and the pointer never touches it.
 */

const VERT = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

/* pass 1: one fragment per cell → r = glyph level / 6 */
const CELL_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform vec2 uCells;
uniform float uCell;
uniform sampler2D uTex;
uniform float uTexAspect;
uniform vec2 uAnchor;
uniform vec3 uPlace;
uniform vec2 uSafe; /* x: top of the text zone, 0..1 from the bottom; y: fade above it */
uniform float uTime;
uniform float uReveal; /* 0 = pure static, 1 = signal locked */
uniform float uExit;   /* 0..1 while the hero scrolls away: the field drops resolution */

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

void main(){
  vec2 cell = floor(vUv * uCells);
  /* exit: neighbouring cells share one sample, so the image coarsens in steps
     while the glyphs themselves stay 6px — the signal losing resolution */
  float block = 1.0 + floor(uExit * uExit * 7.0);
  vec2 scell = floor(cell / block) * block;
  vec2 cuv = scell * uCell / uRes;          /* sample origin in 0..1 */
  vec2 aspect = vec2(uRes.x / uRes.y, 1.0);
  vec2 suv = cuv;

  /* placement: the head is set where the layout wants it, not where a
     cover-fit happens to put it — uPlace.xy is the screen spot (y from the
     bottom) for the source's head centre uAnchor, uPlace.z the scale in
     source heights per viewport height. Beyond the source the field is empty. */
  vec2 sc = vec2(uPlace.z * aspect.x / uTexAspect, uPlace.z);
  vec2 tuv = uAnchor + (suv - uPlace.xy) * sc;
  float lum = texture2D(uTex, tuv).r; /* OGL flips Y on upload */

  /* contour: unsharp mask at two cells' reach */
  vec2 d = 2.0 * uCell / uRes * sc;
  float avg = (texture2D(uTex, tuv + vec2(d.x, 0.0)).r + texture2D(uTex, tuv - vec2(d.x, 0.0)).r
             + texture2D(uTex, tuv + vec2(0.0, d.y)).r + texture2D(uTex, tuv - vec2(0.0, d.y)).r) * 0.25;
  lum = clamp(lum + (lum - avg) * 1.2, 0.0, 1.0);

  /* tone: the source is graded for this field (subject lifted, fog held
     low, a rim on the silhouette); a soft curve only opens the top */
  lum = smoothstep(0.03, 0.9, lum);

  /* the source's own edges dissolve instead of cutting */
  lum *= smoothstep(0.0, 0.14, tuv.x) * smoothstep(1.0, 0.9, tuv.x)
       * smoothstep(0.0, 0.12, tuv.y) * smoothstep(1.0, 0.985, tuv.y);

  /* focus: the field falls off away from the head */
  vec2 hd = (suv - uPlace.xy) * aspect;
  lum *= mix(0.6, 1.0, exp(-dot(hd, hd) * 2.0));
  /* far from the head the source's own fog is cut off at the frame edge and
     reads as a hard block; the rest-ruis below owns that ground instead */
  lum *= 1.0 - smoothstep(0.32, 0.5, length(hd * vec2(1.0, 0.8)));

  /* rest-ruis: once the signal locks the carrier stays — a sparse drift of
     the two lowest glyphs across the field, patchy like mist, kept off the
     head and thinned behind the copy. Two octaves of value noise per cell,
     drifting against each other so the patches change shape as they travel;
     each cell re-rolls its glyph every ~1.4s (staggered), so the mist simmers. */
  float n0 = hash(cell + 3.7);
  vec2 fp = suv * aspect * 2.6;
  float fog = smoothstep(0.38, 0.8,
      vnoise(fp + vec2(uTime * 0.045, uTime * 0.018)) * 0.65
    + vnoise(fp * 2.3 + 7.1 - vec2(uTime * 0.03, -uTime * 0.04)) * 0.35);
  float away = smoothstep(0.14, 0.32, length(hd * vec2(1.0, 0.8)));
  float safe0 = 1.0 - smoothstep(uSafe.x, uSafe.x + uSafe.y, cuv.y);
  float odds = fog * 0.5 * away * (1.0 - safe0 * 0.7);
  float roll = floor(uTime * 0.7 + n0 * 4.0);
  float carrier = step(hash(cell + 17.0 + roll), odds) * (fog > 0.75 ? 2.2 : 1.2) / 6.0;
  lum = max(lum, carrier);

  /* text-safe zone: behind the copy the field quietens. (The pointer's
     light lives in the site-wide CursorTrail; the field ignores it.) */
  float safe = safe0;
  lum *= 1.0 - safe * 0.5;

  /* acquire: a scan front runs top → bottom with a ragged per-cell edge;
     ahead of it the field is flickering static, on it a bright line, behind
     it the signal */
  float n = hash(cell);
  float front = uReveal * 1.12 - 0.08;
  float scan = 0.0; /* g channel: the scan line keeps full ink in the glyph pass */
  float t = (1.0 - cuv.y) * 0.92 + n * 0.08;
  if (t > front) {
    float st = hash(cell + floor(uTime * 14.0));
    lum = st * st * 0.8 * (1.0 - safe * 0.25);
  } else if (front - t < 0.018) {
    lum = 1.0; /* the scan line itself */
    scan = 1.0;
  }

  /* exit: the field dims as it coarsens */
  lum *= 1.0 - uExit * 0.55;

  /* quantise luminance into one of seven glyph levels */
  gl_FragColor = vec4(floor(lum * 6.0 + 0.5) / 6.0, scan, 0.0, 1.0);
}`;

/* pass 2: stamp the cell's glyph at full resolution */
const GLYPH_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform vec2 uCells;
uniform float uCell;
uniform vec3 uInk;
uniform vec3 uBg;
uniform sampler2D uField;

/* 3x5 glyph bitmaps, one bit per pixel, row-major. Density climbs
   1 · 2 · 5 · 8 · 11 · 15 pixels: . : + o ‡ █ */
float glyph(int level, ivec2 px){
  int idx = px.y * 3 + px.x;
  int bits = 0;
  if (level == 1) bits = 4096;                          /* .  */
  else if (level == 2) bits = 4096 + 16;                /* :  */
  else if (level == 3) bits = 16 + 64 + 128 + 256 + 1024; /* +  */
  else if (level == 4) bits = 3960;                     /* o  ring */
  else if (level == 5) bits = 7 + 16 + 448 + 1024 + 28672; /* ‡ bars */
  else if (level >= 6) bits = 32767;                    /* full block */
  /* integer bit test without bitwise ops (GLSL ES 1.0) */
  float f = floor(float(bits) / pow(2.0, float(idx)));
  return mod(f, 2.0);
}

void main(){
  vec2 frag = vUv * uRes;
  vec2 cell = floor(frag / uCell);
  vec2 field = texture2D(uField, (cell + 0.5) / uCells).rg;
  int q = int(floor(field.r * 6.0 + 0.5));
  ivec2 px = ivec2(floor(mod(frag, uCell) / uCell * vec2(3.0, 5.0)));
  float on = glyph(q, px);

  /* faint colour drift so the field is not pure grey */
  float cx = cell.x * uCell / uRes.x;
  vec3 tint = mix(vec3(0.62, 0.72, 0.85), vec3(0.95, 0.78, 0.55), cx);
  vec3 inkc = mix(uInk, uInk * tint, 0.45);

  /* brighter glyphs also burn brighter: the lit planes of the face read first.
     The portrait is a supporting voice: all seven glyph shapes stay (that is
     the likeness), only the ink is held back; the scan line keeps full ink. */
  float glow = (0.34 + field.r * 0.36) * mix(0.62, 1.0, field.g);
  gl_FragColor = vec4(mix(uBg, inkc, on * glow), 1.0);
}`;

/** Where the head sits in the source (hero-signal.mp4, 0..1, y from the bottom):
    its centre and its height from chin to the top of the hair. */
const HEAD = { centre: [0.69, 0.65], height: 0.545 };

type Props = {
  src: string;
  poster: string;
  className?: string;
  /** the copy over the field: from just above its content box down, the field quietens */
  safe?: RefObject<HTMLElement | null>;
  /** the acquire intro: called with 0..1 as the static resolves into the portrait */
  onSignal?: (p: number) => void;
  /** pause control (WCAG 2.2.2): stops the video and freezes the field */
  paused?: boolean;
};

/**
 * The field is decoration over a complete page: if it cannot run (no WebGL —
 * Lockdown Mode, a blocklisted GPU, some remote desktops — or any other
 * failure) the hero keeps its dark ground and the copy, never a blank page.
 */
class FieldBoundary extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function Dither(props: Props) {
  return (
    <FieldBoundary onFail={() => props.onSignal?.(1)}>
      <DitherField {...props} />
    </FieldBoundary>
  );
}

function DitherField({ src, poster, className, safe, onSignal, paused = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pausedRef = useRef(paused);
  const signalRef = useRef(onSignal);
  useEffect(() => {
    signalRef.current = onSignal;
  }, [onSignal]);
  const visibleRef = useRef(true);

  /* pause/play without rebuilding the GL context */
  useEffect(() => {
    pausedRef.current = paused;
    const v = videoRef.current;
    if (!v || reducedMotion()) return;
    if (paused) v.pause();
    else if (visibleRef.current) v.play().catch(() => {});
  }, [paused]);

  useEffect(() => {
    const host = ref.current;
    const video = videoRef.current;
    if (!host || !video) return;
    const reduced = reducedMotion();
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    let renderer: Renderer;
    try {
      renderer = new Renderer({ dpr, alpha: false, antialias: false, depth: false });
    } catch {
      /* no WebGL context: the hero stays on its dark ground, the readout settles */
      signalRef.current?.(1);
      return;
    }
    const gl = renderer.gl;
    host.appendChild(gl.canvas);
    gl.canvas.className = 'dither';

    const css = getComputedStyle(document.documentElement);
    const rgb = (v: string) => v.trim().split(/\s+/).map((n) => Number(n) / 255) as [number, number, number];

    const texture = new Texture(gl, { generateMipmaps: false });
    const cellPass = new Program(gl, {
      vertex: VERT,
      fragment: CELL_FRAG,
      uniforms: {
        uRes: { value: [1, 1] },
        uCells: { value: [1, 1] },
        uCell: { value: 6 * dpr },
        uTex: { value: texture },
        uTexAspect: { value: 16 / 9 },
        uAnchor: { value: HEAD.centre }, /* the head's centre in the source, y from the bottom */
        uPlace: { value: [0.68, 0.7, 1.4] }, /* set by zone() from the layout */
        uSafe: { value: [-1, 0.1] }, /* no zone until `safe` is measured */
        uTime: { value: 0 },
        uReveal: { value: reduced ? 1 : 0 },
        uExit: { value: 0 },
      },
    });
    const glyphPass = new Program(gl, {
      vertex: VERT,
      fragment: GLYPH_FRAG,
      uniforms: {
        uRes: cellPass.uniforms.uRes,
        uCells: cellPass.uniforms.uCells,
        uCell: cellPass.uniforms.uCell,
        uInk: { value: rgb(css.getPropertyValue('--c-off-white')) },
        uBg: { value: rgb(css.getPropertyValue('--c-dark')) },
        uField: { value: texture }, /* replaced by the cell target on resize */
      },
    });
    const geometry = new Triangle(gl);
    const cellMesh = new Mesh(gl, { geometry, program: cellPass });
    const glyphMesh = new Mesh(gl, { geometry, program: glyphPass });

    let dirty = false;
    /* the text zone starts just above the `safe` element's content box (its
       tallest column, whatever the layout) and fades out over ~100px */
    const zone = () => {
      const hr = host.getBoundingClientRect();
      const el = safe?.current;
      let top = 0.62;
      if (el) {
        const pad = parseFloat(getComputedStyle(el).paddingTop) || 0;
        top = 1 - (el.getBoundingClientRect().top + pad - hr.top - 16) / hr.height;
        cellPass.uniforms.uSafe.value = [top, 96 / hr.height];
      }
      /* the head stands on the copy: chin just inside the text zone, open
         air above; at most 42% of the viewport (26% narrow), at least 20%, and
         the crown never above 95% (90% narrow) so the nav keeps clear ground;
         short screens pin the crown there and let the chin run behind the
         eyebrow */
      const narrow = hr.width < 640;
      const crown = narrow ? 0.9 : 0.95;
      const h = Math.min(narrow ? 0.26 : 0.42, Math.max(0.2, crown - (top - 0.05)));
      const chin = Math.min(top - 0.05, crown - h);
      cellPass.uniforms.uPlace.value = [
        narrow ? 0.62 : 0.76,
        chin + h / 2,
        HEAD.height / h,
      ];
      dirty = true;
    };

    let field: RenderTarget | null = null;
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      renderer.setSize(w, h);
      const cell = (w < 640 ? 5 : 6) * dpr;
      const cells = [Math.ceil(gl.canvas.width / cell), Math.ceil(gl.canvas.height / cell)];
      cellPass.uniforms.uRes.value = [gl.canvas.width, gl.canvas.height];
      cellPass.uniforms.uCell.value = cell;
      cellPass.uniforms.uCells.value = cells;
      if (field) {
        gl.deleteFramebuffer(field.buffer);
        gl.deleteTexture(field.texture.texture);
      }
      field = new RenderTarget(gl, { width: cells[0], height: cells[1], depth: false, minFilter: gl.NEAREST });
      glyphPass.uniforms.uField.value = field.texture;
      zone();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    /* copy reflows on font load and on the NL/EN switch */
    const zro = new ResizeObserver(zone);
    if (safe?.current) zro.observe(safe.current);

    /* poster first; the video takes over frame by frame once it plays */
    const img = new Image();
    img.onload = () => {
      if (texture.image === video) return;
      texture.image = img;
      cellPass.uniforms.uTexAspect.value = img.naturalWidth / img.naturalHeight;
      dirty = true;
    };
    img.src = poster;
    /* requestVideoFrameCallback uploads only real new frames; where it is missing
       the field re-uploads on its own 30fps tick while the video plays */
    const rvfc = typeof video.requestVideoFrameCallback === 'function';
    const takeVideo = () => {
      texture.image = video;
      cellPass.uniforms.uTexAspect.value = video.videoWidth / video.videoHeight;
      dirty = true;
    };
    const onFrame = () => {
      takeVideo();
      video.requestVideoFrameCallback(onFrame);
    };
    if (!reduced) {
      if (rvfc) video.requestVideoFrameCallback(onFrame);
      else video.addEventListener('playing', takeVideo, { once: true });
      if (!pausedRef.current) video.play().catch(() => {}); /* iOS Low Power Mode refuses: the poster stays */
    }

    /* acquire: once the poster is in, the static resolves into the portrait */
    const acquire = { p: reduced ? 1 : 0 };
    let acquiring = !reduced;
    const acquireTween = reduced
      ? null
      : gsap.to(acquire, {
          p: 1,
          duration: 2.1,
          delay: 0.25,
          ease: 'power2.inOut',
          paused: true,
          onUpdate: () => {
            cellPass.uniforms.uReveal.value = acquire.p;
            signalRef.current?.(acquire.p);
            dirty = true;
          },
          onComplete: () => {
            acquiring = false;
            signalRef.current?.(1);
          },
        });
    if (reduced) signalRef.current?.(1);
    const startAcquire = () => acquireTween?.play();
    if (img.complete && img.naturalWidth) startAcquire();
    else img.addEventListener('load', startAcquire, { once: true });

    /* exit: the field coarsens and dims as the hero scrolls away */
    const exitST = reduced
      ? null
      : ScrollTrigger.create({
          trigger: host,
          start: 'top top',
          end: 'bottom top',
          onUpdate: (self) => {
            cellPass.uniforms.uExit.value = self.progress;
            dirty = true;
          },
        });

    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      visibleRef.current = visible;
      if (reduced) return;
      if (visible && !pausedRef.current) video.play().catch(() => {});
      else video.pause();
    });
    io.observe(host);

    let raf = 0;
    let last = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      /* 30fps is plenty for the video */
      if (now - last < 32) return;
      last = now;
      cellPass.uniforms.uTime.value = now / 1000;
      if (acquiring) dirty = true; /* the static flickers until the signal locks */
      if (!rvfc && texture.image === video && !video.paused) dirty = true;
      if (!dirty) return; /* no new frame: keep the last image */
      texture.needsUpdate = true;
      dirty = false;
      renderer.render({ scene: cellMesh, target: field! });
      renderer.render({ scene: glyphMesh });
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      acquireTween?.kill();
      exitST?.kill();
      ro.disconnect();
      zro.disconnect();
      io.disconnect();
      video.pause();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      gl.canvas.remove();
    };
  }, [src, poster, safe]);

  return (
    <div ref={ref} className={className} aria-hidden="true">
      <video ref={videoRef} src={src} poster={poster} muted playsInline loop preload="auto" className="dither-src" />
    </div>
  );
}
