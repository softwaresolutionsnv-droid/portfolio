import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_mouse_velocity;
uniform vec3 u_color_dark;
uniform vec3 u_color_light;
uniform float u_theme; // 0 for dark, 1 for light

varying vec2 vUv;

// Simplex 2D noise
//
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  st.x *= u_resolution.x / u_resolution.y;

  // Mouse interaction
  float mouseDist = distance(st, u_mouse);
  float mouseInfluence = smoothstep(0.5, 0.0, mouseDist) * u_mouse_velocity;

  // Fluid movement base
  vec2 noiseSt = st * 2.0;
  noiseSt.x += u_time * 0.1;
  noiseSt.y -= u_time * 0.15;
  
  float n = snoise(noiseSt + mouseInfluence * 2.0);
  float n2 = snoise(noiseSt * 2.0 - vec2(u_time * 0.2));
  
  float fluid = smoothstep(0.0, 1.0, n * 0.5 + 0.5);
  fluid += (n2 * 0.2 * mouseInfluence);

  vec3 col = mix(u_color_dark, u_color_light, fluid);
  
  gl_FragColor = vec4(col, 1.0);
}
`;

export function FluidCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Only mount if there's a container and no reduced motion
    if (!mountRef.current || reducedMotion) return;

    const container = mountRef.current;
    
    // Setup Scene
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance'
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Get brand colors. Need parsing from CSS vars, but hardcoding the essence or using theme
    const themeStr = document.documentElement.getAttribute('data-theme') || 'dark';
    const isDark = themeStr === 'dark';
    
    // We'll pass CSS colors if we can, or hardcode the brand aesthetic.
    // For figma-portfolio: dark mode is black/dark grey, accent is an oklch brown/amber/blue?
    // The accent variable is "var(--color-accent, oklch(0.65 0.22 25))" which is an orange/amber.
    const colorDark = new THREE.Color('#111111');
    const colorLight = new THREE.Color('#d95c14'); // approximated accent
    
    const uniforms = {
      u_time: { value: 0 },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_mouse_velocity: { value: 0.0 },
      u_color_dark: { value: colorDark },
      u_color_light: { value: colorLight },
      u_theme: { value: isDark ? 0.0 : 1.0 }
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthWrite: false,
      depthTest: false
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse tracking variables
    let mouse = new THREE.Vector2(0.5, 0.5);
    let targetMouse = new THREE.Vector2(0.5, 0.5);
    let velocity = 0;
    let targetVelocity = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Convert to normalized coordinates properly for aspect ratio
      const aspect = window.innerWidth / window.innerHeight;
      targetMouse.x = (e.clientX / window.innerWidth) * aspect;
      targetMouse.y = 1.0 - (e.clientY / window.innerHeight);
      
      targetVelocity = 3.0; // Bump velocity on move
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let lastTime = performance.now();
    let animationFrameId: number;

    const render = (time: number) => {
      const delta = (time - lastTime) * 0.001;
      lastTime = time;

      // Mouse easing
      mouse.lerp(targetMouse, 0.1);
      velocity += (targetVelocity - velocity) * 0.05;
      targetVelocity *= 0.9; // decay

      uniforms.u_time.value += delta;
      uniforms.u_mouse.value.copy(mouse);
      uniforms.u_mouse_velocity.value = velocity;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    // Static elegant fallback
    return (
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(circle at 50% 50%, var(--color-accent) 0%, transparent 50%)',
          filter: 'blur(100px)'
        }}
      />
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none bg-black overflow-hidden transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ zIndex: -1 }} // place it strictly behind the text
    >
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}
