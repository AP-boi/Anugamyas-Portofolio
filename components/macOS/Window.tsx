'use client';

import React, { useRef, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const windowState = windows[id];

  const isActive = activeAppId === id;
  const isVisible = windowState?.isOpen && !windowState?.isMinimized;

  const handleDragEnd = useCallback(
    (_: any, info: any) => {
      if (!windowState) return;
      updateWindowBounds(id, {
        x: Math.max(-100, Math.min(window.innerWidth - 100, windowState.position.x + info.offset.x)),
        y: Math.max(32, Math.min(window.innerHeight - 100, windowState.position.y + info.offset.y)),
      });
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

  return (
    <AnimatePresence mode="wait">
      {isVisible && windowState && (
        <motion.div
          key={`window-${id}`}
          ref={windowRef}
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            x: windowState.isMaximized ? 0 : windowState.position.x,
            top: windowState.isMaximized ? 32 : windowState.position.y,
            width: windowState.isMaximized ? '100vw' : windowState.size.width,
            height: windowState.isMaximized ? 'calc(100vh - 84px)' : windowState.size.height,
          }}
          exit={{
            opacity: 0,
            scale: 0.92,
            y: 12,
            transition: {
              duration: 0.18,
              ease: [0.32, 0.72, 0, 1],
            },
          }}
          transition={{
            type: 'spring',
            stiffness: 380,
            damping: 28,
            mass: 0.8,
          }}
          style={{
            zIndex: windowState.zIndex,
            position: 'absolute',
            left: 0,
            willChange: 'transform, opacity, width, height',
          }}
          onMouseDown={() => focusWindow(id)}
          drag={!windowState.isMaximized}
          dragMomentum={false}
          dragConstraints={{ left: 0, top: 32, right: 1400, bottom: 900 }}
          onDragEnd={handleDragEnd}
          className={`flex flex-col rounded-3xl overflow-hidden liquid-glass-surface border border-white/35 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.45),inset_0_-1px_1px_rgba(255,255,255,0.1),0_26px_70px_rgba(0,0,0,0.38)] backdrop-blur-[22px] backdrop-saturate-[150%] ${
            isActive
              ? 'ring-1 ring-white/40'
              : 'opacity-95'
          }`}
        >
          {/* Subtle liquid refraction orbs */}
          <span className="glass-orb glass-orb--one -top-16 -right-12 w-48 h-48 opacity-20" />
          <span className="glass-orb glass-orb--two -bottom-16 -left-12 w-52 h-52 opacity-20" />

          {/* macOS Window Titlebar with double-click maximize */}
          <div
            onDoubleClick={handleMaximize}
            className={`relative z-10 h-10 px-3.5 flex items-center justify-between select-none cursor-grab active:cursor-grabbing border-b ${
              isActive ? 'bg-white/40 border-white/30' : 'bg-white/20 border-white/20'
            }`}
          >
            {/* macOS Traffic Light Controls */}
            <div className="flex items-center space-x-2 group w-20">
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
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800 tracking-wide pointer-events-none">
              {windowState.iconSrc && (
                <img
                  src={windowState.iconSrc}
                  alt=""
                  className="w-5 h-5 rounded-md object-contain drop-shadow-xs"
                />
              )}
              <span>{windowState.title}</span>
            </div>

            {/* Right Spacer */}
            <div className="w-20" />
          </div>

          {/* Window Content Body */}
          <div className="flex-1 overflow-auto bg-slate-50/60 text-slate-900 p-3 scrollbar-thin scrollbar-thumb-slate-300">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

Window.displayName = 'Window';

export default Window;

