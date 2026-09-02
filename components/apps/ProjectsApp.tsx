'use client';

import React, { useState } from 'react';
import { ProjectItem } from '@/types/os';
import {
  Folder,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Search,
} from 'lucide-react';

const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'Bharat Dekho (BHARAT-DEKHO)',
    tagline: 'AI-Powered Indian Tourism & Digital Heritage Portal in Next.js 15 & Gemini AI',
    category: 'AI & WebGL',
    description:
      'Engineered an immersive national digital heritage portal featuring Gemini AI-powered personalized itinerary generator, 3D interactive cultural artifacts museum via Three.js, state-by-state travel guides, and Lenis smooth momentum scrolling.',
    architectureNotes: 'Integrated Google Gemini 1.5 Flash API for multi-day contextual itineraries, custom Three.js GLTF artifact loaders with OrbitControls, and Framer Motion layout transitions.',
    metrics: {
      latency: 'Sub-120ms AI',
      throughput: '60 FPS 3D Canvas',
      uptime: 'Live on GitHub Pages',
    },
    technologies: ['Next.js 15', 'Gemini AI', 'Three.js', 'React', 'TypeScript', 'Framer Motion', 'Tailwind CSS', 'Lenis Scroll'],
    githubUrl: 'https://github.com/AP-boi/BHARAT-DEKHO',
    liveDemoUrl: 'https://ap-boi.github.io/BHARAT-DEKHO/',
    apiEndpoint: 'https://ap-boi.github.io/BHARAT-DEKHO/',
    featured: true,
  },
  {
    id: 'proj-2',
    title: 'PhysX Studio',
    tagline: 'Real-Time 3D Physics Sandbox & CAD Playground with Rapier 3D',
    category: 'AI & WebGL',
    description:
      'Built a real-time 3D physics sandbox and CAD playground allowing users to spawn 3D objects, tweak gravitational properties, trigger dynamic explosions, and test rigid-body collision meshes in real time.',
    architectureNotes: 'Powered by React Three Fiber, Rapier 3D WebAssembly physics engine, and Three.js custom lighting shaders.',
    metrics: {
      latency: '60 FPS Physics',
      throughput: 'WASM Physics Engine',
      uptime: 'Open Source',
    },
    technologies: ['React', 'Three.js', 'Rapier 3D', 'TypeScript', 'Tailwind CSS', 'WASM'],
    githubUrl: 'https://github.com/AP-boi/PhysX-Studio',
    apiEndpoint: 'https://github.com/AP-boi/PhysX-Studio',
    featured: true,
  },
  {
    id: 'proj-3',
    title: 'Flow OS',
    tagline: 'Web-Based Desktop Operating System for Deep Work & Focus Sessions',
    category: 'Full-Stack & WebGL',
    description:
      'A web-based desktop operating system engineered for deep work, flow sessions, and distraction-free developer workflows with customizable workspaces and productivity utilities.',
    architectureNotes: 'Engineered with modular windowing state machines, fluid responsive layouts, and local state persistence.',
    metrics: {
      latency: 'Sub-16ms Frame',
      throughput: 'Live on Vercel',
      uptime: 'Always Online',
    },
    technologies: ['JavaScript', 'React', 'CSS3', 'Web OS Architecture', 'Vercel'],
    githubUrl: 'https://github.com/AP-boi/flow-os',
    liveDemoUrl: 'https://flowosv1.vercel.app',
    apiEndpoint: 'https://flowosv1.vercel.app',
    featured: true,
  },
  {
    id: 'proj-4',
    title: 'Cyber Ascension Game',
    tagline: '2D Cyberpunk Action Game Engine with Detroit-Style Branching Narrative',
    category: 'Game Development',
    description:
      'Constructed a 2D cyberpunk action and movement game engine with custom hitboxes, dynamic video cutscenes, fluid sword and dash combat, and interactive branching dialog systems.',
    architectureNotes: 'Engineered with 60 FPS HTML5 Canvas render loop, delta-time sprite animator, state-machine character physics, and custom Web Audio ambient soundscapes.',
    metrics: {
      latency: '16.6ms (60 FPS)',
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
    tagline: 'Interactive macOS Sonoma Desktop OS Simulator with Liquid Glass Physics',
    category: 'Full-Stack & WebGL',
    description:
      'Developed a fully interactive Anugamya OS desktop environment simulator featuring draggable multi-window management, liquid glassmorphism, AP Intelligence assistant, autonomous Tetris AI, and 3D camera motion grid.',
    architectureNotes: 'Built with Next.js 14 App Router, Zustand reactive window manager, Framer Motion spring physics, and React Three Fiber liquid canvas shaders.',
    metrics: {
      latency: 'Sub-16ms Framerate',
      throughput: '100% Client-Side',
      uptime: 'Always On',
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
    tagline: 'Modern Cloud Application & Web Interface Suite',
    category: 'UI/UX & Web',
    description:
      'Engineered OMNIS, a modern responsive web application featuring clean modular UI components, high-performance client rendering, and seamless cloud deployments.',
    architectureNotes: 'Built with Next.js, React, TypeScript, and modern component design patterns.',
    metrics: {
      latency: 'Fast Response',
      throughput: 'Vercel Deployed',
      uptime: 'Live on Vercel',
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
    tagline: 'Interactive 3D WebGL Classroom Pen Fight Action Simulation',
    category: 'Game Development',
    description:
      'A 3D WebGL physics-based desk game recreating the nostalgic classroom pen fight experience with custom collision physics, trajectory flick mechanics, and interactive camera controls.',
    architectureNotes: 'Built with Three.js rendering pipelines, TypeScript state management, and 3D mesh physics simulation.',
    metrics: {
      latency: '60 FPS Canvas',
      throughput: 'Zero Lag',
      uptime: 'Open Source',
    },
    technologies: ['TypeScript', 'Three.js', 'WebGL', 'Game Physics'],
    githubUrl: 'https://github.com/AP-boi/classroom-pen-fight-3d',
    apiEndpoint: 'https://github.com/AP-boi/classroom-pen-fight-3d',
    featured: false,
  },
  {
    id: 'proj-8',
    title: 'EESA Department Portal',
    tagline: 'Electrical Engineering Students Association Official Hub',
    category: 'UI/UX & Web',
    description:
      'Official web portal for the Electrical Engineering Students Association (EESA) featuring departmental announcements, event schedules, technical resources, and student community updates.',
    architectureNotes: 'Crafted with responsive mobile-first design, interactive tabs, and accessibility-compliant UI components.',
    metrics: {
      latency: 'Instant Load',
      throughput: '100% Mobile Ready',
      uptime: 'Open Source',
    },
    technologies: ['TypeScript', 'React', 'Tailwind CSS', 'Responsive Design'],
    githubUrl: 'https://github.com/AP-boi/eesa-website',
    apiEndpoint: 'https://github.com/AP-boi/eesa-website',
    featured: false,
  },
  {
    id: 'proj-9',
    title: 'Gravity Client',
    tagline: 'Custom Minecraft Java Client Engine & Low-Latency Event Bus',
    category: 'Systems & Java',
    description:
      'Engineered a performance-focused Java client architecture featuring modular draggable HUD overlays, runtime bytecode manipulation, low-latency event bus dispatching, and optimized OpenGL rendering.',
    architectureNotes: 'Engineered with clean object-oriented architecture, custom OpenGL rendering hooks, and packet handling pipelines.',
    metrics: {
      latency: 'Zero Overhead',
      throughput: '240+ FPS OpenGL',
      uptime: 'Open Source',
    },
    technologies: ['Java', 'OpenGL / LWJGL', 'Bytecode Instrumentation', 'Event-Driven Architecture'],
    githubUrl: 'https://github.com/AP-boi/gravity-client',
    apiEndpoint: 'https://github.com/AP-boi/gravity-client',
    featured: false,
  },
  {
    id: 'proj-10',
    title: 'diesel-ldr',
    tagline: 'Lightweight Asynchronous Module Loader & Cache Manager',
    category: 'Tools & Utilities',
    description:
      'Created an asynchronous resource loading pipeline in TypeScript designed for rapid module resolution, intelligent in-memory caching, and streaming buffer parsing.',
    architectureNotes: 'Constructed with strict TypeScript typing, Node.js stream pipelining, and zero runtime dependencies.',
    metrics: {
      latency: 'Sub-5ms Parsing',
      throughput: 'Async Stream',
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
    tagline: 'Decentralized Space & Telemetry Mesh Network Architecture',
    category: 'Systems & Java',
    description:
      'Conceptualized and architected STELLARNET, a decentralized mesh telemetry network protocol for resilient data transmission across distributed nodes.',
    architectureNotes: 'Distributed topology design with packet forwarding and node health diagnostics.',
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
  const [selectedCategory, setSelectedCategory] = useState<string>('All Projects');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All Projects', 'AI & WebGL', 'Game Development', 'Full-Stack & WebGL', 'Systems & Java', 'UI/UX & Web'];

  const filteredProjects = PROJECTS_DATA.filter((proj) => {
    const matchesCategory = selectedCategory === 'All Projects' || proj.category === selectedCategory;
    const matchesSearch =
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full space-y-3 text-slate-900 dark:text-slate-100 p-3 bg-white/95 dark:bg-slate-950 transition-colors">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="Back">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="Forward">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <img src="/icons/finder.png" alt="Finder" className="w-5 h-5 rounded-md object-contain shadow-xs" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">Finder — Projects & Repositories</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">({filteredProjects.length} items)</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-2 py-0.5 text-xs text-slate-800 dark:text-slate-200">
            <Search className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search Projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[11px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 w-36"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-3 overflow-hidden">
        <div className="w-full md:w-48 bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-2 space-y-1.5">
          <span className="px-2 text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 tracking-wider font-semibold">Categories</span>
          <div className="space-y-0.5">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-2 ${
                    isSelected ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <img src="/icons/folder.png" alt="" className={`w-3.5 h-3.5 object-contain ${isSelected ? 'brightness-200' : ''}`} />
                  <span className="truncate">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          <div className="grid grid-cols-1 gap-3">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-blue-500/60 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{proj.title}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/60 font-semibold">
                        {proj.category}
                      </span>
                      {proj.featured && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/60 font-semibold">
                          FEATURED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">{proj.tagline}</p>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {proj.liveDemoUrl && (
                      <a
                        href={proj.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200 transition-colors border border-blue-200 dark:border-blue-700 text-xs font-semibold flex items-center gap-1"
                        title="Open Live Demo"
                      >
                        <span>Demo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
                      title="View Source on GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{proj.description}</p>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200 dark:border-slate-700/80 text-center">
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-mono font-semibold">Performance</span>
                    <div className="text-xs font-bold text-cyan-600 dark:text-cyan-400 font-mono mt-0.5">{proj.metrics.latency}</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200 dark:border-slate-700/80 text-center">
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-mono font-semibold">Architecture</span>
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{proj.metrics.throughput}</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200 dark:border-slate-700/80 text-center">
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-mono font-semibold">Availability</span>
                    <div className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono mt-0.5">{proj.metrics.uptime}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.technologies.map((tech) => (
                    <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsApp;
