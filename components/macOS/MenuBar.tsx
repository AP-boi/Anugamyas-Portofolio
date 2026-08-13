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
  Search
} from 'lucide-react';

export const MenuBar: React.FC = () => {
  const { activeAppId, windows, telemetry, ambientLight, openWindow, updateAmbientLight } = useOSStore();
  const [timeString, setTimeString] = useState<string>('');
  const [dateString, setDateString] = useState<string>('');
  const [batteryLevel, setBatteryLevel] = useState<number>(98);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState<boolean>(false);
  const [isAppleMenuOpen, setIsAppleMenuOpen] = useState<boolean>(false);

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

    // Battery API detection (fallback graceful if unsupported)
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

  const activeAppTitle = activeAppId ? APP_REGISTRY[activeAppId]?.title || 'Finder' : 'Finder';

  return (
    <header className="fixed top-0 left-0 right-0 h-8 z-[9999] select-none flex items-center justify-between px-3 bg-white/60 backdrop-blur-3xl backdrop-saturate-200 border-b border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] ring-1 ring-white/40 text-xs font-medium text-slate-800">
      {/* Left Menu Items */}
      <div className="flex items-center space-x-3">
        {/* Apple Logo Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsAppleMenuOpen(!isAppleMenuOpen);
              setIsControlCenterOpen(false);
            }}
            className="p-1 hover:bg-black/5 rounded transition-colors focus:outline-none"
            aria-label="Apple Menu"
          >
            <Apple className="w-3.5 h-3.5 fill-current text-slate-900" />
          </button>

          {isAppleMenuOpen && (
            <div className="absolute top-7 left-0 w-56 bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-lg shadow-2xl p-1 text-slate-800 z-[10000]">
              <div className="px-3 py-1.5 font-semibold text-slate-900 border-b border-slate-200 text-[11px] flex items-center justify-between">
                <span>Anugamya OS v1.0</span>
                <span className="text-[10px] text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200 font-semibold">PROD</span>
              </div>
              <button
                onClick={() => {
                  openWindow('system-info');
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white rounded text-[11px] flex items-center justify-between transition-colors group"
              >
                <span>About This Architecture</span>
                <Activity className="w-3 h-3 text-cyan-600 group-hover:text-white" />
              </button>
              <button
                onClick={() => {
                  openWindow('terminal');
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white rounded text-[11px] flex items-center justify-between transition-colors group"
              >
                <span>Launch Terminal CLI</span>
                <TerminalIcon className="w-3 h-3 text-emerald-600 group-hover:text-white" />
              </button>
              <button
                onClick={() => {
                  openWindow('ai-assistant');
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white rounded text-[11px] flex items-center justify-between transition-colors group"
              >
                <span>Ask AI Assistant</span>
                <Bot className="w-3 h-3 text-purple-600 group-hover:text-white" />
              </button>
              <div className="my-1 border-t border-slate-200" />
              <button
                onClick={() => window.open('https://github.com/AP-boi', '_blank')}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white rounded text-[11px] flex items-center justify-between transition-colors group"
              >
                <span>View Source on GitHub</span>
                <Github className="w-3 h-3 text-slate-500 group-hover:text-white" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation Items Matching Reference Image */}
        <div className="flex items-center space-x-3 text-[11px]">
          <button onClick={() => openWindow('projects')} className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
            Finder
          </button>
          <button onClick={() => openWindow('projects')} className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
            Projects
          </button>
          <button onClick={() => openWindow('ai-assistant')} className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
            Contact
          </button>
          <button onClick={() => openWindow('achievements')} className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
            Resume
          </button>
        </div>
      </div>

      {/* Right Control & Telemetry Bar */}
      <div className="flex items-center space-x-3 text-[11px]">
        {/* Latency & Edge Status Telemetry Pill */}
        <div
          onClick={() => openWindow('system-info')}
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
        <div className="absolute top-9 right-3 w-72 bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-xl shadow-2xl p-3 text-slate-800 z-[10000] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="font-bold text-slate-900 text-xs">System Controls</span>
            <span className="text-[10px] text-slate-500">WebGL Shader Controls</span>
          </div>

          {/* Shader Light Intensity Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>Ambient Glow Intensity</span>
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

          {/* Noise Level Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>Liquid Noise Grain</span>
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
              <FolderGit2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Projects Finder</span>
            </button>
            <button
              onClick={() => {
                openWindow('achievements');
                setIsControlCenterOpen(false);
              }}
              className="flex items-center space-x-2 p-2 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors text-[10px] text-slate-800 font-medium"
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Achievements</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
