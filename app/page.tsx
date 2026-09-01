'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { MenuBar } from '@/components/macOS/MenuBar';
import { Dock } from '@/components/macOS/Dock';
import { Window } from '@/components/macOS/Window';
import { AchievementsApp } from '@/components/apps/AchievementsApp';
import { ProjectsApp } from '@/components/apps/ProjectsApp';
import { TerminalApp } from '@/components/apps/TerminalApp';
import { GitHubApp } from '@/components/apps/GitHubApp';
import { AIAssistantDrawer } from '@/components/apps/AIAssistantDrawer';
import { CameraApp } from '@/components/apps/CameraApp';
import TetrisApp from '@/components/apps/TetrisApp';
import { AnalyticsApp } from '@/components/apps/AnalyticsApp';
import { useOSStore } from '@/store/useOSStore';

import { ImagesBadge } from '@/components/ui/images-badge';
import { AnimatedWallpaper } from '@/components/ui/animated-wallpaper';
import { BootScreen } from '@/components/macOS/BootScreen';
import { MacOSLockScreen } from '@/components/macOS/MacOSLockScreen';
import { SpotlightSearch } from '@/components/macOS/SpotlightSearch';
import { Launchpad } from '@/components/macOS/Launchpad';
import { ControlCenter } from '@/components/macOS/ControlCenter';
import { DesktopContextMenu } from '@/components/macOS/DesktopContextMenu';
import { DesktopMarquee } from '@/components/ui/DesktopMarquee';
import { AnalogClockWidget } from '@/components/ui/analog-clock';
import { CalendarWidget } from '@/components/ui/calendar-widget';
import UserCursor from '@/components/originkit/ui/usercursor-custom-style';
import MeshText from '@/components/originkit/ui/meshtexthover';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Activity, Sun } from 'lucide-react';
import { sounds } from '@/lib/soundEngine';

const DESKTOP_FOLDERS = [
  {
    id: 'f-1',
    name: 'Bharat Dekho',
    images: [
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80',
    ],
  },
  {
    id: 'f-2',
    name: 'Cyber Ascension',
    images: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
    ],
  },
  {
    id: 'f-3',
    name: 'Portfolio OS',
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80',
    ],
  },
  {
    id: 'f-4',
    name: 'AirPure Delhi',
    images: [
      'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=400&q=80',
    ],
  },
  {
    id: 'f-5',
    name: 'Gravity Client',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
    ],
  },
  {
    id: 'f-6',
    name: 'Anugamya Studio',
    images: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
    ],
  },
];

const WALLPAPERS = ['/custom-wallpaper.jpg', '/spiderman-wallpaper.jpg'];

