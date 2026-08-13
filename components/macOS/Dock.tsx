'use client';

import React, { memo, useCallback, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useOSStore, APP_REGISTRY } from '@/store/useOSStore';
import { AppId } from '@/types/os';
import { LiquidGlassContainer } from '@/components/ui/liquid-glass';
import {
  Award,
  FolderGit2,
  Github,
  Terminal,
  Bot,
  Activity,
  Compass,
  FileText,
  Image as ImageIcon,
  User,
  Settings as SettingsIcon,
  Trash2,
  ExternalLink,
  Camera,
  Gamepad2
} from 'lucide-react';

interface DockIconConfig {
  id: AppId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
  isExternal?: boolean;
  externalUrl?: string;
}

const DOCK_ITEMS: DockIconConfig[] = [
  {
    id: 'projects',
    label: 'Finder / Projects',
    icon: FolderGit2,
    color: 'text-cyan-300',
    gradient: 'from-cyan-500/30 to-blue-600/30 border-cyan-400/50',
  },
  {
    id: 'tetris',
    label: 'Tetris AI Game',
    icon: Gamepad2,
    color: 'text-orange-400',
    gradient: 'from-orange-500/30 to-amber-600/30 border-orange-400/50',
  },
  {
    id: 'camera',
    label: 'Camera / Motion Grid',
    icon: Camera,
    color: 'text-emerald-300',
    gradient: 'from-emerald-500/30 to-cyan-600/30 border-emerald-400/50',
  },
  {
    id: 'achievements',
    label: 'Safari / Resume',
    icon: Compass,
    color: 'text-blue-300',
    gradient: 'from-blue-500/30 to-indigo-600/30 border-blue-400/50',
  },
  {
    id: 'achievements',
    label: 'Notes / Achievements',
    icon: FileText,
    color: 'text-amber-300',
    gradient: 'from-amber-500/30 to-yellow-600/30 border-amber-400/50',
  },
  {
    id: 'github',
    label: 'Photos / Showcase',
    icon: ImageIcon,
    color: 'text-pink-300',
    gradient: 'from-pink-500/30 to-rose-600/30 border-pink-400/50',
  },
  {
    id: 'ai-assistant',
    label: 'Contact / AI Assistant',
    icon: User,
    color: 'text-amber-200',
    gradient: 'from-amber-600/30 to-yellow-700/30 border-amber-500/50',
  },
  {
    id: 'terminal',
    label: 'Terminal CLI',
    icon: Terminal,
    color: 'text-emerald-300',
    gradient: 'from-emerald-500/30 to-teal-600/30 border-emerald-400/50',
  },
  {
    id: 'system-info',
    label: 'System Settings',
    icon: SettingsIcon,
    color: 'text-slate-200',
    gradient: 'from-slate-600/30 to-slate-800/30 border-slate-400/50',
  },
  {
    id: 'system-info',
    label: 'Trash',
    icon: Trash2,
    color: 'text-slate-300',
    gradient: 'from-slate-700/30 to-slate-900/30 border-slate-500/50',
  },
];

export const Dock: React.FC = memo(() => {
  const { windows, activeAppId, openWindow, focusWindow } = useOSStore();
  const mouseX = useMotionValue<number>(Infinity);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouseX.set(e.pageX);
  }, [mouseX]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(Infinity);
  }, [mouseX]);

  return (
    <div className="fixed bottom-3 left-0 right-0 z-[9999] flex justify-center pointer-events-none">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="pointer-events-auto"
      >
        <LiquidGlassContainer className="flex items-end gap-2 px-3 py-2.5 rounded-2xl">
          {DOCK_ITEMS.map((item, index) => (
            <DockItem
              key={`${item.id}-${index}`}
              item={item}
              mouseX={mouseX}
              isOpen={windows[item.id]?.isOpen}
              isActive={activeAppId === item.id}
              onClick={() => {
                if (item.isExternal) {
                  window.open(item.externalUrl, '_blank', 'noopener,noreferrer');
                  openWindow(item.id);
                } else {
                  if (windows[item.id]?.isOpen) {
                    focusWindow(item.id);
                  } else {
                    openWindow(item.id);
                  }
                }
              }}
            />
          ))}
        </LiquidGlassContainer>
      </motion.div>
    </div>
  );
});

Dock.displayName = 'Dock';

interface DockItemProps {
  item: DockIconConfig;
  mouseX: any;
  isOpen: boolean;
  isActive: boolean;
  onClick: () => void;
}

const DockItem: React.FC<DockItemProps> = memo(({ item, mouseX, isOpen, isActive, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [48, 72, 48]);
  // Lighter spring for snappier dock animation with less CPU overhead
  const width = useSpring(widthSync, { mass: 0.08, stiffness: 250, damping: 18 });

  const IconComponent = item.icon;

  return (
    <div id={`dock-item-${item.id}`} className="relative group flex flex-col items-center">
      {/* Label Tooltip */}
      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 pointer-events-none px-2.5 py-1 rounded-md bg-slate-900/90 text-white text-[11px] font-medium border border-white/10 backdrop-blur-md whitespace-nowrap shadow-xl" style={{ transition: 'opacity 0.15s ease-out' }}>
        <span className="flex items-center gap-1">
          {item.label}
          {item.isExternal && <ExternalLink className="w-3 h-3 text-purple-300" />}
        </span>
      </div>

      {/* Magnifying Motion Container with Liquid Glass Card Styling */}
      <motion.div
        ref={ref}
        style={{ width, height: width, willChange: 'transform, width, height' }}
        onClick={onClick}
        whileTap={{ scale: 0.88 }}
        className={`relative flex items-center justify-center rounded-xl bg-gradient-to-b ${item.gradient} bg-white/40 backdrop-blur-xl border border-white/80 shadow-[0_8px_25px_rgba(0,0,0,0.08),0_0_15px_rgba(255,255,255,0.7)_inset] ring-1 ring-white/60 cursor-pointer overflow-hidden group/item`}
      >
        <IconComponent className={`w-1/2 h-1/2 ${item.color} drop-shadow`} />

        {/* Aceternity Ambient Specular Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/35 to-transparent opacity-0 group-hover/item:opacity-100 pointer-events-none" style={{ transition: 'opacity 0.2s ease-out' }} />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
      </motion.div>

      {/* Open / Active Dot Indicator */}
      <div className="h-1.5 flex items-center justify-center mt-1">
        {isOpen && (
          <div
            className={`rounded-full ${
              isActive ? 'w-2 h-1 bg-slate-900 shadow-sm' : 'w-1 h-1 bg-slate-600'
            }`}
            style={{ transition: 'all 0.2s ease-out' }}
          />
        )}
      </div>
    </div>
  );
});

DockItem.displayName = 'DockItem';
