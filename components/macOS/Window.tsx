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
  const isDarkApp = id === 'terminal' || id === 'ai-assistant';

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

  // Compute dynamic sweep vector towards the app's Dock icon
  const getDockSweepOffset = () => {
    if (typeof window === 'undefined') return { x: 0, y: 360 };
    const dockIcon = document.getElementById(`dock-icon-${id}`);
    if (dockIcon && windowState) {
      const rect = dockIcon.getBoundingClientRect();
      const winCenterX = windowState.position.x + windowState.size.width / 2;
      const winCenterY = windowState.position.y + windowState.size.height / 2;
      const iconCenterX = rect.left + rect.width / 2;
      const iconCenterY = rect.top + rect.height / 2;
      return {
        x: iconCenterX - winCenterX,
        y: iconCenterY - winCenterY,
      };
    }
    return {
      x: 0,
      y: (typeof window !== 'undefined' ? window.innerHeight : 800) - (windowState?.position.y ?? 100),
    };
  };

  const sweepOffset = getDockSweepOffset();

  return (
    <AnimatePresence mode="wait">
      {isVisible && windowState && (
        <motion.div
          key={`window-${id}`}
          ref={windowRef}
          data-window="true"
          data-no-marquee="true"
          initial={{
            x: sweepOffset.x,
            y: sweepOffset.y,
            scale: 0.12,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
            x: 0,
            y: 0,
            top: isMaximized ? 32 : Math.max(34, windowState.position.y),
            left: isMaximized ? 0 : Math.max(0, windowState.position.x),
            width: isMaximized ? '100vw' : windowState.size.width,
            height: isMaximized ? 'calc(100vh - 32px)' : windowState.size.height,
            borderRadius: isMaximized ? 0 : 16,
            filter: 'blur(0px)',
          }}
          exit={{
            x: sweepOffset.x,
            y: sweepOffset.y,
            scale: 0.12,
            opacity: 0,
            filter: 'blur(3px)',
            transition: { duration: 0.32, ease: [0.32, 0.72, 0, 1] },
          }}
          transition={{
            width: { type: 'spring', stiffness: 320, damping: 30, mass: 0.8 },
            height: { type: 'spring', stiffness: 320, damping: 30, mass: 0.8 },
            scale: { type: 'spring', stiffness: 280, damping: 26, mass: 0.8 },
            x: { type: 'spring', stiffness: 280, damping: 26, mass: 0.8 },
            y: { type: 'spring', stiffness: 280, damping: 26, mass: 0.8 },
            opacity: { duration: 0.22 },
          }}
          style={{
            zIndex: windowState.zIndex,
            position: 'fixed',
          }}
          onMouseDown={() => focusWindow(id)}
          drag={true}
          dragListener={false}
          dragControls={dragControls}
          dragMomentum={false}
          dragElastic={false}
          className={`flex flex-col rounded-2xl overflow-hidden select-none max-w-[calc(100vw-16px)] max-h-[calc(100vh-48px)] ${
            isDarkApp
              ? `border border-slate-700/80 bg-slate-900 text-slate-100 backdrop-blur-[24px] shadow-2xl`
              : `liquid-glass-surface border border-white/40 bg-white/85 text-slate-900 backdrop-blur-[24px] ${
                  isActive
                    ? 'ring-1 ring-white/60 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.45),inset_0_-1px_1px_rgba(255,255,255,0.1),0_26px_70px_rgba(0,0,0,0.38)]'
                    : 'opacity-95 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.45),0_14px_40px_rgba(0,0,0,0.22)]'
                }`
          }`}
        >
          {/* macOS Window Titlebar with double-click maximize and drag */}
          <div
            onPointerDown={(e) => {
              focusWindow(id);
              if (isMaximized) {
                toggleMaximizeWindow(id);
              }
              dragControls.start(e);
            }}
            onDoubleClick={handleMaximize}
            className={`relative z-10 h-9 px-3 flex items-center justify-between select-none cursor-grab active:cursor-grabbing border-b flex-shrink-0 ${
              isDarkApp
                ? 'border-slate-800 bg-slate-900 text-slate-200'
                : 'border-slate-200/80 bg-white/70 text-slate-800'
            }`}
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
            <div className={`flex items-center space-x-2 text-xs font-semibold tracking-wide pointer-events-none truncate ${
              isDarkApp ? 'text-slate-200' : 'text-slate-800'
            }`}>
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
          <div className={`flex-1 min-h-0 w-full overflow-hidden flex flex-col ${
            isDarkApp ? 'bg-slate-950 text-slate-100' : 'bg-white/95 text-slate-900'
          }`}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

Window.displayName = 'Window';
export default Window;