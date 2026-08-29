'use client';

import React, { memo } from 'react';
import { useOSStore } from '@/store/useOSStore';
import { AppId } from '@/types/os';
import { Dock as BaseDock, DockIcon } from '@/components/ui/dock';
import { ExternalLink } from 'lucide-react';

interface DockIconConfig {
  id: AppId;
  label: string;
  iconSrc: string;
  isExternal?: boolean;
  externalUrl?: string;
}

const DOCK_ITEMS: DockIconConfig[] = [
  {
    id: 'projects',
    label: 'Finder',
    iconSrc: '/icons/finder.png',
  },
  {
    id: 'github',
    label: 'Safari / GitHub',
    iconSrc: '/icons/safari.png',
  },
  {
    id: 'achievements',
    label: 'Notes / Achievements',
    iconSrc: '/icons/notes.png',
  },
  {
    id: 'terminal',
    label: 'Terminal',
    iconSrc: '/icons/terminal.png',
  },
  {
    id: 'analytics',
    label: 'Visitor Intelligence & Logs',
    iconSrc: '/icons/settings.png',
  },
  {
    id: 'camera',
    label: 'Camera / Photo Booth',
    iconSrc: '/icons/camera.png',
  },
  {
    id: 'tetris',
    label: 'Game Center / Tetris',
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

export const Dock: React.FC = memo(() => {
  const { windows, activeAppId, openWindow, focusWindow, minimizeWindow } = useOSStore();

  return (
    <div className="fixed bottom-3 left-0 right-0 z-[9999] flex justify-center pointer-events-none">
      <div className="pointer-events-auto">
        <BaseDock
          iconSize={58}
          iconMagnification={92}
          iconDistance={160}
          direction="middle"
          className="liquid-glass-surface mt-0 h-[78px] rounded-[30px] px-4 py-2.5 gap-2.5 overflow-visible border border-white/30 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.45),inset_0_-1px_1px_rgba(255,255,255,0.1),0_26px_70px_rgba(0,0,0,0.38)] backdrop-blur-[22px] backdrop-saturate-[150%]"
        >
          {/* Subtle liquid refraction orbs */}
          <span className="glass-orb glass-orb--one -top-12 -left-10 w-36 h-36 opacity-30" />
          <span className="glass-orb glass-orb--two -bottom-12 -right-10 w-36 h-36 opacity-30" />
          {DOCK_ITEMS.map((item, index) => {
            const isOpen = windows[item.id]?.isOpen;
            const isMinimized = windows[item.id]?.isMinimized;
            const isActive = activeAppId === item.id && isOpen && !isMinimized;

            return (
              <DockIcon
                id={`dock-icon-${item.id}`}
                key={`${item.id}-${item.label}-${index}`}
                className="relative group flex flex-col items-center justify-center p-0.5 rounded-2xl overflow-visible aspect-square cursor-pointer"
                onClick={() => {
                  if (item.isExternal) {
                    window.open(item.externalUrl, '_blank', 'noopener,noreferrer');
                    openWindow(item.id);
                  } else {
                    if (windows[item.id]?.isOpen) {
                      if (windows[item.id]?.isMinimized) {
                        openWindow(item.id);
                      } else if (isActive) {
                        minimizeWindow(item.id);
                      } else {
                        focusWindow(item.id);
                      }
                    } else {
                      openWindow(item.id);
                    }
                  }
                }}
              >
                {/* Tooltip on Hover */}
                <div
                  className="absolute -top-11 opacity-0 group-hover:opacity-100 pointer-events-none px-3.5 py-1.5 rounded-xl bg-slate-950/90 text-white text-xs font-medium border border-white/15 backdrop-blur-md whitespace-nowrap shadow-2xl z-30 transition-opacity duration-150"
                >
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {item.isExternal && <ExternalLink className="w-3 h-3 text-purple-300" />}
                  </span>
                </div>

                {/* Real Apple macOS App Icon with Clean Transparency & Specular Sheen */}
                <div className="relative w-full h-full flex items-center justify-center group/icon drop-shadow-[0_6px_14px_rgba(0,0,0,0.18)] hover:drop-shadow-[0_10px_22px_rgba(0,0,0,0.26)] transition-all">
                  <img
                    src={item.iconSrc}
                    alt={item.label}
                    className="w-full h-full object-contain select-none pointer-events-none transform transition-transform group-hover/icon:scale-105"
                    draggable={false}
                  />
                  {/* Ambient Specular Glass Reflection Sheen */}
                  <div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover/icon:opacity-100 pointer-events-none rounded-2xl transition-opacity duration-200"
                  />
                </div>

                {/* Open / Active Dot Indicator */}
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

