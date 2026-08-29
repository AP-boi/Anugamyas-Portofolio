'use client';

import React from 'react';

interface APLogoProps {
  className?: string;
  size?: number;
  variant?: 'light' | 'dark' | 'auto';
  glow?: boolean;
}

export const APLogo: React.FC<APLogoProps> = ({
  className = 'w-6 h-4',
  size,
  variant = 'auto',
  glow = false,
}) => {
  const imgSrc =
    variant === 'light'
      ? '/icons/ap-logo-white.png'
      : variant === 'dark'
      ? '/icons/ap-logo-black.png'
      : '/icons/ap-logo-black.png';

  return (
    <span
      className={`inline-flex items-center justify-center select-none pointer-events-none ${className} ${
        glow ? 'drop-shadow-[0_0_20px_rgba(255,255,255,0.85)]' : ''
      }`}
      style={{ width: size, height: size ? `${size * 0.6}px` : undefined }}
    >
      <img
        src={imgSrc}
        alt="AP Monogram"
        className="w-full h-full object-contain pointer-events-none select-none"
      />
    </span>
  );
};

export default APLogo;
