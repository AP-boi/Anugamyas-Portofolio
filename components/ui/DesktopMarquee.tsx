'use client';

import React, { useState, useEffect } from 'react';

export const DesktopMarquee: React.FC = () => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      // Ignore if clicking on windows, docks, menubar, buttons, inputs
      const target = e.target as HTMLElement;
      if (
        target.closest('.liquid-glass-surface') ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('header') ||
        target.closest('.liquid-glass-card')
      ) {
        return;
      }

      if (e.button === 0) {
        // Left click only
        setIsSelecting(true);
        setStartPos({ x: e.clientX, y: e.clientY });
        setCurrentPos({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isSelecting) return;
      setCurrentPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      if (isSelecting) {
        setIsSelecting(false);
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSelecting]);

  if (!isSelecting) return null;

  const left = Math.min(startPos.x, currentPos.x);
  const top = Math.min(startPos.y, currentPos.y);
  const width = Math.abs(currentPos.x - startPos.x);
  const height = Math.abs(currentPos.y - startPos.y);

  if (width < 4 && height < 4) return null;

  return (
    <div
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
      className="fixed pointer-events-none z-[15] bg-blue-500/20 border border-blue-400/60 rounded-xs shadow-[0_0_12px_rgba(59,130,246,0.2)]"
    />
  );
};

export default DesktopMarquee;
