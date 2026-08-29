'use client';

import React, { useState, useEffect } from 'react';
import { useOSStore } from '@/store/useOSStore';
import { DynamicIsland } from './DynamicIsland';
import {
  Wifi,
  Battery,
  Sliders,
  Search,
  Lock,
  LogOut,
  Sparkles,
  Shield,
  Volume2,
} from 'lucide-react';
import { sounds } from '@/lib/soundEngine';
import { APLogo } from '@/components/ui/APLogo';

interface MenuBarProps {
  onToggleSpotlight?: () => void;
  onToggleControlCenter?: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  onToggleSpotlight,
  onToggleControlCenter,
}) => {
  const {
    activeAppId,
    currentUser,
    isAdmin,
    openWindow,
    lockScreen,
    logout,
  } = useOSStore();

  const [timeString, setTimeString] = useState<string>('');
  const [dateString, setDateString] = useState<string>('');
  const [batteryLevel, setBatteryLevel] = useState<number>(98);
  const [isAppleMenuOpen, setIsAppleMenuOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
      setDateString(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 10000);

    if (typeof window !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-8 z-[9999] select-none flex items-center justify-between px-3 liquid-glass-surface rounded-none border-t-0 border-x-0 border-b border-white/25 backdrop-blur-[22px] backdrop-saturate-[150%] text-xs font-medium text-slate-800 shadow-[inset_0_-1px_1px_rgba(255,255,255,0.3),0_4px_20px_rgba(0,0,0,0.06)]">
      {/* Left AP Menu & App Navigation */}
      <div className="flex items-center space-x-3.5 relative z-10">
        <div className="relative">
          <button
            onClick={() => {
              sounds.playClick();
              setIsAppleMenuOpen(!isAppleMenuOpen);
              setIsUserMenuOpen(false);
            }}
            className="flex items-center space-x-1 p-1 hover:bg-black/5 rounded transition-colors"
            title="Anugamya System Menu"
          >
            <APLogo className="w-4 h-4 text-slate-900" />
          </button>

          {isAppleMenuOpen && (
            <div
              className="liquid-glass-card absolute top-7 left-0 w-60 rounded-2xl shadow-2xl p-1 text-slate-800 z-[10000] border border-white/30 backdrop-blur-[24px] bg-white/85 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-3 py-1.5 border-b border-slate-200">
                <div className="font-bold text-slate-950">About Anugamya OS</div>
                <div className="text-[10px] text-slate-500 font-mono">macOS Sonoma • v2026.1</div>
              </div>

              <button
                onClick={() => {
                  sounds.playClick();
                  openWindow('projects');
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white rounded text-xs transition-colors flex items-center justify-between"
              >
                <span>Projects Showcase</span>
                <span className="text-[10px] text-slate-400 group-hover:text-white">⌘1</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  openWindow('analytics');
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white rounded text-xs transition-colors flex items-center justify-between"
              >
                <span>Visitor Intelligence</span>
                <span className="text-[10px] text-slate-400 group-hover:text-white">⌘2</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  openWindow('terminal');
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white rounded text-xs transition-colors flex items-center justify-between"
              >
                <span>Terminal CLI</span>
                <span className="text-[10px] text-slate-400 group-hover:text-white">⌘K</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  openWindow('music');
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white rounded text-xs transition-colors flex items-center justify-between"
              >
                <span>Apple Music</span>
              </button>

              <div className="my-1 border-t border-slate-200" />

              <button
                onClick={() => {
                  sounds.playClick();
                  lockScreen();
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white rounded text-xs flex items-center justify-between transition-colors"
              >
                <span>Lock Screen</span>
                <span className="text-[10px] text-slate-400 font-mono">⌘L</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  logout();
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-rose-600 hover:text-white rounded text-xs text-rose-600 flex items-center justify-between transition-colors"
              >
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <button
            onClick={() => {
              sounds.playClick();
              openWindow('projects');
            }}
            className="font-bold text-slate-900 hover:text-blue-600 transition-colors"
          >
            Finder
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              openWindow('projects');
            }}
            className="text-slate-700 hover:text-blue-600 transition-colors font-medium"
          >
            Projects
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              openWindow('analytics');
            }}
            className="text-slate-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-1"
          >
            <span>Analytics</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              openWindow('music');
            }}
            className="text-slate-700 hover:text-blue-600 transition-colors font-medium"
          >
            Music
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              openWindow('achievements');
            }}
            className="text-slate-700 hover:text-blue-600 transition-colors font-medium"
          >
            Milestones
          </button>
        </div>
      </div>

      {/* Center Dynamic Island */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1 z-20">
        <DynamicIsland />
      </div>

      {/* Right Control & User Profile Bar */}
      <div className="flex items-center space-x-2.5 text-[11px] relative z-10">
        {currentUser && (
          <div className="relative">
            <button
              onClick={() => {
                sounds.playClick();
                setIsUserMenuOpen(!isUserMenuOpen);
                setIsAppleMenuOpen(false);
              }}
              className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/70 hover:bg-white border border-slate-300 text-slate-800 transition-all font-semibold shadow-2xs cursor-pointer"
            >
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">
                {isAdmin ? '👑' : currentUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="max-w-[110px] truncate">{currentUser.name}</span>
            </button>

            {isUserMenuOpen && (
              <div className="liquid-glass-card absolute top-7 right-0 w-56 rounded-2xl shadow-2xl p-2.5 text-slate-800 z-[10000] border border-white/30 backdrop-blur-[22px] bg-white/90 space-y-2">
                <div className="pb-1.5 border-b border-slate-200">
                  <div className="font-bold text-xs text-slate-900">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-500">{currentUser.role || 'Visitor'} • {currentUser.company || 'Guest'}</div>
                </div>

                <button
                  onClick={() => {
                    sounds.playClick();
                    openWindow('analytics');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1 rounded hover:bg-blue-600 hover:text-white text-[11px] transition-colors"
                >
                  View Activity & Logs
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    logout();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1 rounded hover:bg-rose-600 hover:text-white text-[11px] text-rose-600 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}

        {/* Spotlight Search Icon */}
        <button
          onClick={() => {
            sounds.playClick();
            if (onToggleSpotlight) onToggleSpotlight();
          }}
          className="p-1 hover:bg-black/5 rounded transition-colors text-slate-700 hover:text-slate-950"
          title="Spotlight Search (⌘Space)"
        >
          <Search className="w-3.5 h-3.5" />
        </button>

        {/* Control Center Toggle */}
        <button
          onClick={() => {
            sounds.playClick();
            if (onToggleControlCenter) onToggleControlCenter();
          }}
          className="p-1 hover:bg-black/5 rounded transition-colors text-slate-700 hover:text-slate-950"
          title="Control Center"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>

        {/* Status Indicators */}
        <div className="flex items-center space-x-1.5 text-slate-700">
          <Wifi className="w-3.5 h-3.5 text-slate-800" />
          <div className="flex items-center space-x-0.5">
            <span className="text-[10px] font-mono font-medium">{batteryLevel}%</span>
            <Battery className="w-4 h-4 text-slate-800" />
          </div>
        </div>

        {/* Live Date & Time */}
        <div className="flex items-center space-x-1.5 pl-1 font-medium text-slate-900">
          <span>{dateString}</span>
          <span className="font-semibold">{timeString}</span>
        </div>
      </div>
    </header>
  );
};

export default MenuBar;
