'use client';

import React, { useState, useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore } from '@/store/useOSStore';
import { AppId } from '@/types/os';
import { Minus, Square, X, Maximize2, Minimize2 } from 'lucide-react';
import { GenieEffect } from '@/components/ui/genie-effect';

interface WindowProps {
  id: AppId;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = memo(({ id, children }) => {
  const { windows, activeAppId, focusWindow, closeWindow, minimizeWindow, toggleMaximizeWindow, updateWindowBounds } =
    useOSStore();

  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [isMinimizing, setIsMinimizing] = useState<boolean>(false);
  const windowRef = useRef<HTMLDivElement>(null);

  const windowState = windows[id];

  if (!windowState || !windowState.isOpen || windowState.isMinimized) {
    return null;
  }

  const isActive = activeAppId === id;

  const handleDragEnd = (_: any, info: any) => {
    updateWindowBounds(id, {
      x: windowState.position.x + info.offset.x,
      y: Math.max(32, windowState.position.y + info.offset.y),
    });
  };

  const getTargetDockRect = () => {
    if (typeof window === 'undefined') return undefined;
    const el = document.getElementById(`dock-item-${id}`);
    if (el) {
      const bounds = el.getBoundingClientRect();
      return {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
      };
    }
    return undefined;
  };

  const currentWindowRect = {
    x: windowState.isMaximized ? 0 : windowState.position.x,
    y: windowState.isMaximized ? 32 : windowState.position.y,
    width: windowState.isMaximized ? (typeof window !== 'undefined' ? window.innerWidth : 1200) : windowState.size.width,
    height: windowState.isMaximized ? (typeof window !== 'undefined' ? window.innerHeight - 84 : 800) : windowState.size.height,
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClosing(true);
  };

  const handleMinimizeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimizing(true);
  };

  const handleGenieComplete = () => {
    if (isClosing) {
      setIsClosing(false);
      closeWindow(id);
    } else if (isMinimizing) {
      setIsMinimizing(false);
      minimizeWindow(id);
    }
  };

  return (
    <GenieEffect
      isOpen={windowState.isOpen}
      isClosing={isClosing}
      isMinimizing={isMinimizing}
      onCloseComplete={handleGenieComplete}
      targetRect={getTargetDockRect()}
      windowRect={currentWindowRect}
    >
      <div
        ref={windowRef}
        style={{
          zIndex: windowState.zIndex,
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        onMouseDown={() => focusWindow(id)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: windowState.isMaximized ? 0 : windowState.position.x,
            y: windowState.isMaximized ? 32 : windowState.position.y,
            width: windowState.isMaximized ? '100vw' : windowState.size.width,
            height: windowState.isMaximized ? 'calc(100vh - 84px)' : windowState.size.height,
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          drag={!windowState.isMaximized}
          dragMomentum={false}
          dragConstraints={{ left: 0, top: 32, right: 1200, bottom: 800 }}
          onDragEnd={handleDragEnd}
          style={{ willChange: 'transform, width, height' }}
          className={`flex flex-col rounded-2xl backdrop-blur-xl backdrop-saturate-150 border overflow-hidden shadow-2xl ${
            isActive
              ? 'bg-white/95 border-slate-200/90 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] ring-1 ring-black/5'
              : 'bg-white/80 border-slate-200/60 shadow-md ring-0 opacity-95'
          }`}
        >
          {/* macOS Window Titlebar with double-click maximize */}
          <div
            onDoubleClick={() => toggleMaximizeWindow(id)}
            className={`h-10 px-3.5 flex items-center justify-between select-none cursor-grab active:cursor-grabbing border-b ${
              isActive ? 'bg-slate-100/90 border-slate-200/80' : 'bg-slate-50/70 border-slate-200/40'
            }`}
          >
            {/* macOS Traffic Light Controls */}
            <div className="flex items-center space-x-2 group w-20">
              {/* Red = Close */}
              <button
                onClick={handleCloseClick}
                className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#e0443e] border border-[#e0443e]/40 flex items-center justify-center text-slate-950 focus:outline-none"
                title="Close"
              >
                <X className="w-2 h-2 opacity-0 group-hover:opacity-100 font-bold" />
              </button>

              {/* Yellow = Minimize */}
              <button
                onClick={handleMinimizeClick}
                className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#dea123] border border-[#dea123]/40 flex items-center justify-center text-slate-950 focus:outline-none"
                title="Minimize"
              >
                <Minus className="w-2 h-2 opacity-0 group-hover:opacity-100 font-bold" />
              </button>

              {/* Green = Zoom / Maximize */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMaximizeWindow(id);
                }}
                className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#1aab29] border border-[#1aab29]/40 flex items-center justify-center text-slate-950 focus:outline-none"
                title="Zoom"
              >
                {windowState.isMaximized ? (
                  <Minimize2 className="w-2 h-2 opacity-0 group-hover:opacity-100 font-bold" />
                ) : (
                  <Maximize2 className="w-2 h-2 opacity-0 group-hover:opacity-100 font-bold" />
                )}
              </button>
            </div>

            {/* Window Title Header */}
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800 tracking-wide pointer-events-none">
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
      </div>
    </GenieEffect>
  );
});

Window.displayName = 'Window';

export default Window;
