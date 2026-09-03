'use client';

import React, { useState } from 'react';
import { useOSStore } from '@/store/useOSStore';
import {
  Wifi,
  Sun,
  Image as ImageIcon,
  Monitor,
  Volume2,
  Battery,
  Settings,
  Check,
  Search,
  ExternalLink,
  Laptop,
  HardDrive,
  Cpu,
  Layers,
  ShieldCheck,
  Moon,
  VolumeX,
  Database,
  RefreshCw,
  Send,
  MessageSquare,
} from 'lucide-react';
import { ThemeToggleButton1 } from '@/components/ui/skiper-ui/skiper4';

export const WALLPAPER_PRESETS = [
  {
    id: 'sonoma',
    name: 'Sonoma Horizon',
    src: '/custom-wallpaper.jpg',
    category: 'Dynamic',
    thumb: '/custom-wallpaper.jpg',
  },
  {
    id: 'spiderman',
    name: 'Spider-Man Cyber',
    src: '/spiderman-wallpaper.jpg',
    category: 'Creative',
    thumb: '/spiderman-wallpaper.jpg',
  },
  {
    id: 'sequoia',
    name: 'Sequoia Forest Mist',
    src: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1600&q=80',
    category: 'Nature',
    thumb: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'nebula',
    name: 'Deep Cosmic Nebula',
    src: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
    category: 'Space',
    thumb: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'liquid-waves',
    name: 'Iridescent Liquid Waves',
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    category: 'Abstract',
    thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'minimal-peak',
    name: 'Obsidian Minimal Peak',
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    category: 'Landscape',
    thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80',
  },
];

const ACCENT_COLORS = [
  { id: 'blue', name: 'Blue', class: 'bg-blue-600' },
  { id: 'purple', name: 'Purple', class: 'bg-purple-600' },
  { id: 'rose', name: 'Pink', class: 'bg-rose-500' },
  { id: 'red', name: 'Red', class: 'bg-red-600' },
  { id: 'orange', name: 'Orange', class: 'bg-orange-500' },
  { id: 'yellow', name: 'Yellow', class: 'bg-amber-400' },
  { id: 'green', name: 'Green', class: 'bg-emerald-600' },
  { id: 'slate', name: 'Graphite', class: 'bg-slate-600' },
];

type SettingsSection = 'appearance' | 'wallpaper' | 'displays' | 'network' | 'sound' | 'battery' | 'general' | 'database';

