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

  const rotateX = useTransform(springY, [0, 1], enableTilt ? [5, -5] : [0, 0]);
  const rotateY = useTransform(springX, [0, 1], enableTilt ? [-5, 5] : [0, 0]);

  const sheenX = useTransform(springX, [0, 1], [0, 100]);
  const sheenY = useTransform(springY, [0, 1], [0, 100]);

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
      whileHover={interactive ? { scale: 1.015, y: -2 } : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={cn(
        'liquid-glass-card relative overflow-hidden rounded-3xl',
        className
      )}
      {...(props as any)}
    >
      {/* Refraction Glass Orbs */}
      <span className="glass-orb glass-orb--one -top-20 -right-16 w-52 h-52" />
      <span className="glass-orb glass-orb--two -bottom-24 -left-16 w-60 h-60" />

      {/* Interactive Cursor Follower Specular Light Sheen */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 rounded-3xl z-10"
        style={{
          background: sheenBackground,
          willChange: 'background',
        }}
      />

      {/* Card Content Layer */}
      <div className="relative z-10">{children}</div>
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
        'liquid-glass-surface relative overflow-hidden rounded-3xl',
        className
      )}
      style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      {...(props as any)}
    >
      {/* Refraction Glass Orbs */}
      <span className="glass-orb glass-orb--one -top-16 -right-12 w-40 h-40 opacity-40" />
      <span className="glass-orb glass-orb--two -bottom-16 -left-12 w-44 h-44 opacity-40" />

      <div className="relative z-10">{children}</div>
    </div>
  );
});

LiquidGlassContainer.displayName = 'LiquidGlassContainer';

export default LiquidGlassCard;

