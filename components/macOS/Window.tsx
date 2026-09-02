'use client';

import React, { useRef, memo, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { useOSStore } from '@/store/useOSStore';
import { AppId } from '@/types/os';
import { Minus, X, Maximize2, Minimize2 } from 'lucide-react';
import { sounds } from '@/lib/soundEngine';

interface WindowProps {
  id: AppId;
  children: React.ReactNode;
}

/**
 * Authentic macOS window motion:
 * - Open:    spring zoom-in from ~92% with a soft blur lift (dock-bounce feel)
 * - Close:   quick fade + scale-down into the dock
 * - Minimize: genie squish — window accelerates & squashes into the dock (bottom-center)
 * - Zoom:    left/top/width/height spring between restored & maximized frames
 */
export const Window: React.FC<WindowProps> = memo(({ id, children }) => {
  const {
    windows,
    activeAppId,
    focusWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximizeWindow,
  } = useOSStore();

  const windowRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const windowState = windows[id];

  const isActive = activeAppId === id;
  const isVisible = windowState?.isOpen && !windowState?.isMinimized;
  const isMaximized = !!windowState?.isMaximized;

  // Distance from the window's bottom edge to the dock (bottom-center) —
  // used by the genie exit so the window visibly travels *into* the dock.
  const genieTravel =
    typeof window !== 'undefined' && windowState
      ? window.innerHeight - Math.min(window.innerHeight - 60, windowState.position.y + windowState.size.height)
      : 520;

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      sounds.playWindowClose();
      closeWindow(id);
    },
    [id, closeWindow]
  );

  const handleMinimize = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      sounds.playWindowClose();
      minimizeWindow(id);
    },
    [id, minimizeWindow]
  );

  const handleMaximize = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      sounds.playClick();
      toggleMaximizeWindow(id);
    },
    [id, toggleMaximizeWindow]
  );

  return (
    <AnimatePresence mode="wait">
      {isVisible && windowState && (
        <motion.div
          key={`window-${id}`}
          ref={windowRef}
          initial={{
            opacity: 0,
            scale: 0.92,
            y: 14,
            filter: 'blur(6px)',
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            filter: 'blur(0px)',
            // Spring between restored & maximized frames (authentic macOS zoom)
            left: isMaximized ? 0 : windowState.position.x,
            top: isMaximized ? 32 : Math.max(34, windowState.position.y),
            width: isMaximized ? '100vw' : windowState.size.width,
            height: isMaximized ? 'calc(100vh - 84px)' : windowState.size.height,
          }}
          exit={
            // Genie squish into the dock when minimizing; quick fade when closing.
            // framer keeps the *last* exit variant used, so we pick per action.
            windowState.lastAction === 'minimize'
              ? {
                opacity: 0,
                scaleX: 0.35,
                scaleY: 0.02,
                y: genieTravel,
                filter: 'blur(3px)',
                transition: {
                  duration: 0.42,
                  ease: [0.45, 0, 0.55, 0.2],
                },
              }
              : {
                opacity: 0,
                scale: 0.9,
                y: 8,
                filter: 'blur(4px)',
                transition: { duration: 0.16, ease: 'easeOut' },
              }
          }
          transition={{
            // Open entrance
            type: 'spring',
            stiffness: 420,
            damping: 32,
            mass: 0.7,
            // Frame spring for the zoom (maximize) motion
            left: { type: 'spring', stiffness: 320, damping: 30, mass: 0.8 },
            top: { type: 'spring', stiffness: 320, damping: 30, mass: 0.8 },
            width: { type: 'spring', stiffness: 320, damping: 30, mass: 0.8 },
            height: { type: 'spring', stiffness: 320, damping: 30, mass: 0.8 },
            filter: { duration: 0.2 },
          }}
          style={{
            zIndex: windowState.zIndex,
            position: 'fixed',
            transformOrigin: windowState.lastAction === 'minimize' ? '50% 100%' : '50% 50%',
          }}
          onMouseDown={() => focusWindow(id)}
          drag={!isMaximized}
          dragListener={false}
          dragControls={dragControls}
          dragMomentum={false}
          dragElastic={false}
          className={`flex flex-col rounded-2xl overflow-hidden liquid-glass-surface border border-white/40 bg-white/85 text-slate-900 backdrop-blur-[24px] ${isActive
              ? 'ring-1 ring-white/60 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.45),inset_0_-1px_1px_rgba(255,255,255,0.1),0_26px_70px_rgba(0,0,0,0.38)]'
              : 'opacity-95 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.45),0_14px_40px_rgba(0,0,0,0.22)]'
            }`}
        >
          {/* macOS Window Titlebar with double-click maximize */}
          <div
            onPointerDown={(e) => {
              focusWindow(id);
              dragControls.start(e);
            }}
            onDoubleClick={handleMaximize}
            className="relative z-10 h-9 px-3 flex items-center justify-between select-none cursor-grab active:cursor-grabbing border-b border-slate-200/80 bg-white/70 text-slate-800 flex-shrink-0"
          >
            {/* macOS Traffic Light Controls */}
            <div className="flex items-center space-x-2 group w-24">
              {/* Red = Close */}
              <button
                onClick={handleClose}
                className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#e0443e] active:scale-90 border border-[#e0443e]/40 flex items-center justify-center text-slate-950 focus:outline-none transition-all duration-150 cursor-pointer hover:brightness-110"
                title="Close"
              >
                <X className="w-2 h-2 opacity-0 group-hover:opacity-100 font-bold" />
              </button>

              {/* Yellow = Minimize */}
              <button
                onClick={handleMinimize}
                className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#dea123] active:scale-90 border border-[#dea123]/40 flex items-center justify-center text-slate-950 focus:outline-none transition-all duration-150 cursor-pointer hover:brightness-110"
                title="Minimize"
              >
                <Minus className="w-2 h-2 opacity-0 group-hover:opacity-100 font-bold" />
              </button>

              {/* Green = Zoom / Maximize */}
              <button
                onClick={handleMaximize}
                className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#1aab29] active:scale-90 border border-[#1aab29]/40 flex items-center justify-center text-slate-950 focus:outline-none transition-all duration-150 cursor-pointer hover:brightness-110"
                title="Zoom"
              >
                {isMaximized ? (
                  <Minimize2 className="w-2 h-2 opacity-0 group-hover:opacity-100 font-bold" />
                ) : (
                  <Maximize2 className="w-2 h-2 opacity-0 group-hover:opacity-100 font-bold" />
                )}
              </button>
            </div>

            {/* Window Title Header with authentic macOS app icon */}
            <div className="flex items-center space-x-2 text-xs font-semibold tracking-wide pointer-events-none truncate text-slate-800">
              {windowState.iconSrc && (
                <img
                  src={windowState.iconSrc}
                  alt=""
                  className="w-4 h-4 rounded object-contain drop-shadow-xs flex-shrink-0"
                />
              )}
              <span className="truncate">{windowState.title}</span>
            </div>

            {/* Right Spacer */}
            <div className="w-24" />
          </div>

          {/* Window Content Body */}
          <div className="flex-1 min-h-0 w-full overflow-hidden bg-white/95 text-slate-900 flex flex-col">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

Window.displayName = 'Window';
export default Window;