import { create } from 'zustand';
import {
  AppId,
  WindowState,
  AppMetadata,
  TelemetryData,
  AmbientLightState,
  WindowPosition,
  WindowSize,
  VisitorSession,
} from '@/types/os';

export const APP_REGISTRY: Record<AppId, AppMetadata> = {
  achievements: {
    id: 'achievements',
    title: 'Notes — Achievements',
    description: 'Scrollytelling timeline of accomplishments, hackathons, and certifications',
    iconName: 'FileText',
    iconSrc: '/icons/notes.png',
    defaultPosition: { x: 80, y: 60 },
    defaultSize: { width: 920, height: 640 },
  },
  projects: {
    id: 'projects',
    title: 'Finder — Projects',
    description: 'Showcase of full-stack projects, live demos, and source code',
    iconName: 'FolderGit2',
    iconSrc: '/icons/finder.png',
    defaultPosition: { x: 140, y: 90 },
    defaultSize: { width: 980, height: 680 },
  },
  github: {
    id: 'github',
    title: 'Safari — GitHub (@AP-boi)',
    description: 'GitHub repositories, commit activity, and statistics',
    iconName: 'Github',
    iconSrc: '/icons/safari.png',
    defaultPosition: { x: 200, y: 120 },
    defaultSize: { width: 840, height: 560 },
  },
  terminal: {
    id: 'terminal',
    title: 'anugamya — zsh — 80×24',
    description: 'Interactive Unix terminal shell with command parser',
    iconName: 'Terminal',
    iconSrc: '/icons/terminal.png',
    defaultPosition: { x: 260, y: 100 },
    defaultSize: { width: 780, height: 500 },
  },
  'ai-assistant': {
    id: 'ai-assistant',
    title: 'AP Intelligence Assistant',
    description: 'Interactive AI assistant to explore projects and architecture',
    iconName: 'Bot',
    iconSrc: '/icons/siri.png',
    defaultPosition: { x: 320, y: 80 },
    defaultSize: { width: 440, height: 620 },
  },
  analytics: {
    id: 'analytics',
    title: 'Activity Monitor — Visitor Intelligence',
    description: 'Real-time visitor logs, login tracker, telemetry and aggregate analytics',
    iconName: 'Activity',
    iconSrc: '/icons/settings.png',
    defaultPosition: { x: 120, y: 70 },
    defaultSize: { width: 960, height: 620 },
  },
  'system-info': {
    id: 'system-info',
    title: 'System Settings — Telemetry',
    description: 'Real-time connection performance, memory & edge telemetry monitor',
    iconName: 'Activity',
    iconSrc: '/icons/settings.png',
    defaultPosition: { x: 100, y: 140 },
    defaultSize: { width: 680, height: 480 },
  },
  camera: {
    id: 'camera',
    title: 'Camera',
    description: 'Interactive 3D webcam pixel grid & cyber motion matrix app',
    iconName: 'Camera',
    iconSrc: '/icons/camera.png',
    defaultPosition: { x: 180, y: 100 },
    defaultSize: { width: 860, height: 560 },
  },
  tetris: {
    id: 'tetris',
    title: 'Game Center — Tetris AI',
    description: 'Autonomous self-playing Tetris AI game engine',
    iconName: 'Gamepad2',
    iconSrc: '/icons/games.png',
    defaultPosition: { x: 220, y: 80 },
    defaultSize: { width: 440, height: 580 },
  },
  music: {
    id: 'music',
    title: 'Music — Lofi Coding Beats',
    description: 'Ambient lofi and synthwave music player with real-time visualizer',
    iconName: 'Music',
    iconSrc: '/icons/music.png',
    defaultPosition: { x: 280, y: 110 },
    defaultSize: { width: 640, height: 480 },
  },
};

interface OSStoreState {
  windows: Record<AppId, WindowState>;
  activeAppId: AppId | null;
  maxZIndex: number;
  telemetry: TelemetryData;
  ambientLight: AmbientLightState;

  // Visitor & Authentication State
  currentUser: VisitorSession | null;
  isLocked: boolean;
  isAdmin: boolean;
  totalLoginsCount: number;

  // Window Management Actions
  openWindow: (id: AppId) => void;
  closeWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  toggleMaximizeWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  updateWindowBounds: (id: AppId, position?: WindowPosition, size?: WindowSize) => void;

  // Auth & Visitor Actions
  setCurrentUser: (user: VisitorSession | null) => void;
  lockScreen: () => void;
  unlockScreen: () => void;
  logout: () => void;
  trackAppOpen: (appId: string) => void;

  // System Settings Actions
  updateTelemetry: (data: Partial<TelemetryData>) => void;
  updateAmbientLight: (data: Partial<AmbientLightState>) => void;
}

const initialWindows: Record<AppId, WindowState> = Object.keys(APP_REGISTRY).reduce(
  (acc, key) => {
    const appKey = key as AppId;
    const meta = APP_REGISTRY[appKey];
    acc[appKey] = {
      id: appKey,
      title: meta.title,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: appKey === 'projects' ? 10 : appKey === 'terminal' ? 11 : 1,
      position: meta.defaultPosition,
      size: meta.defaultSize,
      iconName: meta.iconName,
      iconSrc: meta.iconSrc,
    };
    return acc;
  },
  {} as Record<AppId, WindowState>
);

