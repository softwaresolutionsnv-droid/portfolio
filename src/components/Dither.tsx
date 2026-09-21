import { useEffect, useRef } from 'react';
import { Mesh, Program, Renderer, Texture, Triangle } from 'ogl';
import { reducedMotion } from '../lib/motion';

/**
 * Dither field — the hero's material. A fullscreen fragment shader turns
 * a luminance source (a drifting noise field, or a <video> when given)
 * into a grid of mono glyphs, with soft dark blobs punched through it.
 * Renders only while visible; freezes under reduced motion.
 */

const VERT = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uCell;
uniform vec3 uInk;
uniform vec3 uBg;
uniform sampler2D uTex;
uniform float uHasTex;
uniform vec2 uTrail[12];

vec2 hash2(vec2 p){ p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return -1.0 + 2.0 * fract(sin(p) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(hash2(i), f), dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
             mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.02 + 17.3; a *= 0.5; }
  return v;
}

/* 3x5 glyph bitmaps, one bit per pixel, row-major from the top. */
float glyph(int level, ivec2 px){
  int idx = px.y * 3 + px.x;
  int bits = 0;
  if (level == 1) bits = 4096;                 /* .  : bottom-centre */
  else if (level == 2) bits = 4096 + 16;       /* :  */
  else if (level == 3) bits = 2 + 16 + 128 + 1024 + 8192; /* |  centre column */
  else if (level == 4) bits = 7 + 16 + 448 + 1024 + 28672; /* ‡ bars */
  else if (level >= 5) bits = 32767;           /* full block */
  int bit = idx;
  /* integer bit test without bitwise ops (GLSL ES 1.0) */
  float f = floor(float(bits) / pow(2.0, float(bit)));
  return mod(f, 2.0);
}

void main(){
  vec2 frag = vUv * uRes;
  vec2 cell = floor(frag / uCell);
  vec2 cuv = cell * uCell / uRes;           /* cell origin in 0..1 */
  vec2 aspect = vec2(uRes.x / uRes.y, 1.0);
  vec2 p = cuv * aspect;

  /* mouse push: a soft lens */
  vec2 m = uMouse * aspect;
  float md = length(p - m);
  p += (p - m) * 0.06 * exp(-md * md * 6.0);

  float t = uTime * 0.045;
  float lum;
  if (uHasTex > 0.5) {
    vec3 c = texture2D(uTex, vec2(cuv.x, 1.0 - cuv.y)).rgb;
    lum = dot(c, vec3(0.299, 0.587, 0.114));
  } else {
    float n1 = fbm(p * 1.6 + vec2(t, -t * 0.7));
    float n2 = fbm(p * 3.1 - vec2(t * 0.5, t * 0.9) + 4.0);
    lum = smoothstep(-0.35, 0.35, n1 * 0.7 + n2 * 0.5);
  }

  /* organic worms (lamalama's labyrinth): contour bands of a domain-warped
     noise field, punched out of the glyph field as dark holes */
  vec2 wq = vec2(fbm(p * 0.7 + vec2(t * 0.8, -t * 0.5)), fbm(p * 0.7 + vec2(5.2, 1.3) - t * 0.6));
  float w = fbm(p * 2.0 + 1.3 * wq + 7.0);

  /* cursor ink: the pointer and its trail push the worms open and light the field */
  float ink = exp(-md * md * 28.0);
  for (int i = 0; i < 12; i++) {
    vec2 tp = uTrail[i] * aspect;
    float d = length(p - tp);
    ink += exp(-d * d * (36.0 + float(i) * 10.0)) * (1.0 - float(i) / 12.0) * 0.6;
  }
  ink = min(ink, 1.0);
  w += ink * 0.22;
  float c = abs(fract(w * 2.5 + 0.5) - 0.5) / 2.5;   /* distance to nearest contour */
  float worm = 1.0 - smoothstep(0.03, 0.05, c);
  float blob = 1.0 - worm;
  float edge = (smoothstep(0.05, 0.07, c) - smoothstep(0.07, 0.09, c)) * 0.5;
  lum = min(1.0, lum + ink * 0.35);

  /* quantise luminance into a glyph level */
  float q = floor(lum * 5.0 + 0.5);
  ivec2 px = ivec2(floor(mod(frag, uCell) / uCell * vec2(3.0, 5.0)));
  float on = glyph(int(q), px);

  /* faint colour drift so the field is not pure grey */
  vec3 tint = mix(vec3(0.62, 0.72, 0.85), vec3(0.95, 0.78, 0.55), smoothstep(0.2, 0.8, fbm(p * 0.7 + 30.0)));
  vec3 inkc = mix(uInk, uInk * tint, 0.45);

  vec3 field = mix(uBg, inkc, on * (0.42 + ink * 0.4));
  vec3 hole = mix(uBg * 0.6, inkc, on * 0.05);
  vec3 col = mix(hole, field, blob);
  col = mix(col, inkc, edge * 0.06);

  gl_FragColor = vec4(col, 1.0);
}`;

type Props = { video?: HTMLVideoElement | null; className?: string };

export function Dither({ video, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const reduced = reducedMotion();
    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 1.5), alpha: false, antialias: false });
    const gl = renderer.gl;
    host.appendChild(gl.canvas);
    gl.canvas.className = 'dither';

    const css = getComputedStyle(document.documentElement);
    const rgb = (v: string) => v.trim().split(/\s+/).map((n) => Number(n) / 255) as [number, number, number];
    const ink = rgb(css.getPropertyValue('--c-off-white'));
    const bg = rgb(css.getPropertyValue('--c-dark'));

    const texture = new Texture(gl, { generateMipmaps: false });
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uRes: { value: [1, 1] },
        uTime: { value: 0 },
        uMouse: { value: [-2, -2] },
        uCell: { value: 6 * Math.min(window.devicePixelRatio, 1.5) },
        uInk: { value: ink },
        uBg: { value: bg },
        uTex: { value: texture },
        uHasTex: { value: 0 },
        uTrail: { value: new Float32Array(24).fill(-2) },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      renderer.setSize(w, h);
      program.uniforms.uRes.value = [gl.canvas.width, gl.canvas.height];
      program.uniforms.uCell.value = (w < 640 ? 5 : 6) * Math.min(window.devicePixelRatio, 1.5);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const target = [-2, -2]; /* off-field until the pointer arrives; touch never lights the field */
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      target[0] = (e.clientX - r.left) / r.width;
      target[1] = 1 - (e.clientY - r.top) / r.height;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(host);

    let raf = 0;
    let tick = 0;
    const start = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const u = program.uniforms;
      u.uTime.value = reduced ? 12 : (now - start) / 1000;
      const m = u.uMouse.value as number[];
      m[0] += (target[0] - m[0]) * 0.06;
      m[1] += (target[1] - m[1]) * 0.06;
      /* trail: shift the ring every few frames so the ink smears behind the pointer */
      if (++tick % 3 === 0) {
        const tr = u.uTrail.value as Float32Array;
        tr.copyWithin(2, 0, 22);
        tr[0] = m[0];
        tr[1] = m[1];
      }
      if (video && video.readyState >= 2) {
        texture.image = video;
        texture.needsUpdate = true;
        u.uHasTex.value = 1;
      }
      renderer.render({ scene: mesh });
      if (reduced && !video) cancelAnimationFrame(raf);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      gl.canvas.remove();
    };
  }, [video]);

  return <div ref={ref} className={className} aria-hidden="true" />;
}
