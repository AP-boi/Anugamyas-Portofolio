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
  Grid,
  List,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
} from 'lucide-react';

const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'AegisMesh',
    tagline: 'Zero-Trust Distributed Mesh Gateway in Rust & eBPF',
    category: 'Distributed Systems',
    description:
      'Engineered an enterprise edge security gateway enforcing zero-trust identity verification via eBPF kernel probes. Replaced traditional Envoy proxy bottleneck to sustain 150K concurrent streams.',
    architectureNotes: 'Reduced context-switch overhead by compiling proxy routing logic down to eBPF bytecode loaded directly into Linux kernel sockets.',
    metrics: {
      latency: '2.1 ms P99',
      throughput: '150,000 req/s',
      uptime: '99.999% SLA',
    },
    technologies: ['Rust', 'eBPF', 'gRPC', 'PostgreSQL', 'Docker', 'Kubernetes'],
    githubUrl: 'https://github.com/AP-boi',
    liveDemoUrl: 'https://github.com/AP-boi',
    apiEndpoint: '/api/v1/gateway/healthcheck',
    featured: true,
  },
  {
    id: 'proj-2',
    title: 'VectorRAG Engine',
    tagline: 'Sub-20ms Vector Search powered by pgvector & HNSW',
    category: 'AI / Machine Learning',
    description:
      'Built a custom retrieval-augmented generation engine with streaming LLM token delivery and custom HNSW index tuning for semantic documentation search.',
    architectureNotes: 'Tuned pgvector HNSW m=16, ef_construction=64 to maximize recall rate while executing vector distance queries in under 18ms.',
    metrics: {
      latency: '18.4 ms',
      throughput: '12,500 qps',
      uptime: '99.98%',
    },
    technologies: ['Next.js 14', 'Supabase', 'pgvector', 'OpenAI API', 'TypeScript'],
    githubUrl: 'https://github.com/AP-boi',
    apiEndpoint: '/api/v1/vector/search',
    featured: true,
  },
  {
    id: 'proj-3',
    title: 'Portfolio OS',
    tagline: 'Interactive WebGL Desktop Simulator with 3D Scenery',
    category: 'Interactive Graphics',
    description:
      'Constructed a production-ready WebGL desktop environment featuring glassmorphic physics, isolated window state engine, and interactive 3D camera parallax.',
    architectureNotes: 'Utilized R3F dynamic imports ({ ssr: false }) and on-demand frame loops to lock LCP under 1.2 seconds and CLS to 0.00.',
    metrics: {
      latency: '16.6 ms (60 FPS)',
      throughput: '100% Client-Side',
      uptime: '100%',
    },
    technologies: ['React Three Fiber', 'Three.js', 'Framer Motion', 'Zustand', 'Tailwind CSS'],
    githubUrl: 'https://github.com/AP-boi',
    apiEndpoint: '/api/v1/telemetry/ping',
    featured: false,
  },
];

export const ProjectsApp: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Projects');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProjects = PROJECTS_DATA.filter((proj) => {
    const matchesCategory = selectedCategory === 'All Projects' || proj.category === selectedCategory;
    const matchesSearch =
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full space-y-3 text-slate-900 -m-2 p-3 bg-white/90 rounded-b-xl">
      {/* macOS Finder Navigation Toolbar */}
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
          <span className="text-xs font-semibold text-slate-900">Projects & Architecture</span>
          <span className="text-[11px] font-mono text-slate-500">({filteredProjects.length} items)</span>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 bg-slate-100 border border-slate-300 rounded-md px-2 py-0.5 text-xs text-slate-800">
            <Search className="w-3 h-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search Projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[11px] text-slate-900 placeholder:text-slate-400 w-32"
            />
          </div>
        </div>
      </div>

      {/* Dual Pane Finder Viewport */}
      <div className="flex-1 flex flex-col md:flex-row gap-3 overflow-hidden">
        {/* Finder Left Sidebar */}
        <div className="w-full md:w-44 bg-slate-100/80 border border-slate-200 rounded-xl p-2 space-y-1.5">
          <span className="px-2 text-[10px] font-mono uppercase text-slate-500 tracking-wider font-semibold">Favorites</span>
          <div className="space-y-0.5">
            {['All Projects', 'Distributed Systems', 'AI / Machine Learning', 'Interactive Graphics'].map((cat) => {
              const label = cat === 'AI / Machine Learning' ? 'AI / ML' : cat;
              const isSelected = selectedCategory === (cat === 'AI / ML' ? 'AI / Machine Learning' : cat);
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === 'AI / ML' ? 'AI / Machine Learning' : cat)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-2 ${
                    isSelected ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  <Folder className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
                  <span className="truncate">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Finder Main Grid View */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          <div className="grid grid-cols-1 gap-3">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm hover:border-blue-500/60 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-slate-900">{proj.title}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                        {proj.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-1">{proj.tagline}</p>
                  </div>

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

                <p className="text-xs text-slate-700 leading-relaxed">{proj.description}</p>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center">
                    <span className="text-[9px] text-slate-500 uppercase font-mono font-semibold">P99 Latency</span>
                    <div className="text-xs font-bold text-cyan-700 font-mono mt-0.5">{proj.metrics.latency}</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center">
                    <span className="text-[9px] text-slate-500 uppercase font-mono font-semibold">Throughput</span>
                    <div className="text-xs font-bold text-emerald-700 font-mono mt-0.5">{proj.metrics.throughput}</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center">
                    <span className="text-[9px] text-slate-500 uppercase font-mono font-semibold">SLA Uptime</span>
                    <div className="text-xs font-bold text-purple-700 font-mono mt-0.5">{proj.metrics.uptime}</div>
                  </div>
                </div>

                {/* Tech Pills */}
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
