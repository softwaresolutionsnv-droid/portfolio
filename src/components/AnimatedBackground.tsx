import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useEffect } from 'react';

export function AnimatedBackground() {
  const { scrollYProgress } = useScroll();

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    mass: 0.5,
  });

  // Scroll-driven orb transforms — brand colors only
  const orb1X = useTransform(smoothScroll, [0, 0.5, 1], [0, 140, -80]);
  const orb1Y = useTransform(smoothScroll, [0, 0.5, 1], [0, -120, -240]);
  const orb1Scale = useTransform(smoothScroll, [0, 0.4, 1], [1, 1.25, 0.9]);
  const orb1Opacity = useTransform(smoothScroll, [0, 0.3, 1], [1, 0.85, 0.5]);

  const orb2X = useTransform(smoothScroll, [0, 0.5, 1], [0, -180, 60]);
  const orb2Y = useTransform(smoothScroll, [0, 0.5, 1], [0, 140, 80]);
  const orb2Scale = useTransform(smoothScroll, [0, 0.4, 1], [1, 0.8, 1.15]);
  const orb2Opacity = useTransform(smoothScroll, [0, 0.4, 1], [0.9, 1, 0.4]);

  // Grid parallax
  const gridY = useTransform(smoothScroll, [0, 1], [0, -160]);
  const gridRotate = useTransform(smoothScroll, [0, 1], [0, 2]);
  const gridOpacity = useTransform(smoothScroll, [0, 0.3, 1], [0.04, 0.055, 0.02]);

  // Fade out as user scrolls past hero
  const containerOpacity = useTransform(scrollYProgress, [0, 0.12, 0.2], [1, 0.4, 0]);

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX - window.innerWidth / 2) / window.innerWidth);
      mouseY.set((e.clientY - window.innerHeight / 2) / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Combine scroll + mouse into final positions
  const orb1FinalX = useTransform(
    [orb1X, smoothMouseX] as const,
    ([scroll, mouse]) => (scroll as number) + (mouse as number) * 50,
  );
  const orb1FinalY = useTransform(
    [orb1Y, smoothMouseY] as const,
    ([scroll, mouse]) => (scroll as number) + (mouse as number) * 35,
  );
  const orb2FinalX = useTransform(
    [orb2X, smoothMouseX] as const,
    ([scroll, mouse]) => (scroll as number) + (mouse as number) * -60,
  );
  const orb2FinalY = useTransform(
    [orb2Y, smoothMouseY] as const,
    ([scroll, mouse]) => (scroll as number) + (mouse as number) * 40,
  );

  return (
    <motion.div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ opacity: containerOpacity }}>
      {/* Primary orb — warm vermillion, top-right. Brand-coherent. */}
      <motion.div
        className="absolute w-[700px] h-[700px] md:w-[1000px] md:h-[1000px] rounded-full"
        style={{
          background: 'radial-gradient(circle, oklch(0.65 0.22 25 / 0.18) 0%, oklch(0.60 0.18 25 / 0.07) 45%, transparent 70%)',
          filter: 'blur(80px)',
          top: '-15%',
          right: '-20%',
          x: orb1FinalX,
          y: orb1FinalY,
          scale: orb1Scale,
          opacity: orb1Opacity,
        }}
      />

      {/* Secondary orb — deep crimson, bottom-left */}
      <motion.div
        className="absolute w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, oklch(0.48 0.16 30 / 0.15) 0%, oklch(0.45 0.14 32 / 0.05) 50%, transparent 70%)',
          filter: 'blur(90px)',
          bottom: '0%',
          left: '-15%',
          x: orb2FinalX,
          y: orb2FinalY,
          scale: orb2Scale,
          opacity: orb2Opacity,
        }}
      />

      {/* Parallax grid — very faint, geometric precision */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: gridY,
          rotate: gridRotate,
          opacity: gridOpacity,
        }}
      >
        <div
          className="absolute inset-[-50%] w-[200%] h-[200%]"
          style={{
            backgroundImage: `
              linear-gradient(oklch(0.93 0.008 50 / 0.2) 1px, transparent 1px),
              linear-gradient(90deg, oklch(0.93 0.008 50 / 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </motion.div>

      {/* Edge vignette for depth */}
      <div
        className="animated-bg-vignette absolute inset-0"
      />
    </motion.div>
  );
}
