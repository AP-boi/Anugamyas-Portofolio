'use client';

import React, { useState, useEffect } from 'react';
import { useOSStore } from '@/store/useOSStore';
import {
  Wifi,
  Battery,
  Sliders,
  Search,
  Lock,
  LogOut,
  Shield,
  Volume2,
} from 'lucide-react';
import { sounds } from '@/lib/soundEngine';
import { APLogo } from '@/components/ui/APLogo';
import { ThemeToggleButton1 } from '@/components/ui/skiper-ui/skiper4';

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
    theme,
    toggleTheme,
  } = useOSStore();

  const [timeString, setTimeString] = useState<string>('');
  const [dateString, setDateString] = useState<string>('');
  const [batteryLevel, setBatteryLevel] = useState<number>(98);
  const [isSystemMenuOpen, setIsSystemMenuOpen] = useState<boolean>(false);
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

  useEffect(() => {
    if (!isSystemMenuOpen && !isUserMenuOpen) return;
    const handleOutsideClick = () => {
      setIsSystemMenuOpen(false);
      setIsUserMenuOpen(false);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [isSystemMenuOpen, isUserMenuOpen]);

  return (
    <header
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}
      className={`h-8 select-none flex items-center justify-between px-3 rounded-none border-t-0 border-x-0 border-b text-xs font-medium transition-colors glass liquid-glass-surface ${theme === 'dark'
          ? 'bg-slate-900/85 border-slate-800/80 text-slate-200 shadow-md'
          : 'border-white/25 text-slate-800 shadow-[inset_0_-1px_1px_rgba(255,255,255,0.3),0_4px_20px_rgba(0,0,0,0.06)]'
        }`}
    >
      {/* Left AP Menu & App Navigation */}
      <div className="flex items-center space-x-3.5 relative z-10">
        <div className="relative">
          <button
            onClick={() => {
              sounds.playClick();
              setIsSystemMenuOpen(!isSystemMenuOpen);
              setIsUserMenuOpen(false);
            }}
            className="flex items-center space-x-1 p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors"
            title="Anugamya System Menu"
          >
            <APLogo className="w-5 h-3.5" variant={theme === 'dark' ? 'light' : 'dark'} />
          </button>

          {isSystemMenuOpen && (
            <div
              className={`absolute top-7 left-0 w-60 rounded-2xl shadow-2xl p-1 z-[10000] border backdrop-blur-[24px] text-xs transition-colors ${theme === 'dark'
                  ? 'bg-slate-900/95 border-slate-700/80 text-slate-100 shadow-black/60'
                  : 'liquid-glass-card border-white/30 bg-white/85 text-slate-800'
                }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-3 py-1.5 border-b border-slate-200 dark:border-slate-800">
                <div className="font-bold text-slate-950 dark:text-white">About Anugamya OS</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">macOS Sonoma • v2026.1</div>
              </div>

              <button
                onClick={() => {
                  sounds.playClick();
                  openWindow('projects');
                  setIsSystemMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white rounded text-xs transition-colors flex items-center justify-between"
              >
                <span>Projects Showcase</span>
                <span className="text-[10px] text-slate-400 group-hover:text-white">⌘1</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  openWindow('system-info');
                  setIsSystemMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white rounded text-xs transition-colors flex items-center justify-between"
              >
                <span>System Settings</span>
                <span className="text-[10px] text-slate-400 group-hover:text-white">⌘2</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  openWindow('terminal');
                  setIsSystemMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white rounded text-xs transition-colors flex items-center justify-between"
              >
                <span>Terminal CLI</span>
                <span className="text-[10px] text-slate-400 group-hover:text-white">⌘K</span>
              </button>

              <div className="my-1 border-t border-slate-200" />

              <button
                onClick={() => {
                  sounds.playClick();
                  lockScreen();
                  setIsSystemMenuOpen(false);
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
                  setIsSystemMenuOpen(false);
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
              openWindow('terminal');
            }}
            className="text-slate-700 hover:text-blue-600 transition-colors font-medium"
          >
            Terminal
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

      {/* Right Control & User Profile Bar */}
      <div className="flex items-center space-x-2.5 text-[11px] relative z-10">
        {currentUser && (
          <div className="relative">
            <button
              onClick={() => {
                sounds.playClick();
                setIsUserMenuOpen(!isUserMenuOpen);
                setIsSystemMenuOpen(false);
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
                    openWindow('system-info');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1 rounded hover:bg-blue-600 hover:text-white text-[11px] transition-colors"
                >
                  System Settings
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

        {/* Skiper4 Animated Theme Toggle (Style 1 as requested) */}
        <div className="flex items-center">
          <ThemeToggleButton1
            className="w-5 h-5 cursor-pointer"
            isDark={theme === 'dark'}
            onToggle={() => {
              sounds.playClick();
              toggleTheme();
            }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          />
        </div>

        {/* Control Center Toggle */}
        <button
          onClick={() => {
            sounds.playClick();
            if (onToggleControlCenter) onToggleControlCenter();
          }}
          className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
          title="Control Center"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>

        {/* Status Indicators */}
        <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
          <Wifi className="w-3.5 h-3.5" />
          <div className="flex items-center space-x-0.5">
            <span className="text-[10px] font-mono font-medium">{batteryLevel}%</span>
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Live Date & Time */}
        <div className="flex items-center space-x-1.5 pl-1 font-medium text-slate-900 dark:text-slate-100">
          <span>{dateString}</span>
          <span className="font-semibold">{timeString}</span>
        </div>
      </div>
    </header>
  );
};

export default MenuBar;
