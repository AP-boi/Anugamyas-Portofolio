# Anugamya Portfolio OS

An interactive macOS Sonoma desktop environment simulator built with Next.js 14 App Router, React, TypeScript, Tailwind CSS, Framer Motion, and Zustand.

---

## Overview

Anugamya Portfolio OS is a web-based operating system simulator designed to present engineering projects, technical milestones, live GitHub activity, interactive utilities, and real-time visitor telemetry in an authentic desktop interface.

---

## Key Features

### Desktop Environment
- **Multi-Window Management**: Draggable, minimizable, maximizable, and focus-aware window architecture powered by Zustand.
- **Words Preloader (Skiper8)**: Sequential multilingual entrance animation with curved SVG transition effects.
- **Visitor Authentication & Lock Screen**: Interactive visitor sign-up, guest explorer session, and administrator telemetry login.
- **Dynamic Dock**: Interactive dock with spring physics, icon magnification, bounce animations, and running indicator status.
- **Spotlight Search (Command + Space)**: Rapid system-wide launcher for applications, project repositories, and actions.
- **Launchpad (F4)**: Full-screen grid application drawer with real-time search.
- **System Menu Bar & Control Center**: macOS menu bar with dynamic time/battery indicators, lock controls, and wallpaper picker.
- **Tactile Marquee & Desktop Context Menu**: Desktop drag selection marquee and right-click contextual actions.

### Native Applications Suite
1. **Finder — Projects Showcase**: Categorized portfolio repository browser with live demos, source links, and architecture notes.
2. **Safari — GitHub Explorer**: Live repository view, commit stream, language metrics, and profile streak tracker.
3. **Notes — Milestones & Credentials**: Scrollytelling document viewer detailing hackathons, project launches, and verified credentials.
4. **Terminal — zsh Shell**: Interactive CLI shell with command parser, command history, and utility commands (projects, skills, theme, visitor audits).
5. **Activity Monitor — Visitor Intelligence**: Real-time visitor logs, device breakdown, session tracking, and guestbook submissions.
6. **AP Intelligence Assistant**: Interactive AI assistant trained on portfolio architecture and engineering experience.
7. **Camera & Motion Grid**: Interactive 3D voxel webcam pixel grid and cyber motion matrix canvas.
8. **Game Center — Autonomous Tetris AI**: Heuristic-driven self-playing Tetris engine with selectable visual palettes.
9. **System Settings — Edge Telemetry**: Live telemetry monitor displaying FPS, latency, memory usage, and connection health.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI & Styling**: Tailwind CSS, CSS Modules
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Graphics & 3D**: Three.js, React Three Fiber, HTML5 Canvas
- **Icons**: Custom 3D Skeuomorphic Asset Suite, Lucide React
- **Audio**: Web Audio API Sound Engine

---

## Getting Started

### Prerequisites
- Node.js 18.17 or higher
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AP-boi/Anugamyas-Portofolio.git
cd Anugamyas-Portofolio
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

### Building for Production

To create an optimized production build:
```bash
npm run build
npm start
```

---

## Project Structure

```
.
├── app/
│   ├── api/             # API routes for visitors, telemetry, and auth
│   ├── layout.tsx       # Root layout configuration
│   └── page.tsx         # Main desktop operating system view
├── components/
│   ├── apps/            # Portfolio applications (Finder, Notes, Terminal, etc.)
│   ├── background/      # 3D canvas and animated wallpapers
│   ├── macOS/           # OS UI components (Dock, MenuBar, Window, Launchpad, Spotlight)
│   ├── originkit/       # Specialized interactive UI elements
│   └── ui/              # Widgets, badges, and shared components
├── hooks/               # Custom React hooks (keyboard shortcuts, audio)
├── lib/                 # Utilities, animations, and sound engine
├── public/              # Static assets, wallpapers, and 3D icons
├── store/               # Zustand OS state and app registry
└── types/               # TypeScript definitions for windows, sessions, and telemetry
```

---

## Keyboard Shortcuts

- **Command + Space** or **Ctrl + Space**: Toggle Spotlight Search
- **Command + K** or **Ctrl + K**: Open Terminal
- **Command + L** or **Ctrl + L**: Lock Screen
- **F4**: Open Launchpad
- **Escape**: Close Spotlight, Launchpad, or active modal

---

## Author

- **Anugamya** ([@AP-boi](https://github.com/AP-boi))
