'use client';

import React, { useState } from 'react';
import { AchievementItem } from '@/types/os';
import { CheckCircle2, ExternalLink, Search, Share2 } from 'lucide-react';

const ACHIEVEMENTS_DATA: AchievementItem[] = [
  {
    id: 'ach-1',
    title: 'Bharat Dekho (Chalo Dekhe Bharat) - AI Tourism & Digital Heritage Portal',
    organization: 'Independent Engineering Release',
    category: 'Project Launch',
    date: '2026',
    description:
      'Engineered an immersive national digital heritage portal with AI itinerary planning powered by Google Gemini, 3D interactive museum with Three.js GLTF artifact renders, state travel guides, and Lenis smooth momentum scrolling.',
    metrics: [
      { label: 'AI Synthesis Latency', value: 'Sub-120ms', improvement: 'Gemini 1.5' },
      { label: '3D WebGL Framerate', value: '60 FPS', improvement: 'Three.js' },
      { label: 'Heritage Coverage', value: '28+ States', improvement: 'Interactive' },
    ],
    proofUrl: 'https://github.com/AP-boi/BHARAT-DEKHO',
    verified: true,
    tags: ['Next.js 15', 'Gemini AI', 'Three.js', 'React', 'TypeScript', 'Framer Motion'],
  },
  {
    id: 'ach-2',
    title: 'Cyber Ascension - 2D Cyberpunk Action Game Engine',
    organization: 'Interactive Game Dev Lab',
    category: 'Game Release',
    date: '2026',
    description:
      'Engineered a fast-paced 2D cyberpunk combat engine on HTML5 Canvas featuring real-time collision hitboxes, fluid sword combat mechanics, dynamic video cutscenes, and Detroit: Become Human style branching dialog trees.',
    metrics: [
      { label: 'Canvas Framerate', value: '60 FPS', improvement: 'Zero Lag' },
      { label: 'Combat Responsiveness', value: 'Instant', improvement: 'Sub-frame' },
      { label: 'Platform Deployment', value: 'Netlify', improvement: 'Live Web' },
    ],
    proofUrl: 'https://github.com/AP-boi/cyber-ascension-game',
    verified: true,
    tags: ['JavaScript', 'HTML5 Canvas', 'Web Audio API', 'Game Engine', 'Netlify'],
  },
  {
    id: 'ach-3',
    title: 'macOS Sonoma WebGL Desktop OS Portfolio',
    organization: 'Creative Web Systems',
    category: 'Engineering Milestone',
    date: '2026',
    description:
      'Constructed a production-ready WebGL desktop environment featuring liquid glassmorphism, draggable multi-window architecture with Zustand, AP Intelligence assistant, and autonomous AI Tetris engine.',
    metrics: [
      { label: 'Liquid Physics Framerate', value: '60 FPS', improvement: 'R3F / Three.js' },
      { label: 'Window State Latency', value: '0ms', improvement: 'Zustand Store' },
      { label: 'Interactive Apps', value: '8 Native Apps', improvement: 'Mac-like UX' },
    ],
    proofUrl: 'https://github.com/AP-boi/Anugamyas-Portofolio',
    verified: true,
    tags: ['Next.js 14', 'React Three Fiber', 'Three.js', 'Zustand', 'Tailwind CSS'],
  },
  {
    id: 'ach-4',
    title: 'AirPure Delhi & Open Source Software Portfolio',
    organization: 'Open Source Community',
    category: 'Open Source',
    date: '2025-2026',
    description:
      'Authored open-source developer repositories spanning Next.js, Java client utilities, and iOS-styled environmental air quality telemetry platforms.',
    metrics: [
      { label: 'Active Repositories', value: '8 Projects', improvement: 'Public Code' },
      { label: 'Primary Languages', value: 'TypeScript / JS / Java', improvement: 'Full Stack' },
    ],
    proofUrl: 'https://github.com/AP-boi',
    verified: true,
    tags: ['Open Source', 'UI/UX', 'Glassmorphism', 'TypeScript', 'Java'],
  },
];

export const AchievementsApp: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<AchievementItem>(ACHIEVEMENTS_DATA[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('All Notes');

  const filteredItems = ACHIEVEMENTS_DATA.filter(
    (item) =>
      (selectedFolder === 'All Notes' || item.category === selectedFolder) &&
      (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="flex flex-col h-full space-y-2 text-slate-900 dark:text-slate-100 p-3 bg-white/95 dark:bg-slate-950 transition-colors">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <img src="/icons/notes.png" alt="" className="w-4 h-4 rounded object-contain shadow-xs" />
            <span className="font-bold text-xs text-slate-900 dark:text-white">Notes — Achievements & Milestones</span>
          </div>
          <div className="h-3 w-px bg-slate-300 dark:bg-slate-700" />
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{filteredItems.length} Notes</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-2 py-0.5 text-xs text-slate-800 dark:text-slate-200">
            <Search className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search Notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[11px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 w-28"
            />
          </div>
          <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="Share Note">
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-3 overflow-hidden pt-1">
        <div className="w-full md:w-5/12 bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl overflow-y-auto divide-y divide-slate-200 dark:divide-slate-800">
          {filteredItems.map((item) => {
            const isSelected = selectedItem.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-3 cursor-pointer transition-colors ${
                  isSelected ? 'bg-amber-100/80 dark:bg-amber-950/40 border-l-2 border-amber-600 font-medium' : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider">{item.category}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{item.date}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1 line-clamp-1">{item.title}</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

        <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs rounded-xl p-4 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 font-bold uppercase">
                  {selectedItem.category}
                </span>
                {selectedItem.verified && (
                  <span className="flex items-center space-x-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>VERIFIED</span>
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mt-2 leading-snug">{selectedItem.title}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1 font-medium">
                {selectedItem.organization} • {selectedItem.date}
              </p>
            </div>

            <a
              href={selectedItem.proofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/40 hover:bg-amber-100 dark:hover:bg-amber-900/70 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700 transition-all text-xs font-bold flex items-center space-x-1.5 whitespace-nowrap shadow-xs"
            >
              <span>View Source</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">Overview</h4>
            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700 font-medium">
              {selectedItem.description}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">Key Highlights</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {selectedItem.metrics.map((metric) => (
                <div key={metric.label} className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">{metric.label}</span>
                  <div className="text-sm font-bold text-amber-700 dark:text-amber-400 mt-1 font-mono">{metric.value}</div>
                  <span className="text-[9px] text-emerald-700 dark:text-emerald-400 font-mono font-semibold">{metric.improvement}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <div className="flex flex-wrap gap-1.5">
              {selectedItem.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsApp;
