'use client';

import React from 'react';

/**
 * LiquidGlassFilter:
 * Universal SVG displacement & turbulence filter for realistic liquid glass refraction.
 * Used via backdrop-filter: url(#lg) or filter: url(#lg) along with the .glass utility class.
 */
export function LiquidGlassFilter() {
  return (
    <svg
      width="0"
      height="0"
      className="pointer-events-none fixed -top-[9999px] -left-[9999px] -z-50 opacity-0 w-0 h-0 overflow-hidden"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: -9999,
        left: -9999,
        width: 0,
        height: 0,
        pointerEvents: 'none',
        visibility: 'hidden',
      }}
    >
      <defs>
        <filter
          id="lg"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
          colorInterpolationFilters="sRGB"
        >
          {/* Turbulence noise texture acting as the displacement map */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04 0.04"
            numOctaves="2"
            result="n"
          />

          {/* Physically displaces backdrop pixels using the noise map 'n' */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="16"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
        </filter>
      </defs>
    </svg>
  );
}

export default LiquidGlassFilter;
