'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ProjectItem } from '@/types/os';
import {
  Folder,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Search,
  Code2,
  Terminal,
  Cpu,
  Layers,
  Activity,
  Check,
  Copy,
  LayoutGrid,
  Table as TableIcon,
  RotateCw,
} from 'lucide-react';
import { sounds } from '@/lib/soundEngine';

interface ProjectSpecItem extends ProjectItem {
  filename?: string;
  runtimeEngine?: string;
  memoryFootprint?: string;
  benchmarkMetric?: string;
  stars?: number;
  forks?: number;
  updatedAt?: string;
  source?: string;
}

const PROJECTS_DATA: ProjectSpecItem[] = [
  {
    id: 'proj-1',
    title: 'Bharat Dekho (BHARAT-DEKHO)',
    tagline: 'Deterministic cultural heritage index & Gemini 1.5 streaming itinerary pipeline',
    category: 'AI & WebGL',
    description:
      'National digital heritage archive featuring real-time itinerary generation via Google Gemini 1.5 streaming API, interactive Three.js GLTF artifact renders with OrbitControls, and Lenis momentum scroll physics.',
    architectureNotes:
      'Engineered with Next.js 15 App Router, zero-latency server action streaming, GLTF instanced mesh buffers, and GPU-accelerated lighting shaders.',
    filename: 'gemini_itinerary_stream.ts',
    runtimeEngine: 'Next.js 15 + Three.js GLTF',
    memoryFootprint: '18.4 MB heap',
    benchmarkMetric: '118ms TTFT',
    codeSnippet: `// gemini_itinerary_stream.ts
export async function streamCulturalRoute(constraints: UserCriteria) {
  const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContentStream({
    contents: [{ role: 'user', parts: [{ text: buildPrompt(constraints) }] }],
    generationConfig: { temperature: 0.15, maxOutputTokens: 2048 }
  });
  return createStreamableValue(result.stream);
}`,
    metrics: {
      latency: '118ms TTFT',
      throughput: '60 FPS Canvas',
      uptime: 'Edge / GitHub Pages',
    },
    technologies: ['Next.js 15', 'Gemini AI', 'Three.js', 'React', 'TypeScript', 'Tailwind CSS', 'Lenis Scroll'],
    githubUrl: 'https://github.com/AP-boi/BHARAT-DEKHO',
    liveDemoUrl: 'https://ap-boi.github.io/BHARAT-DEKHO/',
    apiEndpoint: 'https://ap-boi.github.io/BHARAT-DEKHO/',
    featured: true,
  },
  {
    id: 'proj-2',
    title: 'PhysX Studio',
    tagline: 'Real-time WebAssembly physics sandbox with Rapier 3D rigid-body collision meshes',
    category: 'AI & WebGL',
    description:
      'Real-time 3D physics sandbox and CAD playground. Users instantiate dynamic rigidbodies, tweak gravitational and friction coefficients, simulate restitution, and resolve complex mesh contact manifolds.',
    architectureNotes:
      'Powered by React Three Fiber, Rapier 3D WebAssembly physics pipeline, and custom Three.js depth shadow shaders.',
    filename: 'rapier_simulation_loop.ts',
    runtimeEngine: 'Rapier 3D WASM + Three.js',
    memoryFootprint: '24.2 MB heap',
    benchmarkMetric: '60 FPS Locked',
    codeSnippet: `// rapier_simulation_loop.ts
const world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
const eventQueue = new RAPIER.EventQueue(true);

export function stepSimulation(deltaTime: number) {
  world.timestep = Math.min(deltaTime, 0.033);
  world.step(eventQueue);
  eventQueue.drainCollisionEvents((h1, h2, started) => {
    if (started) dispatchCollisionManifold(h1, h2);
  });
}`,
    metrics: {
      latency: '16.6ms frame',
      throughput: 'WASM Physics',
      uptime: 'Open Source',
    },
    technologies: ['React', 'Three.js', 'Rapier 3D', 'TypeScript', 'WASM', 'Tailwind CSS'],
    githubUrl: 'https://github.com/AP-boi/PhysX-Studio',
    apiEndpoint: 'https://github.com/AP-boi/PhysX-Studio',
    featured: true,
  },
  {
    id: 'proj-3',
    title: 'Flow OS',
    tagline: 'Minimalist windowed workspace architecture for deep focus sessions',
    category: 'Full-Stack & WebGL',
    description:
      'Web-based desktop operating system engineered for deep work, flow sessions, and distraction-free developer workflows with customizable workspaces and productivity utilities.',
    architectureNotes:
      'Constructed with declarative windowing state machines, fluid responsive layouts, and zero-roundtrip local state persistence.',
    filename: 'window_state_machine.ts',
    runtimeEngine: 'React State Machine',
    memoryFootprint: '12.1 MB heap',
    benchmarkMetric: 'Sub-1ms state dispatch',
    codeSnippet: `// window_state_machine.ts
interface WindowNode {
  id: string; zIndex: number; bounds: Rect;
  status: 'active' | 'docked' | 'tiled';
}
export const focusNode = (state: OSState, targetId: string) => {
  const maxZ = Math.max(...state.nodes.map(n => n.zIndex), 0);
  return state.nodes.map(n => n.id === targetId ? { ...n, zIndex: maxZ + 1 } : n);
};`,
    metrics: {
      latency: 'Sub-1ms dispatch',
      throughput: 'Zero re-renders',
      uptime: 'Live on Vercel',
    },
    technologies: ['React', 'JavaScript', 'CSS3 Architecture', 'Vercel Edge'],
    githubUrl: 'https://github.com/AP-boi/flow-os',
    liveDemoUrl: 'https://flowosv1.vercel.app',
    apiEndpoint: 'https://flowosv1.vercel.app',
    featured: true,
  },
  {
    id: 'proj-4',
    title: 'Cyber Ascension Game',
    tagline: '2D action combat engine with delta-time physics and branching dialogue trees',
    category: 'Game Development',
    description:
      'Constructed a 2D action and movement game engine with custom bounding box collision detection, dynamic video cutscenes, sword and dash combo chains, and interactive branching dialog systems.',
    architectureNotes:
      'Engineered with 60 FPS HTML5 Canvas render loop, delta-time sprite animator, state-machine character physics, and custom Web Audio ambient soundscapes.',
    filename: 'canvas_combat_loop.ts',
    runtimeEngine: 'HTML5 Canvas 2D + Web Audio',
    memoryFootprint: '9.6 MB heap',
    benchmarkMetric: '60 FPS (0 frame drops)',
    codeSnippet: `// canvas_combat_loop.ts
export function renderCombatPass(ctx: CanvasRenderingContext2D, dt: number) {
  player.updateMovement(dt);
  for (const enemy of activeEnemies) {
    if (checkAABB(player.hitbox, enemy.hurtbox)) {
      enemy.applyDamage(player.attackPower);
      spawnHitSparks(enemy.position);
    }
  }
}`,
    metrics: {
      latency: '16.6ms locked',
      throughput: 'Zero Frame Drops',
      uptime: 'Live on Netlify',
    },
    technologies: ['JavaScript', 'HTML5 Canvas', 'Web Audio API', 'CSS3 FX', 'Netlify'],
    githubUrl: 'https://github.com/AP-boi/cyber-ascension-game',
    liveDemoUrl: 'https://neondrift2.netlify.app',
    apiEndpoint: 'https://neondrift2.netlify.app',
    featured: true,
  },
  {
    id: 'proj-5',
    title: 'Anugamya Portfolio OS',
    tagline: 'Reactive macOS desktop simulator with Zustand state store & tactile physical controls',
    category: 'Full-Stack & WebGL',
    description:
      'Fully interactive desktop environment simulator featuring multi-window management, tactile material surfaces, AP Intelligence assistant, autonomous Tetris engine, and 3D camera motion grid.',
    architectureNotes:
      'Built with Next.js 14 App Router, Zustand reactive window manager, Framer Motion spring physics, and React Three Fiber liquid canvas shaders.',
    filename: 'use_os_store.ts',
    runtimeEngine: 'Next.js 14 + Zustand + R3F',
    memoryFootprint: '38.0 MB heap',
    benchmarkMetric: '0ms store latency',
    codeSnippet: `// use_os_store.ts
export const useOSStore = create<OSStore>()(
  persist(
    (set, get) => ({
      windows: INITIAL_WINDOWS,
      telemetry: { fps: 60, latencyMs: 12, activeMemoryMb: 38 },
      openWindow: (id) => set((s) => focusWindow(s, id)),
    }),
    { name: 'ap-os-session-v2' }
  )
);`,
    metrics: {
      latency: '0ms store update',
      throughput: '100% Client-Side',
      uptime: 'Edge Production',
    },
    technologies: ['Next.js 14', 'React Three Fiber', 'Three.js', 'Zustand', 'Framer Motion', 'Tailwind CSS'],
    githubUrl: 'https://github.com/AP-boi/Anugamyas-Portofolio',
    liveDemoUrl: 'https://anugamya.vercel.app',
    apiEndpoint: 'https://anugamya.vercel.app',
    featured: true,
  },
  {
    id: 'proj-6',
    title: 'OMNIS',
    tagline: 'Modular cloud interface suite with dynamic hydration and Next.js SSR',
    category: 'UI/UX & Web',
    description:
      'Engineered OMNIS, a modular web interface suite built with Next.js and TypeScript, featuring dynamic component hydration, edge caching, and automated static generation.',
    architectureNotes:
      'Constructed with strict TypeScript typing, modular layout primitives, and automated edge deployment pipelines.',
    filename: 'hydration_router.ts',
    runtimeEngine: 'Next.js SSR + TypeScript',
    memoryFootprint: '14.2 MB heap',
    benchmarkMetric: 'Sub-200ms TTFB',
    codeSnippet: `// hydration_router.ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const asset = await fetchEdgeRegistry(params.slug);
  return { title: \`\${asset.title} | OMNIS Core\`, description: asset.summary };
}`,
    metrics: {
      latency: 'Sub-200ms TTFB',
      throughput: 'Vercel Edge',
      uptime: 'Live Production',
    },
    technologies: ['TypeScript', 'Next.js', 'React', 'Tailwind CSS', 'Vercel'],
    githubUrl: 'https://github.com/AP-boi/OMNIS',
    liveDemoUrl: 'https://omnis-lake.vercel.app',
    apiEndpoint: 'https://omnis-lake.vercel.app',
    featured: false,
  },
  {
    id: 'proj-7',
    title: 'Classroom Pen Fight 3D',
    tagline: '3D WebGL physics simulation of tabletop collision and impulse mechanics',
    category: 'Game Development',
    description:
      'A 3D WebGL physics desk simulation recreating pen flick battles with custom collision impulses, trajectory flick mechanics, and interactive camera orbits.',
    architectureNotes: 'Built with Three.js rendering pipelines, TypeScript state management, and 3D mesh physics simulation.',
    filename: 'pen_trajectory_impulse.ts',
    runtimeEngine: 'Three.js WebGL',
    memoryFootprint: '19.8 MB heap',
    benchmarkMetric: '60 FPS WebGL',
    codeSnippet: `// pen_trajectory_impulse.ts
export function applyFlickImpulse(pen: PenMesh, vector: Vector3, strength: number) {
  pen.velocity.copy(vector.normalize().multiplyScalar(strength));
  pen.angularVelocity.set(0, strength * 0.12, 0);
}`,
    metrics: {
      latency: '60 FPS Canvas',
      throughput: 'Zero Frame Drops',
      uptime: 'Open Source',
    },
    technologies: ['TypeScript', 'Three.js', 'WebGL', 'Physics Mathematics'],
    githubUrl: 'https://github.com/AP-boi/classroom-pen-fight-3d',
    apiEndpoint: 'https://github.com/AP-boi/classroom-pen-fight-3d',
    featured: false,
  },
  {
    id: 'proj-8',
    title: 'EESA Department Portal',
    tagline: 'Official academic hub with accessible tabular schedules & event logs',
    category: 'UI/UX & Web',
    description:
      'Official web portal for the Electrical Engineering Students Association featuring departmental announcements, technical documentation, and student community updates.',
    architectureNotes: 'Crafted with responsive mobile-first design, interactive tabs, and accessibility-compliant UI components.',
    filename: 'event_registry.ts',
    runtimeEngine: 'React + Tailwind',
    memoryFootprint: '11.0 MB heap',
    benchmarkMetric: '100% Lighthouse A11y',
    codeSnippet: `// event_registry.ts
export const filterDepartmentSchedule = (events: DepartmentEvent[], term: string) => {
  return events.filter(e => e.semester === term && e.status === 'confirmed');
};`,
    metrics: {
      latency: 'Instant Hydration',
      throughput: '100% Mobile Ready',
      uptime: 'Open Source',
    },
    technologies: ['TypeScript', 'React', 'Tailwind CSS', 'Accessible Components'],
    githubUrl: 'https://github.com/AP-boi/eesa-website',
    apiEndpoint: 'https://github.com/AP-boi/eesa-website',
    featured: false,
  },
  {
    id: 'proj-9',
    title: 'Gravity Client',
    tagline: 'Java client runtime with bytecode instrumentation & low-latency event bus',
    category: 'Systems & Java',
    description:
      'Performance-focused Java client architecture featuring modular draggable HUD overlays, runtime bytecode transformation (ASM), low-latency event bus dispatching, and optimized OpenGL rendering hooks.',
    architectureNotes:
      'Engineered with clean object-oriented architecture, custom OpenGL rendering hooks, and packet handling pipelines.',
    filename: 'EventBusDispatcher.java',
    runtimeEngine: 'Java 17 + OpenGL (LWJGL)',
    memoryFootprint: '48.0 MB heap',
    benchmarkMetric: '240+ FPS OpenGL',
    codeSnippet: `// EventBusDispatcher.java
public final class EventBus {
    private final Map<Class<?>, List<MethodHandler>> listeners = new ConcurrentHashMap<>();
    public void post(final Event event) {
        final List<MethodHandler> targets = listeners.get(event.getClass());
        if (targets != null) targets.forEach(handler -> handler.invoke(event));
    }
}`,
    metrics: {
      latency: 'Zero Overhead',
      throughput: '240+ FPS OpenGL',
      uptime: 'Open Source',
    },
    technologies: ['Java', 'OpenGL / LWJGL', 'Bytecode Instrumentation', 'Event Architecture'],
    githubUrl: 'https://github.com/AP-boi/gravity-client',
    apiEndpoint: 'https://github.com/AP-boi/gravity-client',
    featured: false,
  },
  {
    id: 'proj-10',
    title: 'diesel-ldr',
    tagline: 'Asynchronous streaming module loader & buffer cache pipeline in Node.js',
    category: 'Tools & Utilities',
    description:
      'Created an asynchronous resource loading pipeline in TypeScript designed for rapid module resolution, in-memory buffer caching, and zero runtime dependencies.',
    architectureNotes: 'Constructed with strict TypeScript typing, Node.js stream pipelining, and zero runtime dependencies.',
    filename: 'stream_loader.ts',
    runtimeEngine: 'Node.js Core Streams',
    memoryFootprint: '6.2 MB heap',
    benchmarkMetric: 'Sub-4ms parsing',
    codeSnippet: `// stream_loader.ts
export async function streamModuleBuffer(path: string): Promise<Buffer> {
  const chunks: Buffer[] = [];
  const readStream = createReadStream(path, { highWaterMark: 64 * 1024 });
  for await (const chunk of readStream) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}`,
    metrics: {
      latency: 'Sub-4ms parsing',
      throughput: 'Zero Dependencies',
      uptime: '100%',
    },
    technologies: ['TypeScript', 'Node.js', 'Streams', 'CLI Automation'],
    githubUrl: 'https://github.com/AP-boi/diesel-ldr',
    apiEndpoint: 'https://github.com/AP-boi/diesel-ldr',
    featured: false,
  },
  {
    id: 'proj-11',
    title: 'STELLARNET',
    tagline: 'Decentralized mesh telemetry network protocol for distributed nodes',
    category: 'Systems & Java',
    description:
      'Conceptualized and architected STELLARNET, a decentralized mesh telemetry network protocol for resilient packet transmission across distributed edge nodes.',
    architectureNotes: 'Distributed topology design with packet forwarding and node health diagnostics.',
    filename: 'mesh_protocol_packet.ts',
    runtimeEngine: 'Distributed Protocol Spec',
    memoryFootprint: '15.5 MB heap',
    benchmarkMetric: '0.04% wire overhead',
    codeSnippet: `// mesh_protocol_packet.ts
export interface MeshTelemetryFrame {
  nodeId: string;
  sequenceId: bigint;
  payloadDigest: Uint8Array;
  hopCount: number;
}`,
    metrics: {
      latency: 'Low Packet Loss',
      throughput: 'Mesh Protocol',
      uptime: 'Architecture Spec',
    },
    technologies: ['TypeScript', 'Distributed Systems', 'Telemetry', 'Mesh Networking'],
    githubUrl: 'https://github.com/AP-boi/STELLARNET',
    apiEndpoint: 'https://github.com/AP-boi/STELLARNET',
    featured: false,
  },
];

