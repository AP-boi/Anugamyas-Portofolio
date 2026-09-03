'use client';

import React, { memo, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import LiquidGlassComponent from 'liquid-glass-react';

export { LiquidGlassComponent as LiquidGlass };

export interface LiquidGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'deep';
  interactive?: boolean;
  displacementScale?: number;
  blurAmount?: number;
  saturation?: number;
  aberrationIntensity?: number;
  elasticity?: number;
  cornerRadius?: number;
  mode?: 'standard' | 'polar' | 'prominent' | 'shader';
}

export const LiquidGlassCard: React.FC<LiquidGlassProps> = memo(({
  children,
  className,
  interactive = true,
  displacementScale = 65,
  blurAmount = 0.08,
  saturation = 140,
  aberrationIntensity = 1.8,
  elasticity = 0.18,
  cornerRadius = 28,
  mode = 'standard',
  style,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const sheenX = useTransform(smoothX, [0, 1], ['0%', '100%']);
  const sheenY = useTransform(smoothY, [0, 1], ['0%', '100%']);
  const sheenBackground = useTransform(
    [sheenX, sheenY],
    ([x, y]) => `radial-gradient(400px circle at ${x} ${y}, rgba(255, 255, 255, 0.4), transparent 80%)`
  );

  return (
    <LiquidGlassComponent
      displacementScale={displacementScale}
      blurAmount={blurAmount}
      saturation={saturation}
      aberrationIntensity={aberrationIntensity}
      elasticity={interactive ? elasticity : 0}
      cornerRadius={cornerRadius}
      mode={mode}
      padding="0"
      className={cn('w-full', className)}
      style={style}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={interactive ? { y: -2, transition: { duration: 0.2 } } : undefined}
        whileTap={interactive ? { scale: 0.98 } : undefined}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="glass liquid-glass-card relative overflow-hidden rounded-3xl w-full h-full"
        {...(props as any)}
      >
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
    </LiquidGlassComponent>
  );
});

LiquidGlassCard.displayName = 'LiquidGlassCard';

export const LiquidGlassContainer: React.FC<LiquidGlassProps> = memo(({
  children,
  className,
  displacementScale = 60,
  blurAmount = 0.06,
  saturation = 135,
  aberrationIntensity = 1.5,
  elasticity = 0.12,
  cornerRadius = 28,
  mode = 'standard',
  style,
  ...props
}) => {
  return (
    <LiquidGlassComponent
      displacementScale={displacementScale}
      blurAmount={blurAmount}
      saturation={saturation}
      aberrationIntensity={aberrationIntensity}
      elasticity={elasticity}
      cornerRadius={cornerRadius}
      mode={mode}
      padding="0"
      className={cn('w-full', className)}
      style={style}
    >
      <div
        className="glass liquid-glass-surface relative overflow-hidden rounded-3xl w-full h-full"
        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
        {...(props as any)}
      >
        <div className="relative z-10">{children}</div>
      </div>
    </LiquidGlassComponent>
  );
});

LiquidGlassContainer.displayName = 'LiquidGlassContainer';

export default LiquidGlassCard;

