'use client';

import React, { useEffect, useState } from 'react';
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
import { useOSStore } from '@/store/useOSStore';
import { Activity, Folder, Sun, CloudSun, Calendar as CalendarIcon, Clock as ClockIcon } from 'lucide-react';

import { ImagesBadge } from '@/components/ui/images-badge';
import { AnimatedWallpaper } from '@/components/ui/animated-wallpaper';
import { AppleBootScreen } from '@/components/macOS/AppleBootScreen';
import { AnalogClockWidget } from '@/components/ui/analog-clock';
import { CalendarWidget } from '@/components/ui/calendar-widget';
import UserCursor from '@/components/originkit/ui/usercursor-custom-style';
import MeshText from '@/components/originkit/ui/meshtexthover';

const DESKTOP_FOLDERS = [
  {
    id: 'f-1',
    name: 'Paranoia',
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80',
    ],
  },
  {
    id: 'f-2',
    name: 'Vikas Bhi, Virasat Bhi',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80',
    ],
  },
  {
    id: 'f-3',
    name: 'The Last Ember',
    images: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80',
    ],
  },
  {
    id: 'f-4',
    name: 'Xeon Horizon',
    images: [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=400&q=80',
    ],
  },
  {
    id: 'f-5',
    name: 'Echo Motion',
    images: [
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
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

export default function Home() {
  const { windows, openWindow, focusWindow, telemetry } = useOSStore();
  const [isBooting, setIsBooting] = useState(true);
  const [currentTime, setCurrentTime] = useState({
    timeStr: '8:45',
    ampm: 'PM',
    dayStr: 'Thu, Aug 13',
    monthStr: 'AUGUST',
    dateNum: '13',
    weekdayFull: 'Thursday',
    menuDate: 'Thu Aug 13 8:45 PM',
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const mins = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMins = mins < 10 ? `0${mins}` : mins;
      
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayShorts = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const monthShorts = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      setCurrentTime({
        timeStr: `${formattedHours}:${formattedMins}`,
        ampm,
        dayStr: `${dayShorts[now.getDay()]}, ${monthShorts[now.getMonth()]} ${now.getDate()}`,
        monthStr: monthNames[now.getMonth()].toUpperCase(),
        dateNum: `${now.getDate()}`,
        weekdayFull: dayNames[now.getDay()],
        menuDate: `${dayShorts[now.getDay()]} ${monthShorts[now.getMonth()]} ${now.getDate()} ${formattedHours}:${formattedMins} ${ampm}`,
      });
    };

    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut listener: Cmd+K / Ctrl+K opens Terminal CLI
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openWindow('terminal');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openWindow]);

  return (
    <main className="relative w-screen h-screen overflow-hidden select-none bg-slate-100">
      {/* Authentic macOS Startup Boot Screen */}
      <AppleBootScreen />

      {/* Main Desktop Background: Animated Wallpaper */}
      <AnimatedWallpaper imageSrc="/custom-wallpaper.jpg" />

      {/* Top System Menu Bar */}
      <MenuBar />

      {/* Desktop Main Workspace Surface Area */}
      <div className="relative w-full h-[calc(100vh-80px)] top-8 z-10 p-6 flex flex-col justify-between">
        
        {/* Desktop Layout Grid (Folders on left, Hero in middle, Widgets on right) */}
        <div className="grid grid-cols-12 h-full w-full pointer-events-none gap-4">
          
          {/* Left Desktop Folder Items Column */}
          <div className="col-span-3 flex flex-col space-y-7 pt-2 pointer-events-auto z-10">
            {DESKTOP_FOLDERS.map((folder) => (
              <ImagesBadge
                key={folder.id}
                text={folder.name}
                images={folder.images}
                onClick={() => openWindow('projects')}
                folderSize={{ width: 52, height: 38 }}
                hoverImageSize={{ width: 84, height: 56 }}
                className="hover:scale-105 transition-transform"
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
            
            {/* 1. macOS Live Analog Clock Widget */}
            <AnalogClockWidget />

            {/* 2. Weather Widget */}
            <div className="liquid-glass-card w-48 p-3.5 text-slate-900 flex flex-col justify-between select-none">
              <span className="glass-orb glass-orb--one -top-10 -right-8 w-24 h-24 opacity-30" />
              <span className="glass-orb glass-orb--two -bottom-10 -left-8 w-28 h-28 opacity-30" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-light text-slate-900">30°</span>
                  <p className="text-[10px] text-slate-600 font-medium">Partly Cloudy</p>
                </div>
                <Sun className="w-7 h-7 text-amber-500 drop-shadow" />
              </div>
              <span className="relative z-10 text-[9px] text-slate-500 font-mono mt-2">New Delhi, India</span>
            </div>

            {/* 3. macOS Interactive Month Calendar Grid Widget */}
            <CalendarWidget />

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

        {/* 6. System Telemetry Window */}
        <Window id="system-info">
          <div className="p-4 space-y-4 text-xs font-mono text-slate-800">
            <div className="flex items-center space-x-2 text-cyan-600 font-bold text-sm border-b border-slate-200 pb-2">
              <Activity className="w-4 h-4" />
              <span>Real-Time Edge Node Telemetry</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/80 p-3 rounded-lg border border-slate-200 shadow-sm">
                <span className="text-[10px] text-slate-500 uppercase">Target Frame Rate</span>
                <p className="text-base font-bold text-emerald-600 mt-1">{telemetry.fps} FPS (Smoothed)</p>
              </div>
              <div className="bg-white/80 p-3 rounded-lg border border-slate-200 shadow-sm">
                <span className="text-[10px] text-slate-500 uppercase">Edge Connection Latency</span>
                <p className="text-base font-bold text-cyan-600 mt-1">{telemetry.latencyMs} ms</p>
              </div>
              <div className="bg-white/80 p-3 rounded-lg border border-slate-200 shadow-sm">
                <span className="text-[10px] text-slate-500 uppercase">Active Memory</span>
                <p className="text-base font-bold text-purple-600 mt-1">{telemetry.activeMemoryMb} MB</p>
              </div>
              <div className="bg-white/80 p-3 rounded-lg border border-slate-200 shadow-sm">
                <span className="text-[10px] text-slate-500 uppercase">Deployed Region</span>
                <p className="text-base font-bold text-amber-600 mt-1">{telemetry.region}</p>
              </div>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px]">
              Edge Health: {telemetry.edgeStatus} • {telemetry.websocketConnections} active WebSocket connections.
            </div>
          </div>
        </Window>

        {/* 7. Camera & Motion Grid App Window */}
        <Window id="camera">
          <CameraApp />
        </Window>

        {/* 8. Autonomous Tetris AI Game Window */}
        <Window id="tetris">
          <TetrisApp />
        </Window>
      </div>

      {/* Dock Launcher */}
      <Dock />

      {/* Originkit Custom User Cursor Follower */}
      <UserCursor name="Anugamya" />
    </main>
  );
}