export const ProjectsApp: React.FC = () => {
  const [projects, setProjects] = useState<ProjectSpecItem[]>(PROJECTS_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Projects');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'bento' | 'table'>('bento');
  const [activeProjectId, setActiveProjectId] = useState<string>('proj-1');
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSource, setSyncSource] = useState<string>('github-live');
  const [lastSynced, setLastSynced] = useState<string>('');

  const fetchLiveProjects = useCallback(async (forceRefresh = false) => {
    try {
      setIsSyncing(true);
      const res = await fetch(`/api/projects${forceRefresh ? '?refresh=true' : ''}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects(data.projects);
          setSyncSource(data.source || 'github-live');
          if (data.lastSynced) {
            setLastSynced(
              new Date(data.lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            );
          }
        }
      }
    } catch (err) {
      console.warn('Backend /api/projects request failed, using baseline:', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveProjects();
  }, [fetchLiveProjects]);

  const categories = useMemo(() => {
    const defaultCats = [
      'All Projects',
      'AI & WebGL',
      'Game Development',
      'Full-Stack & WebGL',
      'Systems & Java',
      'UI/UX & Web',
    ];
    const dynamicCats = Array.from(new Set(projects.map((p) => p.category))).filter(Boolean);
    return Array.from(new Set(['All Projects', ...dynamicCats, ...defaultCats]));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => {
      const matchesCategory = selectedCategory === 'All Projects' || proj.category === selectedCategory;
      const matchesSearch =
        proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  const activeProject =
    filteredProjects.find((p) => p.id === activeProjectId) ||
    filteredProjects[0] ||
    projects[0] ||
    PROJECTS_DATA[0];

  const handleCopyCode = (code?: string) => {
    if (!code) return;
    sounds.playClick();
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="flex flex-col h-full space-y-3 text-neutral-900 dark:text-neutral-100 p-3 bg-[#fbfbf9] dark:bg-[#0c0d0e] transition-colors selection:bg-amber-500/20 selection:text-amber-900 dark:selection:text-amber-200">
      {/* Finder Navigation & Search Bar */}
      <div className="flex items-center justify-between pb-2.5 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => {
                sounds.playClick();
                const currIdx = filteredProjects.findIndex((p) => p.id === activeProject.id);
                if (currIdx > 0) setActiveProjectId(filteredProjects[currIdx - 1].id);
              }}
              className="p-1 rounded hover:bg-neutral-200/60 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors btn-tactile"
              title="Previous Project"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                const currIdx = filteredProjects.findIndex((p) => p.id === activeProject.id);
                if (currIdx < filteredProjects.length - 1) setActiveProjectId(filteredProjects[currIdx + 1].id);
              }}
              className="p-1 rounded hover:bg-neutral-200/60 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors btn-tactile"
              title="Next Project"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <img src="/icons/finder.png" alt="Finder" className="w-5 h-5 rounded-md object-contain shadow-xs" />
            <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
              Finder — Engineering Repository Registry
            </span>
          </div>
          <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
            [{filteredProjects.length} items]
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Live GitHub Sync Indicator */}
          <div className="flex items-center space-x-1.5 px-2 py-1 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700/80 rounded-md text-[11px] font-mono text-neutral-600 dark:text-neutral-300 shadow-tactile">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">GitHub: @AP-boi</span>
            <button
              type="button"
              onClick={() => fetchLiveProjects(true)}
              disabled={isSyncing}
              className="p-0.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
              title={
                lastSynced
                  ? `Synced at ${lastSynced}. Click to re-fetch directly from GitHub.`
                  : 'Click to re-fetch directly from GitHub.'
              }
            >
              <RotateCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-blue-500' : ''}`} />
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-neutral-200/70 dark:bg-neutral-900 p-0.5 rounded-lg border border-neutral-300 dark:border-neutral-800 text-xs">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setViewMode('bento');
              }}
              className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'bento'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-tactile font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
              title="Asymmetrical Bento View"
            >
              <LayoutGrid className="w-3 h-3" />
              <span>Bento</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setViewMode('table');
              }}
              className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-tactile font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
              title="Dense Telemetry Table View"
            >
              <TableIcon className="w-3 h-3" />
              <span>Registry Table</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="flex items-center space-x-1.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700/80 rounded-md px-2 py-1 text-xs text-neutral-800 dark:text-neutral-200 shadow-tactile">
            <Search className="w-3 h-3 text-neutral-400" />
            <input
              type="text"
              placeholder="Search stack, title, specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[11px] text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 w-36 font-sans"
            />
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row gap-3 overflow-hidden">
        {/* Left Category Column */}
        <div className="w-full md:w-48 bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-2.5 space-y-2 flex-shrink-0">
          <div className="px-2 flex items-center justify-between text-[10px] font-mono uppercase text-neutral-500 dark:text-neutral-400 tracking-wider font-semibold">
            <span>Domain Category</span>
          </div>

          <div className="space-y-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count =
                cat === 'All Projects'
                  ? projects.length
                  : projects.filter((p) => p.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedCategory(cat);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between btn-tactile ${
                    isSelected
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-semibold shadow-tactile'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <img
                      src="/icons/folder.png"
                      alt=""
                      className={`w-3.5 h-3.5 object-contain ${isSelected ? 'brightness-125' : ''}`}
                    />
                    <span className="truncate">{cat}</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Right Scrollable Viewport */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 space-y-2">
              <p className="text-xs font-mono uppercase tracking-widest text-neutral-400">Registry Search</p>
              <h4 className="text-base font-serif font-medium text-neutral-800 dark:text-neutral-200">
                No matching repositories found for "{searchQuery}"
              </h4>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Try searching for specific technical tokens like "WASM", "Gemini", "WebGL", or "Canvas".
              </p>
            </div>
          ) : viewMode === 'bento' ? (
            /* ================= HUMAN CRAFT BENTO COMPOSITION ================= */
            <div className="space-y-4">
              {/* Dominant Primary Bento Card (Asymmetrical Feature: 8 Columns) */}
              <div className="p-5 sm:p-6 bg-white dark:bg-[#111213] rounded-xl border border-neutral-200/90 dark:border-neutral-800 shadow-tactile space-y-4">
                {/* Meta Header */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800 text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-neutral-800 dark:text-neutral-200 font-bold">
                      {activeProject.filename || 'architecture_manifest.ts'}
                    </span>
                    <span className="text-neutral-400">•</span>
                    <span className="text-neutral-500 uppercase">{activeProject.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {activeProject.liveDemoUrl && (
                      <a
                        href={activeProject.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold rounded hover:bg-neutral-800 dark:hover:bg-neutral-200 btn-tactile flex items-center gap-1.5"
                      >
                        <span>Live Preview</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <a
                      href={activeProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 btn-tactile flex items-center gap-1.5"
                    >
                      <Github className="w-3 h-3" />
                      <span>Source</span>
                    </a>
                  </div>
                </div>

                {/* Editorial Headline & Value Proposition */}
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight text-neutral-900 dark:text-neutral-100 leading-snug">
                    {activeProject.title}
                  </h2>
                  <p className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                    {activeProject.tagline}
                  </p>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans max-w-reading pt-1">
                    {activeProject.description}
                  </p>
                </div>

                {/* Architecture Implementation Code Snippet (Tangible proof over fluff) */}
                {activeProject.codeSnippet && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                      <span className="flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Core Implementation Snippet</span>
                      </span>
                      <button
                        onClick={() => handleCopyCode(activeProject.codeSnippet)}
                        className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        {copiedSnippet ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="bg-[#0e1012] text-neutral-200 p-3.5 rounded-lg border border-neutral-800 text-xs font-mono overflow-x-auto leading-relaxed shadow-inner">
                      {activeProject.codeSnippet}
                    </pre>
                  </div>
                )}

                {/* Live Engineering Telemetry Strip */}
                <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                  <div className="bg-neutral-50 dark:bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-200/80 dark:border-neutral-800">
                    <div className="text-[10px] text-neutral-500 uppercase">RUNTIME ENGINE</div>
                    <div className="text-xs font-sans font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5 truncate">
                      {activeProject.runtimeEngine || 'Next.js 14'}
                    </div>
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-200/80 dark:border-neutral-800">
                    <div className="text-[10px] text-neutral-500 uppercase">HEAP FOOTPRINT</div>
                    <div className="text-xs font-sans font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">
                      {activeProject.memoryFootprint || '14.8 MB'}
                    </div>
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-200/80 dark:border-neutral-800">
                    <div className="text-[10px] text-neutral-500 uppercase">PERFORMANCE</div>
                    <div className="text-xs font-sans font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">
                      {activeProject.benchmarkMetric || activeProject.metrics.latency}
                    </div>
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-200/80 dark:border-neutral-800">
                    <div className="text-[10px] text-neutral-500 uppercase">STATUS / TARGET</div>
                    <div className="text-xs font-sans font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5 truncate">
                      {activeProject.metrics.uptime}
                    </div>
                  </div>
                </div>

                {/* Stack Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeProject.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Supporting Secondary Bento Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredProjects
                  .filter((p) => p.id !== activeProject.id)
                  .map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => {
                        sounds.playClick();
                        setActiveProjectId(proj.id);
                      }}
                      className="group cursor-pointer p-4 bg-white dark:bg-[#111213] rounded-xl border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all shadow-tactile space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 font-semibold">
                            {proj.category}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-500">
                            {proj.benchmarkMetric || proj.metrics.latency}
                          </span>
                        </div>

                        <h3 className="text-base font-serif font-medium text-neutral-900 dark:text-neutral-100 group-hover:underline">
                          {proj.title}
                        </h3>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                          {proj.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-mono">
                        <span className="text-neutral-500 text-[11px] truncate max-w-[180px]">
                          {proj.runtimeEngine || proj.technologies[0]}
                        </span>
                        <span className="text-neutral-900 dark:text-neutral-100 font-medium group-hover:translate-x-0.5 transition-transform">
                          Inspect Specs →
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            /* ================= DENSE TELEMETRY REGISTRY TABLE ================= */
            <div className="bg-white dark:bg-[#111213] rounded-xl border border-neutral-200/90 dark:border-neutral-800 shadow-tactile overflow-hidden">
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-serif font-medium text-neutral-900 dark:text-neutral-100">
                    System Architecture & Telemetry Index
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono">
                    Deterministic verification parameters across {filteredProjects.length} projects
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 text-[10px] uppercase text-neutral-500">
                    <tr>
                      <th className="p-3">Repository</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Runtime Engine</th>
                      <th className="p-3">Heap Footprint</th>
                      <th className="p-3">Benchmark</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {filteredProjects.map((p) => (
                      <tr
                        key={p.id}
                        onClick={() => setActiveProjectId(p.id)}
                        className={`hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors ${
                          activeProjectId === p.id ? 'bg-neutral-100/70 dark:bg-neutral-800/70' : ''
                        }`}
                      >
                        <td className="p-3 font-semibold text-neutral-900 dark:text-neutral-100">
                          {p.title}
                        </td>
                        <td className="p-3 text-neutral-600 dark:text-neutral-400">
                          {p.category}
                        </td>
                        <td className="p-3 text-neutral-500">
                          {p.runtimeEngine || 'TypeScript'}
                        </td>
                        <td className="p-3 text-neutral-500">
                          {p.memoryFootprint || '12.0 MB'}
                        </td>
                        <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">
                          {p.benchmarkMetric || p.metrics.latency}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {p.liveDemoUrl && (
                              <a
                                href={p.liveDemoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                                title="Open Live Demo"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <a
                              href={p.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                              title="View Source on GitHub"
                            >
                              <Github className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsApp;
