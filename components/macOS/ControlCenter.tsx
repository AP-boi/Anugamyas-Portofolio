'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore } from '@/store/useOSStore';
import {
  Wifi,
  Bluetooth,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Radio,
  Image,
  Sparkles,
  Lock,
  RotateCcw,
  Activity,
  Sliders,
} from 'lucide-react';
import { sounds } from '@/lib/soundEngine';
import { useThemeToggle, ThemeToggleButton } from '@/components/v1/skiper26';

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallpaper: (src: string) => void;
  currentWallpaper: string;
}

const WALLPAPERS = [
  { id: 'w-1', name: 'Custom Sonoma', src: '/custom-wallpaper.jpg', thumb: 'bg-gradient-to-tr from-blue-600 to-indigo-800' },
  { id: 'w-2', name: 'Spider-Man Cyber', src: '/spiderman-wallpaper.jpg', thumb: 'bg-gradient-to-tr from-rose-600 to-red-900' },
];

export const ControlCenter: React.FC<ControlCenterProps> = ({
  isOpen,
  onClose,
  onSelectWallpaper,
  currentWallpaper,
}) => {
  const { telemetry, lockScreen, openWindow } = useOSStore();
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [soundMuted, setSoundMuted] = useState(!sounds.enabled);
  const [brightness, setBrightness] = useState(90);
  const [volume, setVolume] = useState(80);

  const { isDark, toggleTheme } = useThemeToggle({
    variant: 'circle',
    start: 'top-right',
    blur: true,
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="liquid-glass-card fixed top-10 right-4 w-80 rounded-3xl shadow-2xl p-3.5 z-[99995] border border-white/40 backdrop-blur-[30px] bg-white/85 dark:bg-slate-900/85 text-slate-800 dark:text-slate-100 select-none space-y-3"
      >
        {/* Top Toggles Grid (Wi-Fi, Bluetooth, Dark Mode, Sound) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Wi-Fi & Bluetooth Stack */}
          <div className="bg-slate-100/80 dark:bg-slate-800/80 p-2.5 rounded-2xl border border-slate-200/80 dark:border-white/10 space-y-2.5">
            <div
              onClick={() => {
                sounds.playClick();
                setWifiEnabled(!wifiEnabled);
              }}
              className="flex items-center space-x-2.5 cursor-pointer"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors shadow-xs ${
                  wifiEnabled ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}
              >
                <Wifi className="w-3.5 h-3.5" />
              </div>
              <div className="leading-tight">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Wi-Fi</p>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{wifiEnabled ? 'Gigabit Fiber' : 'Off'}</span>
              </div>
            </div>

            <div
              onClick={() => {
                sounds.playClick();
                setBluetoothEnabled(!bluetoothEnabled);
              }}
              className="flex items-center space-x-2.5 cursor-pointer"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors shadow-xs ${
                  bluetoothEnabled ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}
              >
                <Bluetooth className="w-3.5 h-3.5" />
              </div>
              <div className="leading-tight">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Bluetooth</p>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{bluetoothEnabled ? 'AirPods Pro' : 'Off'}</span>
              </div>
            </div>
          </div>

          {/* Theme Mode & Sound FX Stack */}
          <div className="flex flex-col justify-between gap-2">
            {/* Dark/Light Mode View Transition Toggle */}
            <button
              onClick={() => {
                sounds.playClick();
                toggleTheme();
              }}
              className="p-2.5 rounded-2xl border bg-slate-100/80 dark:bg-slate-800/80 border-slate-200 dark:border-white/10 flex items-center justify-between text-left shadow-xs transition-all hover:bg-slate-200/70 dark:hover:bg-slate-700/70 cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isDark ? 'bg-indigo-600 text-white' : 'bg-amber-500 text-white'}`}>
                  {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                </div>
                <div className="leading-tight">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                  </p>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400">
                    {isDark ? 'Active' : 'Sunlight'}
                  </span>
                </div>
              </div>
            </button>

            {/* Sound FX Button */}
            <button
              onClick={() => {
                const isEnabled = sounds.toggleSound();
                setSoundMuted(!isEnabled);
              }}
              className={`p-2.5 rounded-2xl border flex items-center space-x-2 transition-all text-left shadow-xs ${
                !soundMuted
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60 text-blue-800 dark:text-blue-300'
                  : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${!soundMuted ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-600'}`}>
                {soundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </div>
              <div className="leading-tight">
                <p className="text-xs font-bold">UI Audio</p>
                <span className="text-[9px] text-slate-500 dark:text-slate-400">{soundMuted ? 'Muted' : 'Stereo FX'}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Display Brightness Slider */}
        <div className="bg-slate-100/80 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200/80 dark:border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Display Brightness</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{brightness}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        {/* System Sound Slider */}
        <div className="bg-slate-100/80 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200/80 dark:border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-blue-500" />
              <span>System Volume</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{volume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Wallpaper Picker Mini Gallery */}
        <div className="bg-slate-100/80 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200/80 dark:border-white/10 space-y-2">
          <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold tracking-wider flex items-center gap-1">
            <Image className="w-3 h-3 text-purple-600" />
            <span>Wallpapers</span>
          </span>
          <div className="grid grid-cols-2 gap-2">
            {WALLPAPERS.map((wp) => {
              const isSelected = currentWallpaper === wp.src;
              return (
                <button
                  key={wp.id}
                  onClick={() => {
                    sounds.playClick();
                    onSelectWallpaper(wp.src);
                  }}
                  className={`p-1.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg ${wp.thumb} flex-shrink-0 shadow-xs`} />
                  <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate">{wp.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Telemetry Footer */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 px-1">
          <span>Edge Status: <strong className="text-emerald-600 dark:text-emerald-400">ONLINE</strong></span>
          <span>{telemetry.fps} FPS • {telemetry.latencyMs}ms</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ControlCenter;