export default function Home() {
  const { openWindow, telemetry, currentUser, isLocked, lockScreen } = useOSStore();
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isLaunchpadOpen, setIsLaunchpadOpen] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; isOpen: boolean }>({
    x: 0,
    y: 0,
    isOpen: false,
  });

  // Track initial visit in Node.js backend
  useEffect(() => {
    fetch('/api/visitors/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'visit' }),
    }).catch(() => {});
  }, []);

  // Keyboard Shortcuts (⌘Space, ⌘K, ⌘L, F4 Launchpad)
  useKeyboardShortcuts({
    onToggleSpotlight: () => setIsSpotlightOpen((prev) => !prev),
  });

  // F4 Key opens Launchpad
  useEffect(() => {
    const handleF4 = (e: KeyboardEvent) => {
      if (e.key === 'F4') {
        e.preventDefault();
        setIsLaunchpadOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleF4);
    return () => window.removeEventListener('keydown', handleF4);
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.liquid-glass-surface') || target.closest('button') || target.closest('input')) {
      return;
    }
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      isOpen: true,
    });
  }, []);

  const handleCycleWallpaper = () => {
    sounds.playClick();
    setWallpaperIndex((prev) => (prev + 1) % WALLPAPERS.length);
  };

  const handleSelectWallpaper = (src: string) => {
    const idx = WALLPAPERS.indexOf(src);
    if (idx !== -1) {
      setWallpaperIndex(idx);
    }
  };

  return (
    <main
      onContextMenu={handleContextMenu}
      className="relative w-screen h-screen overflow-hidden select-none bg-slate-100"
    >
      {/* Authentic Anugamya OS Startup Boot Screen */}
      <BootScreen
        onComplete={() => {
          if (!currentUser) {
            lockScreen();
          }
        }}
      />

      {/* macOS Sonoma Interactive Lock Screen */}
      <MacOSLockScreen />

      {/* Spotlight Search Overlay (⌘Space) */}
      <SpotlightSearch
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
      />

      {/* Launchpad App Drawer Overlay (F4) */}
      <Launchpad
        isOpen={isLaunchpadOpen}
        onClose={() => setIsLaunchpadOpen(false)}
      />

      {/* Control Center Panel */}
      <ControlCenter
        isOpen={isControlCenterOpen}
        onClose={() => setIsControlCenterOpen(false)}
        onSelectWallpaper={handleSelectWallpaper}
        currentWallpaper={WALLPAPERS[wallpaperIndex]}
      />

      {/* Desktop Right-Click Context Menu */}
      <DesktopContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        isOpen={contextMenu.isOpen}
        onClose={() => setContextMenu((prev) => ({ ...prev, isOpen: false }))}
        onChangeWallpaper={handleCycleWallpaper}
      />

      {/* Desktop Tactile Selection Marquee Box */}
      <DesktopMarquee />

      {/* Main Desktop Background: Animated Wallpaper */}
      <AnimatedWallpaper imageSrc={WALLPAPERS[wallpaperIndex]} />

      {/* Top System Menu Bar with Dynamic Island */}
      <MenuBar
        onToggleSpotlight={() => setIsSpotlightOpen((prev) => !prev)}
        onToggleControlCenter={() => setIsControlCenterOpen((prev) => !prev)}
      />

      {/* Desktop Main Workspace Surface Area */}
      <div className="relative w-full h-[calc(100vh-80px)] top-8 z-10 p-6 flex flex-col justify-between">
        <div className="grid grid-cols-12 h-full w-full pointer-events-none gap-4">
          
          {/* Left Desktop Folders Column */}
          <div className="col-span-3 flex flex-col space-y-7 pt-2 pointer-events-auto z-10">
            {DESKTOP_FOLDERS.map((folder) => (
              <ImagesBadge
                key={folder.id}
                text={folder.name}
                images={folder.images}
                onClick={() => {
                  sounds.playWindowOpen();
                  openWindow('projects');
                }}
                folderSize={{ width: 52, height: 38 }}
                hoverImageSize={{ width: 84, height: 56 }}
                className="hover:scale-105 transition-transform cursor-pointer"
              />
            ))}
          </div>

          {/* Center Desktop Hero Title Section */}
          <div className="col-span-6 flex flex-col items-center justify-center text-center pointer-events-auto select-none z-10">
            <h2 className="text-2xl md:text-3xl font-light text-slate-800 tracking-wide drop-shadow-xs">
              Hey, I'm <span className="font-semibold text-slate-950">Anugamya</span>! Welcome to my
            </h2>
            <div className="w-full max-w-[620px] h-[160px] md:h-[200px] -mt-2">
              <MeshText
                text="portfolio"
                color="#0f172a"
                colorSplit={true}
                customColors={["#2563eb", "#0284c7"]}
                force={22}
                font={{
                  fontFamily: "Dancing Script",
                  fontSize: 140,
                  fontWeight: 700,
                  variant: "Bold",
                }}
              />
            </div>
          </div>

          {/* Right Desktop Widgets Column */}
          <div className="col-span-3 flex flex-col items-end space-y-4 pt-2 pointer-events-auto z-10">
            <AnalogClockWidget />

            <div className="liquid-glass-card w-48 p-3.5 text-slate-900 flex flex-col justify-between select-none">
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-light text-slate-900">30°</span>
                  <p className="text-[10px] text-slate-600 font-medium">Partly Cloudy</p>
                </div>
                <Sun className="w-7 h-7 text-amber-500 drop-shadow" />
              </div>
              <span className="relative z-10 text-[9px] text-slate-500 font-mono mt-2">New Delhi, India</span>
            </div>

            <CalendarWidget />
          </div>
        </div>
      </div>

      {/* Window Containers Ecosystem */}

      {/* 1. Projects.app / Finder Window */}
      <Window id="projects">
        <ProjectsApp />
      </Window>

      {/* 2. Achievements.app Window */}
      <Window id="achievements">
        <AchievementsApp />
      </Window>

      {/* 3. Terminal.app CLI Window */}
      <Window id="terminal">
        <TerminalApp />
      </Window>

      {/* 4. GitHub Telemetry & Metrics Window */}
      <Window id="github">
        <GitHubApp />
      </Window>

      {/* 5. Portfolio AI Assistant Window */}
      <Window id="ai-assistant">
        <AIAssistantDrawer />
      </Window>

      {/* 6. Visitor Intelligence & Login Tracker Window */}
      <Window id="analytics">
        <AnalyticsApp />
      </Window>

      {/* 7. System Telemetry Window */}
      <Window id="system-info">
        <div className="p-4 space-y-4 text-xs font-mono text-slate-800 bg-white/95 h-full">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
              <Activity className="w-4 h-4 text-cyan-600" />
              <span>Real-Time Edge Node Telemetry</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
              SYSTEM ONLINE
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Target Frame Rate</span>
              <p className="text-base font-bold text-emerald-600 mt-1">{telemetry.fps} FPS (Smoothed)</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Edge Connection Latency</span>
              <p className="text-base font-bold text-cyan-600 mt-1">{telemetry.latencyMs} ms</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Active Memory</span>
              <p className="text-base font-bold text-purple-600 mt-1">{telemetry.activeMemoryMb} MB</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Deployed Region</span>
              <p className="text-base font-bold text-amber-600 mt-1">{telemetry.region}</p>
            </div>
          </div>
          <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-emerald-800 text-[11px] flex items-center justify-between">
            <span>Edge Health: <strong>{telemetry.edgeStatus}</strong></span>
            <span><strong>{telemetry.websocketConnections}</strong> active WebSockets</span>
          </div>
        </div>
      </Window>

      {/* 9. Camera & Motion Grid App Window */}
      <Window id="camera">
        <CameraApp />
      </Window>

      {/* 10. Autonomous Tetris AI Game Window */}
      <Window id="tetris">
        <TetrisApp />
      </Window>

      {/* Dock Launcher */}
      <Dock onOpenLaunchpad={() => setIsLaunchpadOpen(true)} />

      {/* Custom User Cursor Follower */}
      <UserCursor name={currentUser?.name || "Anugamya"} />
    </main>
  );
}