export const useOSStore = create<OSStoreState>((set, get) => ({
  windows: initialWindows,
  activeAppId: null,
  maxZIndex: 12,
  telemetry: {
    fps: 60,
    latencyMs: 24,
    activeMemoryMb: 42,
    region: 'iad1 (US-East)',
    edgeStatus: 'OPTIMAL',
    websocketConnections: 1280,
    uptimeSeconds: 86400,
  },
  ambientLight: {
    intensity: 0.7,
    noiseLevel: 0.15,
    accentHue: 215,
    particleCount: 80,
  },

  currentUser: null,
  isLocked: true,
  isAdmin: false,
  totalLoginsCount: 48,

  setCurrentUser: (user: VisitorSession | null) => {
    set({
      currentUser: user,
      isAdmin: !!user?.isAdmin,
      isLocked: false,
    });
  },

  lockScreen: () => {
    set({ isLocked: true });
  },

  unlockScreen: () => {
    set({ isLocked: false });
  },

  logout: () => {
    set({
      currentUser: null,
      isAdmin: false,
      isLocked: true,
    });
  },

  trackAppOpen: (appId: string) => {
    const { currentUser } = get();
    if (typeof window !== 'undefined') {
      fetch('/api/visitors/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: currentUser?.id,
          appOpened: appId,
        }),
      }).catch(() => { });
    }
  },

  openWindow: (id: AppId) => {
    const { windows, maxZIndex, trackAppOpen } = get();
    const target = windows[id];
    if (!target) return;

    // Track app opening on backend
    trackAppOpen(id);

    const nextZ = maxZIndex + 1;
    set({
      windows: {
        ...windows,
        [id]: {
          ...target,
          isOpen: true,
          isMinimized: false,
          zIndex: nextZ,
          lastAction: 'open',
        },
      },
      activeAppId: id,
      maxZIndex: nextZ,
    });
  },

  closeWindow: (id: AppId) => {
    const { windows, activeAppId } = get();
    const target = windows[id];
    if (!target) return;

    const updatedWindows = {
      ...windows,
      [id]: {
        ...target,
        isOpen: false,
        isMinimized: false,
        lastAction: 'close' as const,
      },
    };

    let nextActive: AppId | null = null;
    let highestZ = -1;
    (Object.keys(updatedWindows) as AppId[]).forEach((key) => {
      const win = updatedWindows[key];
      if (win.isOpen && !win.isMinimized && win.zIndex > highestZ) {
        highestZ = win.zIndex;
        nextActive = key;
      }
    });

    set({
      windows: updatedWindows,
      activeAppId: activeAppId === id ? nextActive : activeAppId,
    });
  },

  minimizeWindow: (id: AppId) => {
    const { windows, activeAppId } = get();
    const target = windows[id];
    if (!target) return;

    const updatedWindows = {
      ...windows,
      [id]: {
        ...target,
        isMinimized: true,
        lastAction: 'minimize' as const,
      },
    };

    let nextActive: AppId | null = null;
    let highestZ = -1;
    (Object.keys(updatedWindows) as AppId[]).forEach((key) => {
      const win = updatedWindows[key];
      if (win.isOpen && !win.isMinimized && win.zIndex > highestZ) {
        highestZ = win.zIndex;
        nextActive = key;
      }
    });

    set({
      windows: updatedWindows,
      activeAppId: activeAppId === id ? nextActive : activeAppId,
    });
  },

  toggleMaximizeWindow: (id: AppId) => {
    const { windows, maxZIndex } = get();
    const target = windows[id];
    if (!target) return;

    const nextZ = maxZIndex + 1;
    set({
      windows: {
        ...windows,
        [id]: {
          ...target,
          isMaximized: !target.isMaximized,
          zIndex: nextZ,
        },
      },
      activeAppId: id,
      maxZIndex: nextZ,
    });
  },

  focusWindow: (id: AppId) => {
    const { windows, maxZIndex, activeAppId } = get();
    const target = windows[id];
    if (!target || activeAppId === id) return;

    const nextZ = maxZIndex + 1;
    set({
      windows: {
        ...windows,
        [id]: {
          ...target,
          isMinimized: false,
          zIndex: nextZ,
        },
      },
      activeAppId: id,
      maxZIndex: nextZ,
    });
  },

  updateWindowBounds: (id: AppId, position?: WindowPosition, size?: WindowSize) => {
    const { windows } = get();
    const target = windows[id];
    if (!target) return;

    set({
      windows: {
        ...windows,
        [id]: {
          ...target,
          position: position ?? target.position,
          size: size ?? target.size,
        },
      },
    });
  },

  updateTelemetry: (data: Partial<TelemetryData>) => {
    set((state) => ({
      telemetry: { ...state.telemetry, ...data },
    }));
  },

  updateAmbientLight: (data: Partial<AmbientLightState>) => {
    set((state) => ({
      ambientLight: { ...state.ambientLight, ...data },
    }));
  },
}));
