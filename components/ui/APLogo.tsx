'use client';

import React from 'react';

interface APLogoProps {
  className?: string;
  size?: number;
  color?: string;
  glow?: boolean;
}

export const APLogo: React.FC<APLogoProps> = ({
  className = 'w-4 h-4',
  size,
  color = 'currentColor',
  glow = false,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      fill="none"
      stroke={color}
      width={size}
      height={size}
      className={`${className} ${glow ? 'drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]' : ''}`}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* A left stem & base */}
      <path d="M165 435 V290 H235 V435" strokeWidth="28" strokeLinecap="square" strokeLinejoin="miter" />
      {/* A horizontal crossbar */}
      <path d="M165 365 H235" strokeWidth="28" strokeLinecap="square" />
      {/* A upper arch and middle column bridging to P */}
      <path d="M185 290 V230 C185 205 205 190 235 190 H265 C295 190 315 205 315 230 V435" strokeWidth="28" strokeLinecap="square" />
      {/* P top loop */}
      <path d="M315 190 H365 C410 190 435 215 435 255 C435 295 410 320 365 320 H315" strokeWidth="28" strokeLinecap="square" />
      {/* P lower stem base */}
      <path d="M315 320 V435" strokeWidth="28" strokeLinecap="square" />
    </svg>
  );
};

export default APLogo;
