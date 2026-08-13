'use client';

import React, { useRef, memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LiquidGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  enableTilt?: boolean;
  interactive?: boolean;
}

export const LiquidGlassCard: React.FC<LiquidGlassProps> = memo(({
  children,
  className,
  glowColor = 'rgba(255, 255, 255, 0.45)',
  enableTilt = true,
  interactive = true,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse position tracking for Aceternity UI radial sheen & tilt
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(springY, [0, 1], enableTilt ? [6, -6] : [0, 0]);
  const rotateY = useTransform(springX, [0, 1], enableTilt ? [-6, 6] : [0, 0]);

  const sheenX = useTransform(springX, [0, 1], [0, 100]);
  const sheenY = useTransform(springY, [0, 1], [0, 100]);

  // Pre-compute sheen gradient outside JSX to avoid re-creation per render
  const sheenBackground = useTransform(
    [sheenX, sheenY],
    ([sx, sy]: number[]) =>
      `radial-gradient(400px circle at ${sx}% ${sy}%, ${glowColor}, transparent 60%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      whileHover={interactive ? { scale: 1.02, y: -2 } : undefined}
      whileTap={interactive ? { scale: 0.97 } : undefined}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={cn(
        'relative overflow-hidden rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl backdrop-saturate-150 border border-white/80 dark:border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.1),0_0_20px_rgba(255,255,255,0.7)_inset] ring-1 ring-white/50',
        className
      )}
      {...(props as any)}
    >
      {/* Aceternity Cursor Follower Specular Light Sheen */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 rounded-2xl z-10"
        style={{
          background: sheenBackground,
          willChange: 'background',
        }}
      />

      {/* Top Specular Liquid Light Edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80 z-20" />

      {/* Card Content Layer */}
      <div className="relative z-20">{children}</div>
    </motion.div>
  );
});

LiquidGlassCard.displayName = 'LiquidGlassCard';

export const LiquidGlassContainer: React.FC<LiquidGlassProps> = memo(({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative rounded-2xl bg-white/55 dark:bg-slate-900/55 backdrop-blur-xl backdrop-saturate-150 border border-white/90 dark:border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.12),0_0_30px_rgba(255,255,255,0.8)_inset] ring-1 ring-white/60',
        className
      )}
      style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      {...(props as any)}
    >
      {/* Specular Liquid Edge Line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
      {children}
    </div>
  );
});

LiquidGlassContainer.displayName = 'LiquidGlassContainer';

export default LiquidGlassCard;
