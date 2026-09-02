'use client';

import React from 'react';
import { motion } from 'framer-motion';

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
    <motion.span
      whileHover={{ scale: 1.15, rotate: [0, -6, 6, 0] }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 350, damping: 18 }}
      className={`inline-flex items-center justify-center select-none ${className} ${
        glow ? 'drop-shadow-[0_0_20px_rgba(255,255,255,0.85)]' : ''
      }`}
      style={{ width: size, height: size ? `${size * 0.6}px` : undefined }}
    >
      <img
        src={imgSrc}
        alt="AP Monogram"
        className="w-full h-full object-contain pointer-events-none select-none transition-all duration-300"
      />
    </motion.span>
  );
};

export default APLogo;
