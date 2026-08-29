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
    title: 'Bharat Dekho (Chalo Dekhe Bharat)',
    tagline: 'AI-Powered Indian Tourism & Digital Heritage Portal in Next.js 15 & Gemini AI',
    category: 'AI & WebGL',
    description:
      'Engineered an immersive national digital heritage portal featuring Gemini AI-powered personalized itinerary generator, 3D interactive cultural artifacts museum via Three.js, state-by-state travel guides, and Lenis smooth momentum scrolling.',
    architectureNotes: 'Integrated Google Gemini 1.5 Flash API for multi-day contextual itineraries, custom Three.js GLTF artifact loaders with OrbitControls, and Framer Motion layout transitions.',
    metrics: {
      latency: 'Sub-120ms AI',
      throughput: '60 FPS 3D Canvas',
      uptime: 'Live on Web',
    },
    technologies: ['Next.js 15', 'Gemini AI', 'Three.js', 'React', 'TypeScript', 'Framer Motion', 'Tailwind CSS', 'Lenis Scroll'],
    githubUrl: 'https://github.com/AP-boi/BHARAT-DEKHO',
    liveDemoUrl: 'https://ap-boi.github.io/BHARAT-DEKHO/',
    apiEndpoint: 'https://ap-boi.github.io/BHARAT-DEKHO/',
    featured: true,
  },
  {
    id: 'proj-2',
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
    id: 'proj-3',
    title: 'Anugamya Portfolio OS',
    tagline: 'Interactive macOS Sonoma Desktop OS Simulator with Liquid Glass Physics',
    category: 'Full-Stack & WebGL',
    description:
      'Developed a fully interactive Apple macOS desktop environment simulator featuring draggable multi-window management, liquid glassmorphism, Siri AI assistant, autonomous Tetris AI, and 3D camera motion grid.',
    architectureNotes: 'Built with Next.js 14 App Router, Zustand reactive window manager, Framer Motion spring physics, and React Three Fiber liquid canvas shaders.',
    metrics: {
      latency: 'Sub-16ms Framerate',
      throughput: '100% Client-Side',
      uptime: 'Always On',
    },
    technologies: ['Next.js 14', 'React Three Fiber', 'Three.js', 'Zustand', 'Framer Motion', 'Tailwind CSS'],
    githubUrl: 'https://github.com/AP-boi/Anugamyas-Portofolio',
    liveDemoUrl: 'https://anugamya.dev',
    apiEndpoint: 'https://anugamya.dev',
    featured: true,
  },
  {
    id: 'proj-4',
    title: 'AirPure Delhi',
    tagline: 'Real-Time Air Quality Index & PM2.5 Telemetry Dashboard',
    category: 'UI/UX & Web',
    description:
      'Built a live air pollution and environmental telemetry web portal for Delhi NCR featuring real-time AQI tracking, health advisory systems, and responsive hardware controllers.',
    architectureNotes: 'Crafted with Apple iOS weather aesthetics, real-time sensor API integration, and glassmorphic micro-interactions.',
    metrics: {
      latency: 'Instant Sync',
      throughput: 'Real-Time AQI',
      uptime: 'Live on Web',
    },
    technologies: ['Next.js', 'React', 'Tailwind CSS', 'Lucide Icons', 'API Integration'],
    githubUrl: 'https://github.com/AP-boi/AirPure-Delhi',
    liveDemoUrl: 'https://ap-boi.github.io/AirPure-Delhi/',
    apiEndpoint: 'https://ap-boi.github.io/AirPure-Delhi/',
    featured: true,
  },
  {
    id: 'proj-5',
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
    githubUrl: 'https://github.com/AP-boi/Gravity-Client',
    apiEndpoint: 'https://github.com/AP-boi/Gravity-Client',
    featured: false,
  },
  {
    id: 'proj-6',
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
    <div className="flex flex-col h-full space-y-3 text-slate-900 p-3 bg-white/95">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <button className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors" title="Back">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors" title="Forward">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center space-x-1.5">
            <img src="/icons/finder.png" alt="" className="w-4 h-4 rounded object-cover shadow-xs" />
            <span className="text-xs font-semibold text-slate-900">Projects & Repositories</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">({filteredProjects.length} items)</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 bg-slate-100 border border-slate-300 rounded-md px-2 py-0.5 text-xs text-slate-800">
            <Search className="w-3 h-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search Projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[11px] text-slate-900 placeholder:text-slate-400 w-36"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-3 overflow-hidden">
        <div className="w-full md:w-48 bg-slate-100/80 border border-slate-200 rounded-xl p-2 space-y-1.5">
          <span className="px-2 text-[10px] font-mono uppercase text-slate-500 tracking-wider font-semibold">Categories</span>
          <div className="space-y-0.5">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-2 ${
                    isSelected ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  <Folder className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
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
                className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-blue-500/60 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-slate-900">{proj.title}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                        {proj.category}
                      </span>
                      {proj.featured && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                          FEATURED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-1">{proj.tagline}</p>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {proj.liveDemoUrl && (
                      <a
                        href={proj.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors border border-blue-200 text-xs font-semibold flex items-center gap-1"
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
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
                      title="View Source on GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">{proj.description}</p>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center">
                    <span className="text-[9px] text-slate-500 uppercase font-mono font-semibold">Performance</span>
                    <div className="text-xs font-bold text-cyan-700 font-mono mt-0.5">{proj.metrics.latency}</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center">
                    <span className="text-[9px] text-slate-500 uppercase font-mono font-semibold">Architecture</span>
                    <div className="text-xs font-bold text-emerald-700 font-mono mt-0.5">{proj.metrics.throughput}</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center">
                    <span className="text-[9px] text-slate-500 uppercase font-mono font-semibold">Availability</span>
                    <div className="text-xs font-bold text-purple-700 font-mono mt-0.5">{proj.metrics.uptime}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.technologies.map((tech) => (
                    <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium">
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
