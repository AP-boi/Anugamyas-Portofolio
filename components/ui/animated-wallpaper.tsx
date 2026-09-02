'use client';

import React, { memo } from 'react';

interface AnimatedWallpaperProps {
  imageSrc: string;
}

export const AnimatedWallpaper: React.FC<AnimatedWallpaperProps> = memo(({ imageSrc }) => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden select-none bg-slate-950 pointer-events-none">
      <div
        style={{
          backgroundImage: `url('${imageSrc}')`,
        }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 ease-in-out"
      >
        {/* Subtle high-resolution ambient vignette */}
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-30" />
      </div>
    </div>
  );
});

AnimatedWallpaper.displayName = 'AnimatedWallpaper';

export default AnimatedWallpaper;
