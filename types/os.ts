export type AppId = 'achievements' | 'projects' | 'github' | 'terminal' | 'ai-assistant' | 'system-info' | 'camera' | 'tetris';

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
}

export interface AppMetadata {
  id: AppId;
  title: string;
  description: string;
  iconName: string;
  defaultPosition: WindowPosition;
  defaultSize: WindowSize;
  isExternalLink?: boolean;
  externalUrl?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  organization: string;
  category: 'Hackathon' | 'Certification' | 'Engineering Milestone' | 'Open Source';
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
  category: 'Distributed Systems' | 'Interactive Graphics' | 'AI / Machine Learning' | 'Security & Infrastructure';
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
