'use client';

import React, { useEffect, useRef, useCallback, memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface AnimatedWallpaperProps {
  imageSrc: string;
}

export const AnimatedWallpaper: React.FC<AnimatedWallpaperProps> = memo(({ imageSrc }) => {
  // Track mouse coordinates for Apple Spatial Depth Parallax
  const mouseX = useMotionValue<number>(0.5);
  const mouseY = useMotionValue<number>(0.5);

  // Smooth Framer Motion springs for iOS-style fluid momentum physics
  const springX = useSpring(mouseX, { stiffness: 45, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 45, damping: 20 });

  // 3D Parallax Offsets & Rotations
  const translateX = useTransform(springX, [0, 1], [-25, 25]);
  const translateY = useTransform(springY, [0, 1], [-20, 20]);
  const rotateX = useTransform(springY, [0, 1], [3, -3]);
  const rotateY = useTransform(springX, [0, 1], [-4, 4]);

  // Dynamic light sheen gradient position
  const sheenX = useTransform(springX, [0, 1], [20, 80]);
  const sheenY = useTransform(springY, [0, 1], [20, 80]);

  // Pre-compute sheen gradient as a single motion value to avoid re-renders
  const sheenBackground = useTransform(
    [sheenX, sheenY],
    ([sx, sy]: number[]) =>
      `radial-gradient(circle 600px at ${sx}% ${sy}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)`
  );

  useEffect(() => {
    // Gate mousemove updates behind rAF to avoid overwhelming the spring system
    let rafId = 0;
    let pendingX = 0.5;
    let pendingY = 0.5;
    let dirty = false;

    const flush = () => {
      rafId = 0;
      mouseX.set(pendingX);
      mouseY.set(pendingY);
      dirty = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      pendingX = e.clientX / window.innerWidth;
      pendingY = e.clientY / window.innerHeight;
      if (!dirty) {
        dirty = true;
        rafId = requestAnimationFrame(flush);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden select-none bg-sky-50" style={{ perspective: '1200px' }}>
      {/* Apple Live Motion Spatial Scaling & Parallax Container */}
      <motion.div
        style={{
          x: translateX,
          y: translateY,
          rotateX,
          rotateY,
          scale: 1.08,
          backgroundImage: `url('${imageSrc}')`,
          willChange: 'transform',
          transformStyle: 'preserve-3d',
        }}
        animate={{
          scale: [1.06, 1.1, 1.06],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -inset-10 bg-cover bg-center bg-no-repeat"
      >
        {/* Apple Dynamic Spatial Light Sweep Sheen */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
          style={{
            background: sheenBackground,
            willChange: 'background',
          }}
        />

        {/* Ambient Subtle Breathing Color Pulse */}
        <motion.div
          animate={{
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 bg-gradient-to-tr from-sky-200/30 via-transparent to-indigo-200/30 pointer-events-none mix-blend-color-dodge"
        />
      </motion.div>

      {/* Floating Spatial Depth Dust & Web Sparkles Canvas Layer */}
      <DepthParticleOverlay />

      {/* Readability Vignette Overlay — switched to simple gradient, no backdrop-blur */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-white/10 via-transparent to-white/30 pointer-events-none" />
    </div>
  );
});

AnimatedWallpaper.displayName = 'AnimatedWallpaper';

// Floating Depth Particles for Apple Motion Wallpaper effect
const DepthParticleOverlay: React.FC = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Size canvas once and on resize, not every frame
    let w = window.innerWidth;
    let h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    const onResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', onResize, { passive: true });

    let animId: number;
    // Reduced from 35 to 20 particles — visually identical, halves draw calls
    const particles = Array.from({ length: 20 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.5 - 0.2,
      alpha: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
    }));

    const render = (time: number) => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha += Math.sin(time * p.pulseSpeed * 0.001) * 0.01;

        if (p.y < 0) p.y = h;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;

        const a = Math.max(0.1, Math.min(0.6, p.alpha));
        ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[1] opacity-70" />;
});

DepthParticleOverlay.displayName = 'DepthParticleOverlay';

export default AnimatedWallpaper;
