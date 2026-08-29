'use client';

import React, { memo } from 'react';
import { useOSStore } from '@/store/useOSStore';
import { AppId } from '@/types/os';
import { Dock as BaseDock, DockIcon } from '@/components/ui/dock';
import { Grid, Activity } from 'lucide-react';
import { sounds } from '@/lib/soundEngine';

interface DockIconConfig {
  id: AppId | 'launchpad';
  label: string;
  iconSrc?: string;
  isSpecial?: boolean;
  customIcon?: 'activity';
}

interface DockProps {
  onOpenLaunchpad?: () => void;
}

const DOCK_ITEMS: DockIconConfig[] = [
  {
    id: 'launchpad',
    label: 'Launchpad (F4)',
    isSpecial: true,
  },
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
    id: 'music',
    label: 'Music — Lofi Beats',
    iconSrc: '/icons/music.png',
  },
  {
    id: 'analytics',
    label: 'Activity Monitor — Visitor Intelligence',
    customIcon: 'activity',
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
    label: 'Apple Intelligence Siri',
    iconSrc: '/icons/siri.png',
  },
  {
    id: 'system-info',
    label: 'System Settings',
    iconSrc: '/icons/settings.png',
  },
  {
    id: 'system-info',
    label: 'Trash',
    iconSrc: '/icons/trash.png',
  },
];

export const Dock: React.FC<DockProps> = memo(({ onOpenLaunchpad }) => {
  const { windows, activeAppId, openWindow, focusWindow, minimizeWindow } = useOSStore();

  return (
    <div className="fixed bottom-3 left-0 right-0 z-[9999] flex justify-center pointer-events-none">
      <div className="pointer-events-auto">
        <BaseDock
          iconSize={56}
          iconMagnification={90}
          iconDistance={150}
          direction="middle"
          className="liquid-glass-surface mt-0 h-[78px] rounded-[30px] px-4 py-2.5 gap-2.5 overflow-visible border border-white/30 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.45),inset_0_-1px_1px_rgba(255,255,255,0.1),0_26px_70px_rgba(0,0,0,0.38)] backdrop-blur-[22px] backdrop-saturate-[150%]"
        >
          {DOCK_ITEMS.map((item, index) => {
            if (item.id === 'launchpad') {
              return (
                <DockIcon
                  key="dock-launchpad"
                  className="relative group flex flex-col items-center justify-center p-0.5 rounded-2xl overflow-visible aspect-square cursor-pointer"
                  onClick={() => {
                    sounds.playClick();
                    if (onOpenLaunchpad) onOpenLaunchpad();
                  }}
                >
                  <div className="absolute -top-11 opacity-0 group-hover:opacity-100 pointer-events-none px-3.5 py-1.5 rounded-xl bg-slate-950/90 text-white text-xs font-medium border border-white/15 backdrop-blur-md whitespace-nowrap shadow-2xl z-30 transition-opacity duration-150">
                    {item.label}
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-700 via-slate-800 to-slate-900 border border-white/20 shadow-md flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                    <Grid className="w-6 h-6 text-white" />
                  </div>
                </DockIcon>
              );
            }

            const appId = item.id as AppId;
            const isOpen = windows[appId]?.isOpen;
            const isMinimized = windows[appId]?.isMinimized;
            const isActive = activeAppId === appId && isOpen && !isMinimized;

            return (
              <DockIcon
                id={`dock-icon-${appId}`}
                key={`${appId}-${item.label}-${index}`}
                className="relative group flex flex-col items-center justify-center p-0.5 rounded-2xl overflow-visible aspect-square cursor-pointer"
                onClick={() => {
                  sounds.playClick();
                  if (windows[appId]?.isOpen) {
                    if (windows[appId]?.isMinimized) {
                      sounds.playWindowOpen();
                      openWindow(appId);
                    } else if (isActive) {
                      sounds.playWindowClose();
                      minimizeWindow(appId);
                    } else {
                      focusWindow(appId);
                    }
                  } else {
                    sounds.playWindowOpen();
                    openWindow(appId);
                  }
                }}
              >
                <div
                  className="absolute -top-11 opacity-0 group-hover:opacity-100 pointer-events-none px-3.5 py-1.5 rounded-xl bg-slate-950/90 text-white text-xs font-medium border border-white/15 backdrop-blur-md whitespace-nowrap shadow-2xl z-30 transition-opacity duration-150"
                >
                  <span>{item.label}</span>
                </div>

                <div className="relative w-full h-full flex items-center justify-center group/icon drop-shadow-[0_6px_14px_rgba(0,0,0,0.18)] hover:drop-shadow-[0_10px_22px_rgba(0,0,0,0.26)] transition-all">
                  {item.customIcon === 'activity' ? (
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 border border-emerald-500/30 shadow-lg flex items-center justify-center text-emerald-400 group-hover/icon:scale-105 transition-transform">
                      <Activity className="w-6 h-6 animate-pulse" />
                    </div>
                  ) : item.iconSrc ? (
                    <img
                      src={item.iconSrc}
                      alt={item.label}
                      className="w-full h-full object-contain select-none pointer-events-none transform transition-transform group-hover/icon:scale-105"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold">
                      {item.label.charAt(0)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover/icon:opacity-100 pointer-events-none rounded-2xl transition-opacity duration-200" />
                </div>

                {isOpen && (
                  <div
                    className={`absolute -bottom-1.5 rounded-full ${
                      isActive ? 'w-2 h-1 bg-slate-900 shadow-sm' : 'w-1 h-1 bg-slate-600'
                    }`}
                    style={{ transition: 'all 0.2s ease-out' }}
                  />
                )}
              </DockIcon>
            );
          })}
        </BaseDock>
      </div>
    </div>
  );
});

Dock.displayName = 'Dock';
export default Dock;
