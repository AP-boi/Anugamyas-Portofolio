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
  const isDarkWindow = id === 'terminal';

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
            scale: 0.88,
            y: 24,
            filter: 'blur(8px)',
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            filter: 'blur(0px)',
          }}
          exit={{
            opacity: 0,
            scale: 0.88,
            y: 24,
            filter: 'blur(8px)',
            transition: { duration: 0.18, ease: 'easeOut' },
          }}
          transition={{
            type: 'spring',
            stiffness: 380,
            damping: 28,
            mass: 0.6,
          }}
          style={{
            zIndex: windowState.zIndex,
            position: 'fixed',
            left: windowState.isMaximized ? 0 : windowState.position.x,
            top: windowState.isMaximized ? 32 : Math.max(34, windowState.position.y),
            width: windowState.isMaximized ? '100vw' : windowState.size.width,
            height: windowState.isMaximized ? 'calc(100vh - 84px)' : windowState.size.height,
            transformOrigin: '50% 50%',
          }}
          onMouseDown={() => focusWindow(id)}
          drag={!windowState.isMaximized}
          dragListener={false}
          dragControls={dragControls}
          dragMomentum={false}
          dragElastic={0}
          dragConstraints={{
            top: 34,
            left: 0,
            right: typeof window !== 'undefined' ? window.innerWidth - 200 : 800,
            bottom: typeof window !== 'undefined' ? window.innerHeight - 120 : 600,
          }}
          className={`flex flex-col rounded-2xl overflow-hidden shadow-2xl ${
            isDarkWindow
              ? 'border border-white/15 bg-slate-950 text-slate-100 shadow-[0_24px_70px_rgba(0,0,0,0.7)] backdrop-blur-2xl'
              : 'liquid-glass-surface border border-white/40 bg-white/85 text-slate-900 backdrop-blur-[24px]'
          } ${isActive ? 'ring-1 ring-white/40' : 'opacity-95'}`}
        >
          {/* Subtle liquid refraction orbs only for light glass windows */}
          {!isDarkWindow && (
            <>
              <span className="glass-orb glass-orb--one -top-16 -right-12 w-48 h-48 opacity-20" />
              <span className="glass-orb glass-orb--two -bottom-16 -left-12 w-52 h-52 opacity-20" />
            </>
          )}

          {/* macOS Window Titlebar with double-click maximize */}
          <div
            onPointerDown={(e) => {
              focusWindow(id);
              dragControls.start(e);
            }}
            onDoubleClick={handleMaximize}
            className={`relative z-10 h-9 px-3 flex items-center justify-between select-none cursor-grab active:cursor-grabbing border-b flex-shrink-0 ${
              isDarkWindow
                ? isActive
                  ? 'bg-slate-900/95 border-white/10 text-slate-200'
                  : 'bg-slate-950 border-white/5 text-slate-400'
                : isActive
                ? 'bg-white/70 border-slate-200/80 text-slate-800'
                : 'bg-white/40 border-slate-200/40 text-slate-600'
            }`}
          >
            {/* macOS Traffic Light Controls */}
            <div className="flex items-center space-x-2 group w-24">
              {/* Red = Close */}
              <button
                onClick={handleClose}
                className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#e0443e] active:scale-90 border border-[#e0443e]/40 flex items-center justify-center text-slate-950 focus:outline-none transition-transform cursor-pointer"
                title="Close"
              >
                <X className="w-2 h-2 opacity-0 group-hover:opacity-100 font-bold" />
              </button>

              {/* Yellow = Minimize */}
              <button
                onClick={handleMinimize}
                className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#dea123] active:scale-90 border border-[#dea123]/40 flex items-center justify-center text-slate-950 focus:outline-none transition-transform cursor-pointer"
                title="Minimize"
              >
                <Minus className="w-2 h-2 opacity-0 group-hover:opacity-100 font-bold" />
              </button>

              {/* Green = Zoom / Maximize */}
              <button
                onClick={handleMaximize}
                className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#1aab29] active:scale-90 border border-[#1aab29]/40 flex items-center justify-center text-slate-950 focus:outline-none transition-transform cursor-pointer"
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

          {/* Window Content Body - seamlessly stretches 100% */}
          <div
            className={`flex-1 min-h-0 w-full flex flex-col ${
              isDarkWindow ? 'bg-slate-950 text-slate-100' : 'bg-white/80 text-slate-900 overflow-auto'
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
