'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
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
import { SystemSettingsApp } from '@/components/apps/SystemSettingsApp';
import { useOSStore } from '@/store/useOSStore';

import { ImagesBadge } from '@/components/ui/images-badge';
import { AnimatedWallpaper } from '@/components/ui/animated-wallpaper';
import { BootScreen } from '@/components/macOS/BootScreen';
import { MacOSLockScreen } from '@/components/macOS/MacOSLockScreen';
import { SpotlightSearch } from '@/components/macOS/SpotlightSearch';
import { ControlCenter } from '@/components/macOS/ControlCenter';
import { DesktopContextMenu } from '@/components/macOS/DesktopContextMenu';
import { DesktopMarquee } from '@/components/ui/DesktopMarquee';
import { AnalogClockWidget } from '@/components/ui/analog-clock';
import { CalendarWidget } from '@/components/ui/calendar-widget';
import UserCursor from '@/components/originkit/ui/usercursor-custom-style';
import MeshText from '@/components/originkit/ui/meshtexthover';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Sun } from 'lucide-react';
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

const WALLPAPERS_LIST = [
  '/custom-wallpaper.jpg',
  '/spiderman-wallpaper.jpg',
  'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
];

export default function Home() {
  const {
    openWindow,
    currentUser,
    isLocked,
    lockScreen,
    brightness,
    theme,
    toggleTheme,
    wallpaper,
    setWallpaper,
    nightShift,
  } = useOSStore();

  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; isOpen: boolean }>({
    x: 0,
    y: 0,
    isOpen: false,
  });

  // Keyboard Shortcuts (⌘Space, ⌘K, ⌘L)
  useKeyboardShortcuts({
    onToggleSpotlight: () => setIsSpotlightOpen((prev) => !prev),
  });

  // Global listeners: lock viewport scroll to prevent any header or screen shift on right-click or window open
  useEffect(() => {
    const preventDefaultContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('input') && !target.closest('textarea')) {
        e.preventDefault();
      }
    };

    const lockViewportScroll = () => {
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0);
      }
      const main = document.querySelector('main');
      if (main && main.scrollTop !== 0) {
        main.scrollTop = 0;
      }
    };

    window.addEventListener('contextmenu', preventDefaultContextMenu, { passive: false });
    window.addEventListener('scroll', lockViewportScroll, { passive: true });
    return () => {
      window.removeEventListener('contextmenu', preventDefaultContextMenu);
      window.removeEventListener('scroll', lockViewportScroll);
    };
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLElement;
    if (target.closest('.liquid-glass-surface') || target.closest('button') || target.closest('input')) {
      return;
    }
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      isOpen: true,
    });
  }, []);

  const handleCycleWallpaper = () => {
    const currentIdx = WALLPAPERS_LIST.indexOf(wallpaper);
    const nextIdx = (currentIdx + 1) % WALLPAPERS_LIST.length;
    setWallpaper(WALLPAPERS_LIST[nextIdx]);
  };

  const handleSelectWallpaper = (src: string) => {
    setWallpaper(src);
  };

  return (
    <main
      onContextMenu={handleContextMenu}
      className="fixed inset-0 w-full h-full overflow-hidden select-none bg-slate-100"
    >
      {/* Top System Menu Bar with Dynamic Island - Always Fixed at Top */}
      <MenuBar
        onToggleSpotlight={() => setIsSpotlightOpen((prev) => !prev)}
        onToggleControlCenter={() => setIsControlCenterOpen((prev) => !prev)}
      />

      {/* Main Desktop Background: Animated Wallpaper */}
      <AnimatedWallpaper imageSrc={wallpaper} />

      {/* Dynamic Display Dimmer Overlay for Live Brightness Control */}
      {brightness < 100 && (
        <div
          className="pointer-events-none fixed inset-0 z-[99990] bg-black transition-opacity duration-200"
          style={{ opacity: ((100 - brightness) / 100) * 0.72 }}
        />
      )}

      {/* Real Night Shift Eye Comfort Filter */}
      {nightShift && (
        <div className="pointer-events-none fixed inset-0 z-[99989] bg-amber-500/15 mix-blend-multiply transition-opacity duration-300" />
      )}

      {/* Desktop Tactile Selection Marquee Box */}
      <DesktopMarquee />

      {/* Desktop Right-Click Context Menu */}
      <DesktopContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        isOpen={contextMenu.isOpen}
        onClose={() => setContextMenu((prev) => ({ ...prev, isOpen: false }))}
        onChangeWallpaper={handleCycleWallpaper}
      />

      {/* Spotlight Universal Search Modal (⌘Space) */}
      <SpotlightSearch
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
      />

      {/* Control Center Panel */}
      <ControlCenter
        isOpen={isControlCenterOpen}
        onClose={() => setIsControlCenterOpen(false)}
        onSelectWallpaper={handleSelectWallpaper}
        currentWallpaper={wallpaper}
      />

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

      {/* Desktop Main Workspace Surface Area */}
      <div className="relative w-full h-[calc(100vh-80px)] top-8 z-10 p-6 flex flex-col justify-between">
        <div className="grid grid-cols-12 h-full w-full pointer-events-none gap-4">
          
          {/* Left Desktop Folders Column - Fully Moveable & Draggable */}
          <div className="col-span-3 hidden md:flex flex-col space-y-6 pt-2 pointer-events-auto z-10">
            {DESKTOP_FOLDERS.map((folder) => (
              <motion.div
                key={folder.id}
                drag
                dragMomentum={false}
                dragElastic={0}
                whileDrag={{ scale: 1.06, zIndex: 60 }}
                className="w-fit cursor-grab active:cursor-grabbing select-none"
              >
                <ImagesBadge
                  text={folder.name}
                  images={folder.images}
                  onClick={() => {
                    openWindow('projects');
                  }}
                  folderSize={{ width: 52, height: 38 }}
                  hoverImageSize={{ width: 84, height: 56 }}
                  className="hover:scale-105 transition-transform"
                />
              </motion.div>
            ))}
          </div>

          {/* Center Desktop Hero Title Section */}
          <div className="col-span-12 md:col-span-6 flex flex-col items-center justify-center text-center pointer-events-auto select-none z-10">
            <h2 className="text-2xl md:text-3xl font-light text-slate-800 dark:text-slate-200 tracking-wide drop-shadow-xs transition-colors">
              Hey, I'm <span className="font-semibold text-slate-950 dark:text-white">Anugamya</span>! Welcome to my
            </h2>
            <div className="w-full max-w-[620px] h-[160px] md:h-[200px] -mt-2">
              <MeshText
                text="portfolio"
                color={theme === 'dark' ? "#f8fafc" : "#0f172a"}
                colorSplit={true}
                customColors={["#3b82f6", "#06b6d4"]}
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
          <div className="col-span-3 hidden lg:flex flex-col items-end space-y-4 pt-2 pointer-events-auto z-10">
            <AnalogClockWidget />

            <div className="liquid-glass-card dark:bg-slate-900/80 dark:border-slate-700/80 w-48 p-3.5 text-slate-900 dark:text-slate-100 flex flex-col justify-between select-none transition-colors">
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-light text-slate-900 dark:text-white">30°</span>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Partly Cloudy</p>
                </div>
                <Sun className="w-7 h-7 text-amber-500 drop-shadow" />
              </div>
              <span className="relative z-10 text-[9px] text-slate-500 dark:text-slate-400 font-mono mt-2">New Delhi, India</span>
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

      {/* 6. System Settings App Window */}
      <Window id="system-info">
        <SystemSettingsApp />
      </Window>

      {/* 7. Camera & Motion Grid App Window */}
      <Window id="camera">
        <CameraApp />
      </Window>

      {/* 8. Autonomous Tetris AI Game Window */}
      <Window id="tetris">
        <TetrisApp />
      </Window>

      {/* Dock */}
      <Dock />

      {/* Custom User Cursor Follower */}
      <UserCursor name={currentUser?.name || "Anugamya"} />
    </main>
  );
}