export const SystemSettingsApp: React.FC = () => {
  const {
    theme,
    toggleTheme,
    brightness,
    setBrightness,
    wallpaper,
    setWallpaper,
    wifiEnabled,
    setWifiEnabled,
    wifiNetwork,
    volume,
    setVolume,
    soundEffects,
    setSoundEffects,
    accentColor,
    setAccentColor,
    nightShift,
    setNightShift,
    currentUser,
  } = useOSStore();

  const [activeSection, setActiveSection] = useState<SettingsSection>('appearance');
  const [searchQuery, setSearchQuery] = useState('');
  const [nightShiftWarmth, setNightShiftWarmth] = useState(40);
  const [trueTone, setTrueTone] = useState(true);
  const [autoTheme, setAutoTheme] = useState(false);

  // Cloud & Supabase DB State
  const [dbTelemetry, setDbTelemetry] = useState<any>(null);
  const [guestbookEntries, setGuestbookEntries] = useState<any[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState(false);
  const [gbAuthor, setGbAuthor] = useState('');
  const [gbMessage, setGbMessage] = useState('');
  const [isSubmittingGb, setIsSubmittingGb] = useState(false);
  const [gbStatusMessage, setGbStatusMessage] = useState<string | null>(null);

  const fetchDatabaseInfo = async () => {
    setIsLoadingDb(true);
    try {
      const [telemetryRes, guestbookRes] = await Promise.all([
        fetch('/api/telemetry'),
        fetch('/api/guestbook'),
      ]);
      const tData = await telemetryRes.json();
      const gData = await guestbookRes.json();
      if (tData.success) setDbTelemetry(tData);
      if (gData.success) setGuestbookEntries(gData.entries || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingDb(false);
    }
  };

  React.useEffect(() => {
    if (activeSection === 'database') {
      fetchDatabaseInfo();
    }
  }, [activeSection]);

  const handleSignGuestbook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gbMessage.trim() || isSubmittingGb) return;
    setIsSubmittingGb(true);
    setGbStatusMessage(null);
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: gbAuthor.trim() || currentUser?.name || 'Portfolio Explorer',
          role: currentUser?.role || 'Visitor',
          company: currentUser?.company || 'Community',
          message: gbMessage.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGbMessage('');
        setGbStatusMessage('✓ Signature recorded in Supabase database!');
        fetchDatabaseInfo();
        setTimeout(() => setGbStatusMessage(null), 3500);
      } else {
        setGbStatusMessage(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setGbStatusMessage(`Error: ${err.message}`);
    } finally {
      setIsSubmittingGb(false);
    }
  };

  const navItems = [
    { id: 'appearance' as SettingsSection, label: 'Appearance', icon: Sun, color: 'bg-blue-500 text-white' },
    { id: 'wallpaper' as SettingsSection, label: 'Wallpaper', icon: ImageIcon, color: 'bg-cyan-500 text-white' },
    { id: 'displays' as SettingsSection, label: 'Displays & Brightness', icon: Monitor, color: 'bg-indigo-500 text-white' },
    { id: 'network' as SettingsSection, label: 'Wi-Fi & Network', icon: Wifi, color: 'bg-blue-600 text-white' },
    { id: 'sound' as SettingsSection, label: 'Sound', icon: Volume2, color: 'bg-red-500 text-white' },
    { id: 'battery' as SettingsSection, label: 'Battery', icon: Battery, color: 'bg-emerald-500 text-white' },
    { id: 'database' as SettingsSection, label: 'Cloud & Supabase DB', icon: Database, color: 'bg-emerald-600 text-white' },
    { id: 'general' as SettingsSection, label: 'General / About', icon: Settings, color: 'bg-slate-500 text-white' },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full w-full bg-white/95 dark:bg-slate-950 text-slate-900 dark:text-slate-100 select-none overflow-hidden font-sans transition-colors">
      {/* Sidebar Navigation */}
      <div className="w-56 sm:w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/70 p-2.5 flex flex-col flex-shrink-0">
        {/* Search bar */}
        <div className="mb-2 px-1">
          <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 shadow-inner">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Section links */}
        <div className="flex-1 overflow-y-auto space-y-0.5 pr-0.5">
          {filteredNavItems.map((item) => {
            const isSelected = activeSection === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-2.5 cursor-pointer ${isSelected
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <Icon className="w-3 h-3" />
                </div>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* 1. APPEARANCE SECTION */}
        {activeSection === 'appearance' && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Appearance</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customize your system look, accent colors, and dark mode preferences
              </p>
            </div>

            {/* Theme Toggle Card */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                Appearance Theme
              </span>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ThemeToggleButton1
                    isDark={theme === 'dark'}
                    onToggle={toggleTheme}
                    className="w-10 h-10 cursor-pointer shadow-md"
                    title="Toggle System Theme"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {theme === 'dark' ? 'Dark Mode Active' : 'Light Mode Active'}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Changes the visual theme across every single app and desktop interface
                    </p>
                  </div>
                </div>

                <button
                  onClick={toggleTheme}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                </button>
              </div>
            </div>

            {/* Accent Color Picker */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                    Accent Color
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Select highlight and button tinting throughout apps
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-1">
                {ACCENT_COLORS.map((c) => {
                  const isSelected = accentColor === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setAccentColor(c.id)}
                      className={`w-6 h-6 rounded-full ${c.class} flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500 ring-offset-white dark:ring-offset-slate-900 shadow-md' : 'opacity-85'
                        }`}
                      title={c.name}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white font-bold" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Automatic Sunset Mode */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Auto-Switch at Sunset</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Automatically activate dark mode based on local time
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoTheme}
                onChange={(e) => setAutoTheme(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* 2. WALLPAPER SECTION */}
        {activeSection === 'wallpaper' && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Wallpaper</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose a desktop picture or curated animated wallpaper
              </p>
            </div>

            {/* Current Active Wallpaper Banner */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-md h-40 bg-slate-950 flex items-end p-4">
              <img
                src={wallpaper}
                alt="Current Wallpaper"
                className="absolute inset-0 w-full h-full object-cover brightness-90"
              />
              <div className="relative z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-white text-xs">
                <span className="font-semibold">Current Desktop: </span>
                <span className="text-slate-200">
                  {WALLPAPER_PRESETS.find((w) => w.src === wallpaper)?.name || 'Custom Wallpaper'}
                </span>
              </div>
            </div>

            {/* Preset Gallery Grid */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                Curated Wallpapers
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {WALLPAPER_PRESETS.map((wp) => {
                  const isSelected = wallpaper === wp.src;
                  return (
                    <div
                      key={wp.id}
                      onClick={() => setWallpaper(wp.src)}
                      className={`group cursor-pointer rounded-xl overflow-hidden border-2 transition-all shadow-xs ${isSelected
                          ? 'border-blue-600 ring-2 ring-blue-500/40 scale-[1.02]'
                          : 'border-slate-200 dark:border-slate-800 hover:border-blue-400'
                        }`}
                    >
                      <div className="h-24 overflow-hidden relative">
                        <img
                          src={wp.thumb}
                          alt={wp.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div className="p-2 bg-slate-50 dark:bg-slate-900 flex items-center justify-between text-xs">
                        <span className="font-medium truncate text-slate-800 dark:text-slate-200">{wp.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">{wp.category}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3. DISPLAYS & BRIGHTNESS SECTION */}
        {activeSection === 'displays' && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Displays & Brightness</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Adjust screen brightness, resolution, and eye comfort
              </p>
            </div>

            {/* Real Brightness Slider Card */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Display Brightness</span>
                </span>
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                  {brightness}%
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <Sun className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <Sun className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Controls overall desktop and monitor illumination in real time
              </p>
            </div>

            {/* Night Shift Card */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Moon className="w-4 h-4 text-indigo-500" />
                    <span>Night Shift</span>
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Warm color temperature for reduced eye strain during evening hours
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={nightShift}
                  onChange={(e) => setNightShift(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                />
              </div>

              {nightShift && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>Color Warmth</span>
                    <span>{nightShiftWarmth}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={nightShiftWarmth}
                    onChange={(e) => setNightShiftWarmth(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                </div>
              )}
            </div>

            {/* Display Specifications Card */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                Display Hardware
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400">Resolution</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Liquid Retina XDR (3024 × 1964)</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400">Refresh Rate</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">120Hz ProMotion Adaptive</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. NETWORK & WI-FI SECTION */}
        {activeSection === 'network' && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Wi-Fi & Network</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage wireless connections, IP routing, and DNS settings
              </p>
            </div>

            {/* Wi-Fi Master Toggle */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${wifiEnabled ? 'bg-blue-600 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-500'}`}>
                  <Wifi className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Wi-Fi Wireless Networking</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {wifiEnabled ? `Connected to ${wifiNetwork}` : 'Wi-Fi is turned off'}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={wifiEnabled}
                onChange={(e) => setWifiEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Active Network Details */}
            {wifiEnabled && (
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <Wifi className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{wifiNetwork}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-semibold">
                      Connected (5 GHz)
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">Signal: Excellent</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400">IP Address</span>
                    <p className="font-mono font-semibold text-slate-800 dark:text-slate-200 mt-0.5">192.168.1.108</p>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400">Router</span>
                    <p className="font-mono font-semibold text-slate-800 dark:text-slate-200 mt-0.5">192.168.1.1</p>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400">Security</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">WPA3 Personal</p>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400">DNS Server</span>
                    <p className="font-mono font-semibold text-slate-800 dark:text-slate-200 mt-0.5">1.1.1.1 (Cloudflare)</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. SOUND SECTION */}
        {activeSection === 'sound' && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Sound</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure output volume, alert chimes, and audio hardware
              </p>
            </div>

            {/* Output Volume Card */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  {volume === 0 ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-red-500" />}
                  <span>Output Volume</span>
                </span>
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{volume}%</span>
              </div>

              <div className="flex items-center space-x-3">
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
                <Volume2 className="w-4 h-4 text-red-500" />
              </div>
            </div>

            {/* Audio Feedback Checkbox */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">User Interface Sound Effects</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Play acoustic feedback on window close, click, and alerts
                </p>
              </div>
              <input
                type="checkbox"
                checked={soundEffects}
                onChange={(e) => setSoundEffects(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 accent-red-600 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* 6. BATTERY SECTION */}
        {activeSection === 'battery' && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Battery</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monitor power source, health, and energy optimization
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                    <Battery className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">100% Fully Charged</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Power Adapter Connected (MagSafe 3)</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-700">
                  Normal Health (100%)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 7. GENERAL / ABOUT SECTION */}
        {activeSection === 'general' && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">About This Mac</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                System overview, processor architecture, and software specifications
              </p>
            </div>

            {/* Apple Device Card */}
            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center shadow-lg flex-shrink-0">
                <Laptop className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-950 dark:text-white">MacBook Pro (16-inch, 2024)</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                  Apple M3 Max • 64 GB Unified Memory
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  macOS Sonoma Version 14.4.1 (Build 23E224)
                </p>
              </div>
            </div>

            {/* Hardware Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400 font-semibold text-[10px] uppercase">
                  <Cpu className="w-3.5 h-3.5 text-blue-500" />
                  <span>Processor</span>
                </div>
                <p className="font-bold text-slate-900 dark:text-white">16-core CPU</p>
                <p className="text-[11px] text-slate-500">40-core GPU / 16-core NPU</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400 font-semibold text-[10px] uppercase">
                  <Layers className="w-3.5 h-3.5 text-purple-500" />
                  <span>Memory</span>
                </div>
                <p className="font-bold text-slate-900 dark:text-white">64 GB LPDDR5</p>
                <p className="text-[11px] text-slate-500">400 GB/s Memory Bandwidth</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400 font-semibold text-[10px] uppercase">
                  <HardDrive className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Storage</span>
                </div>
                <p className="font-bold text-slate-900 dark:text-white">2 TB NVMe SSD</p>
                <p className="text-[11px] text-slate-500">512 GB available</p>
              </div>
            </div>

            {/* Author Credit */}
            <div className="p-3.5 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  Engineered by <strong>Anugamya</strong> (Portfolio OS Simulator)
                </span>
              </div>
              <a
                href="https://github.com/AP-boi"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] transition-colors flex items-center gap-1"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* 8. Cloud & Supabase DB Section */}
        {activeSection === 'database' && (
          <div className="space-y-4 max-w-2xl animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-xl font-serif font-medium tracking-tight text-slate-900 dark:text-white">
                  Cloud &amp; Supabase Database
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Live PostgreSQL persistence, session telemetry, and public guestbook
                </p>
              </div>
              <button
                onClick={fetchDatabaseInfo}
                disabled={isLoadingDb}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 btn-tactile"
                title="Refresh Cloud Telemetry"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingDb ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {/* Cloud Connection Status Card */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-tactile space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold font-mono text-slate-900 dark:text-white uppercase">
                    Status: {dbTelemetry?.database?.status || 'CONNECTED'}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {dbTelemetry?.database?.isCloudConfigured ? 'SUPABASE POSTGRESQL' : 'LOCAL RESILIENT FALLBACK'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
                <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-[9px] text-slate-500 uppercase">QUERY PING</span>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {dbTelemetry?.database?.latencyMs ?? 2} ms
                  </div>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-[9px] text-slate-500 uppercase">TOTAL VISITORS</span>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                    {dbTelemetry?.telemetry?.totalVisitors || 0}
                  </div>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-[9px] text-slate-500 uppercase">TODAY VISITS</span>
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                    {dbTelemetry?.telemetry?.todayVisits || 0}
                  </div>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-[9px] text-slate-500 uppercase">GUESTBOOK ROWS</span>
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                    {guestbookEntries.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Sign Guestbook Form */}
            <form
              onSubmit={handleSignGuestbook}
              className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-tactile space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                  <span>Leave a Guestbook Signature</span>
                </span>
                {gbStatusMessage && (
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold animate-fadeIn">
                    {gbStatusMessage}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Your Name (e.g. Jane Doe)"
                  value={gbAuthor}
                  onChange={(e) => setGbAuthor(e.target.value)}
                  className="sm:col-span-1 p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Write a message or impression on the portfolio..."
                  value={gbMessage}
                  onChange={(e) => setGbMessage(e.target.value)}
                  className="sm:col-span-2 p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500 font-mono">
                  Stored directly in Supabase public.guestbook table
                </span>
                <button
                  type="submit"
                  disabled={!gbMessage.trim() || isSubmittingGb}
                  className="px-3.5 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-40 transition-all btn-tactile flex items-center gap-1.5 shadow-tactile"
                >
                  <Send className="w-3 h-3" />
                  <span>{isSubmittingGb ? 'Submitting...' : 'Sign Guestbook'}</span>
                </button>
              </div>
            </form>

            {/* Verified Signatures Feed */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-tactile space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Recent Verified Signatures ({guestbookEntries.length})
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Real-time feed</span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {guestbookEntries.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No signatures found. Be the first to sign!</p>
                ) : (
                  guestbookEntries.map((item: any) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {item.author} {item.company ? `(${item.company})` : ''}
                        </span>
                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                        "{item.message}"
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemSettingsApp;
