export type AppId = 'achievements' | 'projects' | 'github' | 'terminal' | 'ai-assistant' | 'system-info' | 'camera' | 'tetris' | 'analytics';

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface WindowState {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: WindowPosition;
  size: WindowSize;
  iconName: string;
  iconSrc?: string;
}

export interface AppMetadata {
  id: AppId;
  title: string;
  description: string;
  iconName: string;
  iconSrc?: string;
  defaultPosition: WindowPosition;
  defaultSize: WindowSize;
  isExternalLink?: boolean;
  externalUrl?: string;
}

export interface VisitorSession {
  id: string;
  name: string;
  role: string;
  company: string;
  contact?: string;
  message?: string;
  isGuest: boolean;
  isAdmin: boolean;
  loginTime: string;
  lastActive: string;
  token?: string;
}

export interface VisitorRecord {
  id: string;
  name: string;
  role: string;
  company: string;
  contact?: string;
  message?: string;
  isGuest: boolean;
  isAdmin: boolean;
  loginTime: string;
  lastActive: string;
  device: string;
  os: string;
  browser: string;
  ip?: string;
  city?: string;
  country?: string;
  pagesVisited: string[];
  sessionCount: number;
}

export interface GuestbookEntry {
  id: string;
  author: string;
  role?: string;
  company?: string;
  message: string;
  timestamp: string;
  verified: boolean;
}

export interface AnalyticsSummary {
  totalVisits: number;
  totalLogins: number;
  uniqueVisitors: number;
  todayVisits: number;
  activeSessions: number;
  recentLogins: VisitorRecord[];
  guestbook: GuestbookEntry[];
  dailyStats: { date: string; visits: number; logins: number }[];
  deviceBreakdown: { desktop: number; mobile: number; tablet: number };
  browserBreakdown: { chrome: number; safari: number; firefox: number; edge: number; other: number };
  osBreakdown: { macos: number; windows: number; ios: number; android: number; linux: number; other: number };
  topApps: { appId: string; title: string; count: number }[];
}

export interface AchievementItem {
  id: string;
  title: string;
  organization: string;
  category: 'Project Launch' | 'Game Release' | 'Engineering Milestone' | 'Open Source' | 'Hackathon' | 'Certification' | string;
  date: string;
  description: string;
  metrics: {
    label: string;
    value: string;
    improvement: string;
  }[];
  proofUrl?: string;
  verified: boolean;
  tags: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  category: 'AI & WebGL' | 'Game Development' | 'Full-Stack & WebGL' | 'Systems & Java' | 'UI/UX & Web' | 'Tools & Utilities' | 'Distributed Systems' | 'Interactive Graphics' | 'AI / Machine Learning' | 'Security & Infrastructure' | string;
  description: string;
  architectureNotes: string;
  metrics: {
    latency: string;
    throughput: string;
    uptime: string;
  };
  technologies: string[];
  githubUrl: string;
  liveDemoUrl?: string;
  apiEndpoint?: string;
  codeSnippet?: string;
  diagramSvg?: string;
  featured: boolean;
}

export interface TerminalHistory {
  id: string;
  command: string;
  output: string | React.ReactNode;
  type: 'input' | 'output' | 'error' | 'system';
  timestamp: string;
}

export interface TelemetryData {
  fps: number;
  latencyMs: number;
  activeMemoryMb: number;
  region: string;
  edgeStatus: 'OPTIMAL' | 'DEGRADED' | 'DISCONNECTED';
  websocketConnections: number;
  uptimeSeconds: number;
}

export interface AmbientLightState {
  intensity: number;
  noiseLevel: number;
  accentHue: number;
  particleCount: number;
}
