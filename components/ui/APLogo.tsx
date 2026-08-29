'use client';

import React from 'react';

interface APLogoProps {
  className?: string;
  size?: number;
  variant?: 'light' | 'dark' | 'auto';
  glow?: boolean;
}

export const APLogo: React.FC<APLogoProps> = ({
  className = 'w-6 h-6',
  size,
  variant = 'auto',
  glow = false,
}) => {
  const strokeColor =
    variant === 'light'
      ? '#ffffff'
      : variant === 'dark'
      ? '#0f172a'
      : 'currentColor';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 300"
      fill="none"
      stroke={strokeColor}
      strokeWidth="20"
      strokeLinecap="square"
      strokeLinejoin="miter"
      width={size}
      height={size}
      className={`inline-block select-none pointer-events-none transition-transform duration-200 ${className} ${
        glow ? 'drop-shadow-[0_0_24px_rgba(255,255,255,0.85)]' : ''
      }`}
    >
      {/* Letter 'A' Outer Frame and Left Leg */}
      <line x1="90" y1="120" x2="90" y2="235" strokeWidth="22" />
      {/* Letter 'A' Horizontal Crossbar */}
      <line x1="90" y1="180" x2="200" y2="180" strokeWidth="22" />
      {/* Letter 'A' Top Curve and Right Leg */}
      <path
        d="M 90 120 C 90 85, 110 65, 145 65 L 175 65 C 200 65, 205 85, 205 110 L 205 235"
        strokeWidth="22"
      />

      {/* Letter 'P' Interlocking Left Stem */}
      <line x1="180" y1="65" x2="180" y2="235" strokeWidth="22" />
      {/* Letter 'P' Rounded Upper Loop Bowl */}
      <path
        d="M 180 65 L 250 65 C 290 65, 315 85, 315 120 C 315 155, 290 175, 250 175 L 180 175"
        strokeWidth="22"
      />
    </svg>
  );
};

export default APLogo;
