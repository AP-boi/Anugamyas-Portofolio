'use client';

import React, { useEffect, useRef } from 'react';
import { useOSStore } from '@/store/useOSStore';
import {
  FolderPlus,
  Image,
  Terminal,
  Activity,
  Lock,
  Layers,
  Sparkles,
  Info,
  ExternalLink,
} from 'lucide-react';

interface DesktopContextMenuProps {
  x: number;
  y: number;
  isOpen: boolean;
  onClose: () => void;
  onChangeWallpaper: () => void;
}

export const DesktopContextMenu: React.FC<DesktopContextMenuProps> = ({
  x,
  y,
  isOpen,
  onClose,
  onChangeWallpaper,
}) => {
  const { openWindow, lockScreen } = useOSStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('mousedown', handleOutsideClick);
      return () => window.removeEventListener('mousedown', handleOutsideClick);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Prevent overflowing screen boundaries
  const adjustedX = Math.min(x, typeof window !== 'undefined' ? window.innerWidth - 220 : x);
  const adjustedY = Math.min(y, typeof window !== 'undefined' ? window.innerHeight - 260 : y);

  return (
    <div
      ref={menuRef}
      style={{ left: `${adjustedX}px`, top: `${adjustedY}px` }}
      className="liquid-glass-card fixed z-[99999] w-56 rounded-2xl shadow-2xl p-1.5 text-slate-800 border border-white/40 backdrop-blur-[24px] bg-white/80 select-none text-xs font-medium"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => {
          openWindow('projects');
          onClose();
        }}
        className="w-full text-left px-2.5 py-1.5 hover:bg-blue-600 hover:text-white rounded-lg text-xs flex items-center justify-between transition-colors group"
      >
        <div className="flex items-center space-x-2">
          <img src="/icons/folder.png" alt="" className="w-3.5 h-3.5 object-contain" />
          <span>New Folder / Projects</span>
        </div>
      </button>

      <button
        onClick={() => {
          onChangeWallpaper();
          onClose();
        }}
        className="w-full text-left px-2.5 py-1.5 hover:bg-blue-600 hover:text-white rounded-lg text-xs flex items-center justify-between transition-colors group"
      >
        <div className="flex items-center space-x-2">
          <img src="/icons/photos.png" alt="" className="w-3.5 h-3.5 object-contain" />
          <span>Change Wallpaper</span>
        </div>
      </button>

      <div className="my-1 border-t border-slate-200/80" />

      <button
        onClick={() => {
          openWindow('analytics');
          onClose();
        }}
        className="w-full text-left px-2.5 py-1.5 hover:bg-blue-600 hover:text-white rounded-lg text-xs flex items-center justify-between transition-colors group"
      >
        <div className="flex items-center space-x-2">
          <img src="/icons/activity.png" alt="" className="w-3.5 h-3.5 object-contain rounded-xs" />
          <span>Visitor Intelligence</span>
        </div>
      </button>

      <button
        onClick={() => {
          openWindow('terminal');
          onClose();
        }}
        className="w-full text-left px-2.5 py-1.5 hover:bg-blue-600 hover:text-white rounded-lg text-xs flex items-center justify-between transition-colors group"
      >
        <div className="flex items-center space-x-2">
          <img src="/icons/terminal.png" alt="" className="w-3.5 h-3.5 object-contain rounded-xs" />
          <span>Open in Terminal</span>
        </div>
        <span className="text-[10px] text-slate-400 group-hover:text-white font-mono">⌘K</span>
      </button>

      <button
        onClick={() => {
          openWindow('system-info');
          onClose();
        }}
        className="w-full text-left px-2.5 py-1.5 hover:bg-blue-600 hover:text-white rounded-lg text-xs flex items-center justify-between transition-colors group"
      >
        <div className="flex items-center space-x-2">
          <img src="/icons/settings.png" alt="" className="w-3.5 h-3.5 object-contain rounded-xs" />
          <span>About Portfolio Architecture</span>
        </div>
      </button>

      <div className="my-1 border-t border-slate-200/80" />

      <button
        onClick={() => {
          lockScreen();
          onClose();
        }}
        className="w-full text-left px-2.5 py-1.5 hover:bg-blue-600 hover:text-white rounded-lg text-xs flex items-center justify-between transition-colors group"
      >
        <div className="flex items-center space-x-2">
          <Lock className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
          <span>Lock Screen</span>
        </div>
        <span className="text-[10px] text-slate-400 group-hover:text-white font-mono">⌘L</span>
      </button>
    </div>
  );
};

export default DesktopContextMenu;
