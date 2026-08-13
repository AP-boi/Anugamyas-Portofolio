'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback, memo } from 'react';

interface GenieEffectProps {
  isOpen: boolean;
  isClosing: boolean;
  isMinimizing: boolean;
  onCloseComplete: () => void;
  targetRect?: { x: number; y: number; width: number; height: number };
  children: React.ReactNode;
  windowRect: { x: number; y: number; width: number; height: number };
}

export const GenieEffect: React.FC<GenieEffectProps> = memo(({
  isOpen,
  isClosing,
  isMinimizing,
  onCloseComplete,
  targetRect,
  children,
  windowRect,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const animRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const activeTarget = targetRect || {
    x: typeof window !== 'undefined' ? window.innerWidth / 2 - 24 : 400,
    y: typeof window !== 'undefined' ? window.innerHeight - 50 : 700,
    width: 48,
    height: 48,
  };

  const targetX = activeTarget.x + activeTarget.width / 2;
  const targetY = activeTarget.y + activeTarget.height / 2;

  // Auto-play animation when closing or minimizing
  useEffect(() => {
    if ((isClosing || isMinimizing) && !isScrubbing) {
      startTimeRef.current = performance.now();
      const duration = 400; // Faster for snappier feel

      const animateGenie = (now: number) => {
        const elapsed = now - startTimeRef.current;
        const p = Math.min(1, elapsed / duration);
        
        // Custom easing: easeInCubic for fluid suction
        const easedP = Math.pow(p, 1.8);
        setProgress(easedP);

        if (p < 1) {
          animRef.current = requestAnimationFrame(animateGenie);
        } else {
          onCloseComplete();
        }
      };

      animRef.current = requestAnimationFrame(animateGenie);

      return () => {
        if (animRef.current) cancelAnimationFrame(animRef.current);
      };
    } else if (!isClosing && !isMinimizing) {
      setProgress(0);
    }
  }, [isClosing, isMinimizing, isScrubbing, onCloseComplete]);

  // Handle mid-flight drag scrubbing
  const handleScrubStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isClosing && !isMinimizing) return;
    setIsScrubbing(true);
    if (animRef.current) cancelAnimationFrame(animRef.current);
  }, [isClosing, isMinimizing]);

  const handleScrubMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isScrubbing) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const startY = windowRect.y;
    const totalDist = Math.max(100, targetY - startY);
    const currentDist = clientY - startY;
    const newProgress = Math.max(0, Math.min(1, currentDist / totalDist));
    setProgress(newProgress);
  }, [isScrubbing, windowRect.y, targetY]);

  const handleScrubEnd = useCallback(() => {
    if (!isScrubbing) return;
    setIsScrubbing(false);
    if (progress > 0.6) {
      onCloseComplete();
    } else {
      setProgress(0);
    }
  }, [isScrubbing, progress, onCloseComplete]);

  // Reduced from 30 to 16 slices — still smooth but significantly fewer DOM nodes
  const sliceCount = 16;
  const slices = useMemo(() => {
    if (progress === 0) return null;

    const result = [];
    const p = progress;

    for (let i = 0; i < sliceCount; i++) {
      const v = i / (sliceCount - 1);

      const bendFactor = Math.pow(v, 1.4);
      const moveP = Math.min(1, p * (0.4 + 0.6 * bendFactor));

      const startCenterX = windowRect.x + windowRect.width / 2;
      const curCenterX = startCenterX + (targetX - startCenterX) * moveP;

      const startY = windowRect.y + v * windowRect.height;
      const curY = startY + (targetY - startY) * moveP;

      const widthShrink = Math.pow(1 - moveP, 0.7);
      const waistPinch = 1 - 0.4 * Math.sin(Math.PI * v) * Math.sin(Math.PI * p);
      const curWidth = Math.max(8, windowRect.width * widthShrink * waistPinch);

      const opacity = Math.max(0.1, 1 - p * 0.75);

      result.push({
        id: i,
        top: (i / sliceCount) * 100,
        height: 100 / sliceCount + 0.2,
        centerX: curCenterX,
        y: curY,
        width: curWidth,
        opacity,
      });
    }

    return result;
  }, [progress, windowRect, targetX, targetY]);

  if (progress === 0 && !isClosing && !isMinimizing) {
    return <>{children}</>;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-auto z-[99999] select-none"
      onMouseMove={handleScrubMove}
      onTouchMove={handleScrubMove}
      onMouseUp={handleScrubEnd}
      onTouchEnd={handleScrubEnd}
    >
      {/* Mid-Flight Interactive Scrubber Overlay Banner */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/90 border border-cyan-500/40 shadow-2xl backdrop-blur-xl text-white text-xs font-mono">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>Mac OS X Genie Effect (Interactive Scrub)</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={progress}
          onMouseDown={handleScrubStart}
          onTouchStart={handleScrubStart}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="w-32 accent-cyan-400 cursor-pointer"
        />
        <span className="text-cyan-300 w-8">{Math.round(progress * 100)}%</span>
      </div>

      {/* Render Sliced Deformed Window Slices — using transform instead of top/left for GPU compositing */}
      {slices ? (
        <div className="relative w-full h-full">
          {slices.map((slice) => (
            <div
              key={slice.id}
              className="absolute overflow-hidden rounded-sm"
              style={{
                transform: `translate3d(${slice.centerX - slice.width / 2}px, ${slice.y}px, 0)`,
                width: slice.width,
                height: (windowRect.height / sliceCount) * (1 - progress * 0.4),
                opacity: slice.opacity,
                willChange: 'transform, opacity',
              }}
              onMouseDown={handleScrubStart}
              onTouchStart={handleScrubStart}
            >
              {/* Internal window slice content offset */}
              <div
                className="absolute w-full"
                style={{
                  transform: `translate3d(${(slice.width - windowRect.width) / 2}px, -${slice.top}%, 0)`,
                  height: `${sliceCount * 100}%`,
                  width: windowRect.width,
                }}
              >
                {children}
              </div>
            </div>
          ))}
        </div>
      ) : (
        children
      )}
    </div>
  );
});

GenieEffect.displayName = 'GenieEffect';

export default GenieEffect;
