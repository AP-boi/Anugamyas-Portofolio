'use client';

import React, { useEffect, useRef, useState, useId } from 'react';
import { motion } from 'framer-motion';
import { generateShuDingDisplacementMap, defaultShuDingFragment, FragmentShader } from '@/lib/shudingLiquidGlass';
import { X, Move } from 'lucide-react';

interface ShuDingLiquidGlassLensProps {
  initialWidth?: number;
  initialHeight?: number;
  fragment?: FragmentShader;
  onClose?: () => void;
  className?: string;
  children?: React.ReactNode;
}

/**
 * ShuDingLiquidGlassLens:
 * Interactive, movable optical liquid glass magnifying lens powered by
 * Shu Ding's SDF algorithm & dynamic 2D canvas displacement generator.
 */
export const ShuDingLiquidGlassLens: React.FC<ShuDingLiquidGlassLensProps> = ({
  initialWidth = 320,
  initialHeight = 190,
  fragment = defaultShuDingFragment,
  onClose,
  className = '',
  children,
}) => {
  const id = useId().replace(/:/g, '-');
  const filterId = `shuding-filter-${id}`;
  const [mapUrl, setMapUrl] = useState<string>('');
  const [scale, setScale] = useState<number>(18);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 120, y: 120 });
  const [mouse, setMouse] = useState<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, initialX: 0, initialY: 0 });

  useEffect(() => {
    const result = generateShuDingDisplacementMap(initialWidth, initialHeight, fragment, mouse);
    if (result) {
      setMapUrl(result.dataUrl);
      setScale(result.scale);
    }
  }, [initialWidth, initialHeight, fragment, mouse]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      setPosition({
        x: Math.max(10, Math.min(window.innerWidth - initialWidth - 10, dragStartRef.current.initialX + deltaX)),
        y: Math.max(34, Math.min(window.innerHeight - initialHeight - 10, dragStartRef.current.initialY + deltaY)),
      });
    }

    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  return (
    <>
      <svg
        width="0"
        height="0"
        className="pointer-events-none fixed -top-[9999px] -left-[9999px] -z-50 opacity-0 w-0 h-0 overflow-hidden"
        aria-hidden="true"
        style={{ position: 'fixed', width: 0, height: 0, pointerEvents: 'none' }}
      >
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
            {mapUrl && <feImage href={mapUrl} result="shuding_map" />}
            <feDisplacementMap
              in="SourceGraphic"
              in2="shuding_map"
              scale={scale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <motion.div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${initialWidth}px`,
          height: `${initialHeight}px`,
          zIndex: 99990,
          backdropFilter: mapUrl
            ? `url(#${filterId}) blur(0.5px) contrast(1.15) brightness(1.05) saturate(1.2)`
            : 'blur(16px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
        }}
        className={`select-none rounded-[36px] overflow-hidden border border-white/40 dark:border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.4),inset_0_-10px_25px_rgba(0,0,0,0.15)] cursor-grab active:cursor-grabbing p-4 flex flex-col justify-between ${className}`}
      >
        {/* Header bar of the lens */}
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/20 dark:bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-mono text-white">
            <Move className="w-3 h-3 text-cyan-400" />
            <span>Shu Ding Liquid Lens</span>
          </div>
          {onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-5 h-5 rounded-full bg-rose-500/80 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
              title="Close Lens"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Content layer */}
        <div className="relative z-10 pointer-events-none text-center">
          {children || (
            <p className="text-[11px] font-medium text-white/90 drop-shadow-sm">
              Drag anywhere over desktop & windows to view live optical SDF refraction
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-white/70">
          <span>scale: {scale.toFixed(1)}px</span>
          <span>SDF Smoothstep</span>
        </div>
      </motion.div>
    </>
  );
};

export default ShuDingLiquidGlassLens;
