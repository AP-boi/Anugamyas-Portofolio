'use client';

import React, { useState, useEffect } from 'react';
import { useOSStore, APP_REGISTRY } from '@/store/useOSStore';
import { AppId } from '@/types/os';
import {
  Apple,
  Wifi,
  Battery,
  Activity,
  Sliders,
  Terminal as TerminalIcon,
  Bot,
  Award,
  FolderGit2,
  Github,
  Maximize2,
  RefreshCw,
  Sun,
  Search,
  Lock,
  LogOut,
  User,
  Shield,
  BarChart3,
  Users,
} from 'lucide-react';

export const MenuBar: React.FC = () => {
  const {
    activeAppId,
    windows,
    telemetry,
    ambientLight,
    currentUser,
    isAdmin,
    openWindow,
    lockScreen,
    logout,
    updateAmbientLight,
  } = useOSStore();

  const [timeString, setTimeString] = useState<string>('');
  const [dateString, setDateString] = useState<string>('');
  const [batteryLevel, setBatteryLevel] = useState<number>(98);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState<boolean>(false);
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

    // Battery API detection
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

  // Keyboard shortcut listener: Cmd+L / Ctrl+L locks the screen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
        e.preventDefault();
        lockScreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lockScreen]);

  return (
    <header className="fixed top-0 left-0 right-0 h-8 z-[9999] select-none flex items-center justify-between px-3 liquid-glass-surface rounded-none border-t-0 border-x-0 border-b border-white/25 backdrop-blur-[22px] backdrop-saturate-[150%] text-xs font-medium text-slate-800 shadow-[inset_0_-1px_1px_rgba(255,255,255,0.3),0_4px_20px_rgba(0,0,0,0.06)]">
      {/* Subtle glass orbs for top bar liquid refraction */}
      <span className="glass-orb glass-orb--one -top-6 left-12 w-28 h-28 opacity-25" />
      <span className="glass-orb glass-orb--two -top-6 right-24 w-28 h-28 opacity-25" />

      {/* Left Menu Items */}
      <div className="relative z-10 flex items-center space-x-3">
        {/* Apple Logo Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsAppleMenuOpen(!isAppleMenuOpen);
              setIsControlCenterOpen(false);
              setIsUserMenuOpen(false);
            }}
            className="p-1 hover:bg-black/5 rounded transition-colors focus:outline-none"
            aria-label="Apple Menu"
          >
            <Apple className="w-3.5 h-3.5 fill-current text-slate-900" />
          </button>

          {isAppleMenuOpen && (
            <div className="liquid-glass-card absolute top-7 left-0 w-64 rounded-2xl shadow-2xl p-1.5 text-slate-800 z-[10000] border border-white/30 backdrop-blur-[22px]">
              <span className="glass-orb glass-orb--one -top-10 -right-8 w-24 h-24 opacity-30" />
              <div className="relative z-10 px-3 py-1.5 font-semibold text-slate-900 border-b border-slate-200/60 text-[11px] flex items-center justify-between">
                <span>Anugamya OS v1.0</span>
                <span className="text-[10px] text-cyan-700 bg-cyan-50/80 px-1.5 py-0.5 rounded border border-cyan-200 font-semibold">
                  NODE FULLSTACK
                </span>
              </div>

              {/* Visitor Intelligence App */}
              <button
                onClick={() => {
                  openWindow('analytics');
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white rounded text-[11px] flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3.5 h-3.5 rounded bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white">
                    <Activity className="w-2.5 h-2.5" />
                  </div>
                  <span>Visitor Intelligence & Logs</span>
                </div>
                <Users className="w-3 h-3 text-cyan-600 group-hover:text-white" />
              </button>

              <button
                onClick={() => {
                  openWindow('system-info');
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white rounded text-[11px] flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center space-x-2">
                  <img src="/icons/settings.png" alt="" className="w-3.5 h-3.5 rounded object-cover" />
                  <span>About This Architecture</span>
                </div>
                <Activity className="w-3 h-3 text-cyan-600 group-hover:text-white" />
              </button>

              <button
                onClick={() => {
                  openWindow('terminal');
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white rounded text-[11px] flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center space-x-2">
                  <img src="/icons/terminal.png" alt="" className="w-3.5 h-3.5 rounded object-cover" />
                  <span>Launch Terminal CLI</span>
                </div>
                <TerminalIcon className="w-3 h-3 text-emerald-600 group-hover:text-white" />
              </button>

              <button
                onClick={() => {
                  openWindow('ai-assistant');
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white rounded text-[11px] flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center space-x-2">
                  <img src="/icons/siri.png" alt="" className="w-3.5 h-3.5 rounded object-cover" />
                  <span>Ask Siri Intelligence</span>
                </div>
                <Bot className="w-3 h-3 text-purple-600 group-hover:text-white" />
              </button>

              <div className="my-1 border-t border-slate-200" />

              {/* Lock Screen & Switch User Actions */}
              <button
                onClick={() => {
                  lockScreen();
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white rounded text-[11px] flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center space-x-2">
                  <Lock className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                  <span>Lock Screen</span>
                </div>
                <span className="text-[10px] text-slate-400 group-hover:text-white font-mono">⌘L</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-rose-600 hover:text-white rounded text-[11px] flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center space-x-2 text-rose-600 group-hover:text-white">
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out Visitor Session</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex items-center space-x-3 text-[11px]">
          <button onClick={() => openWindow('projects')} className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
            Finder
          </button>
          <button onClick={() => openWindow('projects')} className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
            Projects
          </button>
          <button onClick={() => openWindow('analytics')} className="text-slate-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-1">
            <span>Analytics</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>
          <button onClick={() => openWindow('achievements')} className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
            Resume
          </button>
        </div>
      </div>

      {/* Right Control & User Profile Bar */}
      <div className="flex items-center space-x-2.5 text-[11px]">
        {/* Logged in User Profile Pill */}
        {currentUser && (
          <div className="relative">
            <button
              onClick={() => {
                setIsUserMenuOpen(!isUserMenuOpen);
                setIsAppleMenuOpen(false);
                setIsControlCenterOpen(false);
              }}
              className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/70 hover:bg-white border border-slate-300 text-slate-800 transition-all font-semibold shadow-2xs cursor-pointer"
            >
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">
                {isAdmin ? '👑' : currentUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="max-w-[110px] truncate">{currentUser.name}</span>
            </button>

            {isUserMenuOpen && (
              <div className="liquid-glass-card absolute top-7 right-0 w-56 rounded-2xl shadow-2xl p-2.5 text-slate-800 z-[10000] border border-white/30 backdrop-blur-[22px] space-y-2">
                <div className="pb-1.5 border-b border-slate-200">
                  <div className="font-bold text-slate-900 text-xs">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {currentUser.role} • {currentUser.company}
                  </div>
                </div>

                <button
                  onClick={() => {
                    openWindow('analytics');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white text-[11px] flex items-center space-x-2 transition-colors group"
                >
                  <Activity className="w-3.5 h-3.5 text-blue-600 group-hover:text-white" />
                  <span>View Visitor Stats</span>
                </button>

                <button
                  onClick={() => {
                    lockScreen();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white text-[11px] flex items-center space-x-2 transition-colors group"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                  <span>Lock Screen (⌘L)</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-rose-600 hover:text-white text-[11px] text-rose-600 flex items-center space-x-2 transition-colors group"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Switch User</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Latency Telemetry Pill */}
        <div
          onClick={() => openWindow('analytics')}
          className="hidden sm:flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 cursor-pointer hover:bg-emerald-100 transition-all font-semibold"
          title="Edge Latency & Node Telemetry"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[10px]">{telemetry.latencyMs}ms</span>
        </div>

        {/* Sun / Theme Icon */}
        <button
          onClick={() => {
            setIsControlCenterOpen(!isControlCenterOpen);
            setIsAppleMenuOpen(false);
            setIsUserMenuOpen(false);
          }}
          className="p-1 rounded hover:bg-black/5 text-slate-700 transition-colors"
          aria-label="Theme Settings"
        >
          <Sun className="w-3.5 h-3.5 text-slate-700" />
        </button>

        {/* Network Icon */}
        <Wifi className="w-3.5 h-3.5 text-slate-700" />

        {/* Search Icon */}
        <button
          onClick={() => openWindow('terminal')}
          className="p-1 rounded hover:bg-black/5 text-slate-700 transition-colors"
          aria-label="Search / Terminal"
        >
          <Search className="w-3.5 h-3.5 text-slate-700" />
        </button>

        {/* System Date & Clock */}
        <div className="flex items-center space-x-1 font-mono text-slate-700">
          <span>{dateString}</span>
          <span className="text-slate-900 font-semibold">{timeString}</span>
        </div>
      </div>

      {/* Control Center Dropdown */}
      {isControlCenterOpen && (
        <div className="liquid-glass-card absolute top-9 right-3 w-80 rounded-2xl shadow-2xl p-3.5 text-slate-800 z-[10000] border border-white/30 backdrop-blur-[22px] space-y-3">
          <span className="glass-orb glass-orb--one -top-12 -right-8 w-28 h-28 opacity-30" />
          <span className="glass-orb glass-orb--two -bottom-12 -left-8 w-32 h-32 opacity-30" />
          <div className="relative z-10 flex items-center justify-between pb-2 border-b border-slate-200/60">
            <span className="font-bold text-slate-900 text-xs">Display & Effects</span>
            <span className="text-[10px] text-slate-500 font-mono">Control Center</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>Ambient Glow</span>
              <span className="font-mono text-cyan-600 font-bold">{Math.round(ambientLight.intensity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={ambientLight.intensity}
              onChange={(e) => updateAmbientLight({ intensity: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>Backdrop Grain</span>
              <span className="font-mono text-purple-600 font-bold">{Math.round(ambientLight.noiseLevel * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.5"
              step="0.02"
              value={ambientLight.noiseLevel}
              onChange={(e) => updateAmbientLight({ noiseLevel: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>

          {/* Quick Launch Grid */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={() => {
                openWindow('projects');
                setIsControlCenterOpen(false);
              }}
              className="flex items-center space-x-2 p-2 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors text-[10px] text-slate-800 font-medium"
            >
              <img src="/icons/finder.png" alt="" className="w-4 h-4 rounded object-cover shadow-xs" />
              <span>Projects Finder</span>
            </button>
            <button
              onClick={() => {
                openWindow('analytics');
                setIsControlCenterOpen(false);
              }}
              className="flex items-center space-x-2 p-2 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors text-[10px] text-slate-800 font-medium"
            >
              <Activity className="w-4 h-4 text-cyan-600" />
              <span>Visitor Analytics</span>
            </button>
            <button
              onClick={() => {
                openWindow('terminal');
                setIsControlCenterOpen(false);
              }}
              className="flex items-center space-x-2 p-2 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors text-[10px] text-slate-800 font-medium"
            >
              <img src="/icons/terminal.png" alt="" className="w-4 h-4 rounded object-cover shadow-xs" />
              <span>Terminal CLI</span>
            </button>
            <button
              onClick={() => {
                openWindow('ai-assistant');
                setIsControlCenterOpen(false);
              }}
              className="flex items-center space-x-2 p-2 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors text-[10px] text-slate-800 font-medium"
            >
              <img src="/icons/siri.png" alt="" className="w-4 h-4 rounded object-cover shadow-xs" />
              <span>Siri Assistant</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default MenuBar;
