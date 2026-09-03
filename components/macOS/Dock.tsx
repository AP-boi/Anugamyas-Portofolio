'use client';

import React, { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore } from '@/store/useOSStore';
import { AppId } from '@/types/os';
import { Dock as BaseDock, DockIcon } from '@/components/ui/dock';
import { Grid, Activity } from 'lucide-react';
import { sounds } from '@/lib/soundEngine';
import { MAC_SNAPPY_SPRING } from '@/lib/animations';

interface DockIconConfig {
  id: AppId;
  label: string;
  iconSrc?: string;
}

interface DockProps { }

const DOCK_ITEMS: DockIconConfig[] = [
  {
    id: 'projects',
    label: 'Finder — Projects',
    iconSrc: '/icons/finder.png',
  },
  {
    id: 'github',
    label: 'Safari — GitHub (@AP-boi)',
    iconSrc: '/icons/safari.png',
  },
  {
    id: 'achievements',
    label: 'Notes — Milestones',
    iconSrc: '/icons/notes.png',
  },
  {
    id: 'terminal',
    label: 'Terminal — zsh',
    iconSrc: '/icons/terminal.png',
  },
  {
    id: 'camera',
    label: 'Camera & Motion Grid',
    iconSrc: '/icons/camera.png',
  },
  {
    id: 'tetris',
    label: 'Game Center — Tetris AI',
    iconSrc: '/icons/games.png',
  },
  {
    id: 'ai-assistant',
    label: 'AP Intelligence Assistant',
    iconSrc: '/icons/siri.png',
  },
  {
    id: 'system-info',
    label: 'System Settings',
    iconSrc: '/icons/settings.png',
  },
];

/** macOS dock launch bounce: two hops with a squash-and-stretch landing. */
const bounceKeyframes = {
  y: [0, -22, 0, -12, 0],
  scaleY: [1, 0.94, 1.06, 0.97, 1],
  scaleX: [1, 1.06, 0.96, 1.02, 1],
  transition: {
    duration: 0.9,
    times: [0, 0.32, 0.58, 0.78, 1],
    ease: 'easeOut' as const,
  },
};

export const Dock: React.FC<DockProps> = memo(() => {
  const { windows, activeAppId, openWindow, focusWindow, minimizeWindow, theme } = useOSStore();
  // Apps currently playing the launch bounce (macOS bounces icons on open)
  const [bouncingApps, setBouncingApps] = useState<Set<string>>(new Set());

  const triggerBounce = useCallback((key: string) => {
    setBouncingApps((prev) => new Set(prev).add(key));
    setTimeout(() => {
      setBouncingApps((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }, 950);
  }, []);

  const handleAppClick = useCallback(
    (appId: AppId) => {
      sounds.playClick();
      const win = windows[appId];
      if (win?.isOpen) {
        if (win.isMinimized) {
          sounds.playWindowOpen();
          openWindow(appId);
        } else if (activeAppId === appId) {
          sounds.playWindowClose();
          minimizeWindow(appId);
        } else {
          focusWindow(appId);
        }
      } else {
        sounds.playWindowOpen();
        triggerBounce(appId);
        openWindow(appId);
      }
    },
    [windows, activeAppId, openWindow, focusWindow, minimizeWindow, triggerBounce]
  );

  return (
    <div className="fixed bottom-3 left-0 right-0 z-[9999] flex justify-center pointer-events-none">
      <div className="pointer-events-auto">
        <BaseDock
          iconSize={56}
          iconMagnification={90}
          iconDistance={150}
          direction="middle"
          className={`mt-0 h-[78px] rounded-[30px] px-4 py-2.5 gap-2.5 overflow-visible border backdrop-blur-[24px] backdrop-saturate-[150%] transition-colors ${theme === 'dark'
              ? 'bg-slate-900/75 border-slate-700/80 shadow-[0_20px_70px_rgba(0,0,0,0.6)]'
              : 'liquid-glass-surface border-white/30 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.45),inset_0_-1px_1px_rgba(255,255,255,0.1),0_26px_70px_rgba(0,0,0,0.38)]'
            }`}
        >
          {DOCK_ITEMS.map((item, index) => {
            const appId = item.id;
            const itemKey = `${appIdKey(appId, index)}`;
            const isBouncing = bouncingApps.has(itemKey);
            const isOpen = windows[appId]?.isOpen;
            const isMinimized = windows[appId]?.isMinimized;
            const isActive = activeAppId === appId && isOpen && !isMinimized;

            return (
              <DockIcon
                id={`dock-icon-${appId}`}
                key={`${appId}-${item.label}-${index}`}
                className="relative group flex flex-col items-center justify-center p-0.5 rounded-2xl overflow-visible aspect-square cursor-pointer"
                onClick={() => handleAppClick(appId)}
              >
                <DockTooltip label={item.label} />

                <motion.div
                  animate={isBouncing ? bounceKeyframes : { y: 0, scaleX: 1, scaleY: 1 }}
                  className="relative w-full h-full flex items-center justify-center group/icon drop-shadow-[0_6px_14px_rgba(0,0,0,0.18)] hover:drop-shadow-[0_10px_22px_rgba(0,0,0,0.26)] transition-all origin-bottom"
                >
                  {item.iconSrc ? (
                    <img
                      src={item.iconSrc}
                      alt={item.label}
                      className="w-full h-full object-contain select-none pointer-events-none transform transition-transform group-hover/icon:scale-105 rounded-[14px]"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold">
                      {item.label.charAt(0)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover/icon:opacity-100 pointer-events-none rounded-2xl transition-opacity duration-200" />
                </motion.div>

                {/* Running indicator dot — springs in/out like macOS */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={MAC_SNAPPY_SPRING}
                      className={`absolute -bottom-1.5 rounded-full origin-center ${isActive ? 'w-2 h-1 bg-slate-900 shadow-sm' : 'w-1 h-1 bg-slate-600'
                        }`}
                    />
                  )}
                </AnimatePresence>
              </DockIcon>
            );
          })}
        </BaseDock>
      </div>
    </div>
  );
});

/** Stable key helper so bounce state survives re-renders. */
function appIdKey(appId: AppId, index: number) {
  return `${appId}-${index}`;
}

/** macOS-style dock tooltip: springs up with a slight scale overshoot. */
const DockTooltip: React.FC<{ label: string }> = memo(({ label }) => (
  <motion.div
    initial={{ opacity: 0, y: 6, scale: 0.9 }}
    whileHover={undefined}
    className="absolute -top-12 opacity-0 scale-90 translate-y-1.5 pointer-events-none px-3.5 py-1.5 rounded-xl bg-slate-950/90 text-white text-xs font-medium border border-white/15 backdrop-blur-md whitespace-nowrap shadow-2xl z-30 transition-all duration-150 ease-out group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0"
  >
    {label}
  </motion.div>
));
DockTooltip.displayName = 'DockTooltip';

Dock.displayName = 'Dock';
export default Dock;