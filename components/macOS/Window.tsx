'use client';

import React, { useRef, memo, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { useOSStore } from '@/store/useOSStore';
import { AppId } from '@/types/os';
import { Minus, X, Maximize2, Minimize2 } from 'lucide-react';

interface WindowProps {
  id: AppId;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = memo(({ id, children }) => {
  const {
    windows,
    activeAppId,
    focusWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximizeWindow,
    updateWindowBounds,
  } = useOSStore();

  const windowRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const windowState = windows[id];

  const isActive = activeAppId === id;
  const isVisible = windowState?.isOpen && !windowState?.isMinimized;
  const isDarkWindow = id === 'terminal';

  const handleDragEnd = useCallback(
    (_: any, info: any) => {
      if (!windowState) return;
      const newX = Math.max(-100, Math.min(window.innerWidth - 100, windowState.position.x + info.offset.x));
      const newY = Math.max(32, Math.min(window.innerHeight - 100, windowState.position.y + info.offset.y));
      updateWindowBounds(id, { x: newX, y: newY });
    },
    [id, windowState, updateWindowBounds]
  );

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      closeWindow(id);
    },
    [id, closeWindow]
  );

  const handleMinimize = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      minimizeWindow(id);
    },
    [id, minimizeWindow]
  );

  const handleMaximize = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleMaximizeWindow(id);
    },
    [id, toggleMaximizeWindow]
  );

  // Dynamically calculate spatial vector to the specific Dock icon that spawned this app
  const getDockTargetVector = () => {
    if (typeof window === 'undefined') return { x: 0, y: 280 };
    const dockEl = document.getElementById(`dock-icon-${id}`);
    if (dockEl && windowState) {
      const dockRect = dockEl.getBoundingClientRect();
      const dockCenterX = dockRect.left + dockRect.width / 2;
      const dockCenterY = dockRect.top + dockRect.height / 2;

      const winLeft = windowState.isMaximized ? 0 : windowState.position.x;
      const winTop = windowState.isMaximized ? 32 : windowState.position.y;
      const winWidth = windowState.isMaximized ? window.innerWidth : windowState.size.width;
      const winHeight = windowState.isMaximized ? window.innerHeight - 84 : windowState.size.height;

      const winCenterX = winLeft + winWidth / 2;
      const winCenterY = winTop + winHeight / 2;

      return {
        x: Math.round(dockCenterX - winCenterX),
        y: Math.round(dockCenterY - winCenterY),
      };
    }
    return {
      x: 0,
      y: Math.max(220, window.innerHeight - (windowState?.position.y || 100) - 80),
    };
  };

  const dockTarget = getDockTargetVector();

  return (
    <AnimatePresence mode="wait">
      {isVisible && windowState && (
        <motion.div
          key={`window-${id}`}
          ref={windowRef}
          initial={{
            opacity: 0,
            scale: 0.12,
            x: dockTarget.x,
            y: dockTarget.y,
            filter: 'blur(10px)',
          }}
          animate={{
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            filter: 'blur(0px)',
          }}
          exit={{
            opacity: 0,
            scale: 0.08,
            x: dockTarget.x,
            y: dockTarget.y,
            filter: 'blur(12px)',
            transition: {
              duration: 0.32,
              ease: [0.32, 0.72, 0, 1],
            },
          }}
          transition={{
            type: 'spring',
            stiffness: 340,
            damping: 26,
            mass: 0.75,
          }}
          style={{
            zIndex: windowState.zIndex,
            position: 'absolute',
            left: windowState.isMaximized ? 0 : windowState.position.x,
            top: windowState.isMaximized ? 32 : windowState.position.y,
            width: windowState.isMaximized ? '100vw' : windowState.size.width,
            height: windowState.isMaximized ? 'calc(100vh - 84px)' : windowState.size.height,
            transformOrigin: '50% 50%',
            willChange: 'transform, opacity, filter',
          }}
          onMouseDown={() => focusWindow(id)}
          drag={!windowState.isMaximized}
          dragListener={false}
          dragControls={dragControls}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          className={`flex flex-col rounded-2xl overflow-hidden liquid-glass-surface border shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.45),inset_0_-1px_1px_rgba(255,255,255,0.1),0_26px_70px_rgba(0,0,0,0.38)] backdrop-blur-[24px] ${
            isDarkWindow
              ? 'border-white/15 bg-slate-950/95 text-slate-100'
              : 'border-white/40 bg-white/70 text-slate-900'
          } ${isActive ? 'ring-1 ring-white/50' : 'opacity-95'}`}
        >
          {/* Subtle liquid refraction orbs */}
          <span className="glass-orb glass-orb--one -top-16 -right-12 w-48 h-48 opacity-20" />
          <span className="glass-orb glass-orb--two -bottom-16 -left-12 w-52 h-52 opacity-20" />

          {/* macOS Window Titlebar with double-click maximize */}
          <div
            onPointerDown={(e) => {
              focusWindow(id);
              dragControls.start(e);
            }}
            onDoubleClick={handleMaximize}
            className={`relative z-10 h-9 px-3 flex items-center justify-between select-none cursor-grab active:cursor-grabbing border-b ${
              isDarkWindow
                ? isActive
                  ? 'bg-slate-900/90 border-white/10 text-slate-200'
                  : 'bg-slate-950/80 border-white/5 text-slate-400'
                : isActive
                ? 'bg-white/60 border-slate-200/80 text-slate-800'
                : 'bg-white/30 border-slate-200/40 text-slate-600'
            }`}
          >
            {/* macOS Traffic Light Controls */}
            <div className="flex items-center space-x-2 group w-24">
              {/* Red = Close */}
              <button
                onClick={handleClose}
                className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#e0443e] active:scale-90 border border-[#e0443e]/40 flex items-center justify-center text-slate-950 focus:outline-none transition-transform"
                title="Close"
              >
                <X className="w-2 h-2 opacity-0 group-hover:opacity-100 font-bold" />
              </button>

              {/* Yellow = Minimize */}
              <button
                onClick={handleMinimize}
                className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#dea123] active:scale-90 border border-[#dea123]/40 flex items-center justify-center text-slate-950 focus:outline-none transition-transform"
                title="Minimize"
              >
                <Minus className="w-2 h-2 opacity-0 group-hover:opacity-100 font-bold" />
              </button>

              {/* Green = Zoom / Maximize */}
              <button
                onClick={handleMaximize}
                className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#1aab29] active:scale-90 border border-[#1aab29]/40 flex items-center justify-center text-slate-950 focus:outline-none transition-transform"
                title="Zoom"
              >
                {windowState.isMaximized ? (
                  <Minimize2 className="w-2 h-2 opacity-0 group-hover:opacity-100 font-bold" />
                ) : (
                  <Maximize2 className="w-2 h-2 opacity-0 group-hover:opacity-100 font-bold" />
                )}
              </button>
            </div>

            {/* Window Title Header with authentic macOS app icon */}
            <div className="flex items-center space-x-2 text-xs font-medium tracking-wide pointer-events-none truncate">
              {windowState.iconSrc && (
                <img
                  src={windowState.iconSrc}
                  alt=""
                  className="w-4 h-4 rounded object-contain drop-shadow-xs flex-shrink-0"
                />
              )}
              <span className={`truncate ${isDarkWindow ? 'font-mono text-[11px] text-slate-300' : 'text-slate-800 font-semibold'}`}>
                {windowState.title}
              </span>
            </div>

            {/* Right Spacer */}
            <div className="w-24" />
          </div>

          {/* Window Content Body */}
          <div
            className={`flex-1 overflow-auto ${
              isDarkWindow ? 'bg-slate-950 text-slate-100' : 'bg-white/80 text-slate-900'
            } scrollbar-thin ${
              isDarkWindow ? 'scrollbar-thumb-slate-700' : 'scrollbar-thumb-slate-300'
            }`}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

Window.displayName = 'Window';

export default Window;

