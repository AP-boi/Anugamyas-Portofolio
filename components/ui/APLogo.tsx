'use client';

import React from 'react';

interface APLogoProps {
  className?: string;
  size?: number;
  variant?: 'dark' | 'light' | 'auto';
  glow?: boolean;
}

export const APLogo: React.FC<APLogoProps> = ({
  className = 'w-5 h-5',
  size,
  variant = 'auto',
  glow = false,
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center relative overflow-hidden select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/icons/ap-logo.png"
        alt="AP Monogram"
        className={`w-full h-full object-contain pointer-events-none transition-all ${
          variant === 'light'
            ? 'invert hue-rotate-180 brightness-200'
            : variant === 'dark'
            ? 'mix-blend-multiply'
            : 'dark:invert mix-blend-multiply dark:mix-blend-screen'
        } ${glow ? 'drop-shadow-[0_0_20px_rgba(255,255,255,0.7)]' : ''}`}
      />
    </div>
  );
};

export default APLogo;
