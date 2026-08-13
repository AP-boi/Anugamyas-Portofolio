'use client';

import React, { useState } from 'react';
import {
  Github,
  Star,
  GitFork,
  ExternalLink,
  GitCommit,
  Flame,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Lock,
  Share2,
  Plus,
  Search,
  ShieldCheck,
} from 'lucide-react';

const TOP_REPOS = [
  {
    name: 'AegisMesh-ZeroTrust',
    description: 'Ultra-low latency Rust & eBPF microservice gateway with mTLS consensus.',
    stars: 840,
    forks: 112,
    language: 'Rust',
    langColor: 'bg-amber-600',
  },
  {
    name: 'VectorRAG-Engine',
    description: 'Sub-20ms vector similarity search engine powered by pgvector & HNSW graphs.',
    stars: 620,
    forks: 84,
    language: 'TypeScript',
    langColor: 'bg-blue-500',
  },
  {
    name: 'Portfolio-OS',
    description: 'Next.js 14 WebGL Operating System simulator with R3F liquid mesh canvas.',
    stars: 1250,
    forks: 190,
    language: 'TypeScript',
    langColor: 'bg-blue-500',
  },
];

export const GitHubApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'repos' | 'streak'>('profile');
  const [urlInput, setUrlInput] = useState('https://github.com/AP-boi');

  return (
    <div className="flex flex-col h-full space-y-3 text-slate-900 -m-2 p-3 bg-white/90 rounded-b-xl">
      {/* Authentic macOS Safari Window Toolbar */}
      <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
        {/* Navigation Buttons */}
        <div className="flex items-center space-x-1">
          <button className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors" title="Back">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors" title="Forward">
            <ChevronRight className="w-4 h-4" />
          </button>
          <button className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors" title="Reload">
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Safari URL Address Bar */}
        <div className="flex-1 flex items-center space-x-2 bg-slate-100 border border-slate-300 rounded-lg px-3 py-1 text-xs text-slate-800 focus-within:border-blue-500 transition-colors shadow-inner">
          <Lock className="w-3 h-3 text-emerald-600" />
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="bg-transparent border-none outline-none w-full font-mono text-[11px] text-slate-900"
          />
        </div>

        {/* Safari Action Controls */}
        <div className="flex items-center space-x-1">
          <button className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors" title="Share">
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <a
            href="https://github.com/AP-boi"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded hover:bg-slate-100 text-cyan-600 hover:text-cyan-800 transition-colors"
            title="Open in new window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Safari Tab Bar */}
      <div className="flex items-center space-x-1 text-xs border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3 py-1 rounded-t-lg font-medium transition-colors flex items-center space-x-1.5 ${
            activeTab === 'profile'
              ? 'bg-white text-slate-900 border-t border-x border-slate-300 shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Github className="w-3.5 h-3.5 text-purple-600" />
          <span>Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('repos')}
          className={`px-3 py-1 rounded-t-lg font-medium transition-colors flex items-center space-x-1.5 ${
            activeTab === 'repos'
              ? 'bg-white text-slate-900 border-t border-x border-slate-300 shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>Repositories</span>
        </button>
        <button
          onClick={() => setActiveTab('streak')}
          className={`px-3 py-1 rounded-t-lg font-medium transition-colors flex items-center space-x-1.5 ${
            activeTab === 'streak'
              ? 'bg-white text-slate-900 border-t border-x border-slate-300 shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-600" />
          <span>Commit Activity</span>
        </button>
      </div>

      {/* Web Page Viewport Content */}
      <div className="flex-1 overflow-auto space-y-4 pt-1">
        {/* GitHub Profile Banner Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 via-slate-50 to-blue-50 border border-purple-200 shadow-sm gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-purple-100 border border-purple-200 text-purple-700">
              <Github className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-900 font-mono">github.com/AP-boi</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-100 text-purple-800 border border-purple-200 font-semibold">
                  VERIFIED ARCHITECT
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                Full-Stack & Security Systems Architect • Open Source Core Contributor
              </p>
            </div>
          </div>

          <a
            href="https://github.com/AP-boi"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-md"
          >
            <span>Follow on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-[10px] font-mono uppercase font-semibold">
              <span>Total Stars</span>
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono mt-1">2,710+</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-[10px] font-mono uppercase font-semibold">
              <span>Current Streak</span>
              <Flame className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <div className="text-lg font-bold text-rose-600 font-mono mt-1">142 Days</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-[10px] font-mono uppercase font-semibold">
              <span>Commits (2025-2026)</span>
              <GitCommit className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-lg font-bold text-emerald-700 font-mono mt-1">1,842</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-[10px] font-mono uppercase font-semibold">
              <span>Public Repos</span>
              <BookOpen className="w-3.5 h-3.5 text-cyan-600" />
            </div>
            <div className="text-lg font-bold text-cyan-700 font-mono mt-1">38</div>
          </div>
        </div>

        {/* Featured Repositories Showcase */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Pinned Repositories</h3>
            <span className="text-[11px] text-purple-700 font-mono font-semibold">Updated today</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TOP_REPOS.map((repo) => (
              <div
                key={repo.name}
                className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-purple-400 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 font-mono hover:underline cursor-pointer">{repo.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-100 text-slate-700 font-mono border border-slate-200">Public</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-2 line-clamp-2 leading-relaxed font-medium">{repo.description}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-100 mt-3 font-mono">
                  <div className="flex items-center space-x-1.5">
                    <span className={`w-2 h-2 rounded-full ${repo.langColor}`} />
                    <span>{repo.language}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 text-amber-600">
                      <Star className="w-3 h-3 fill-amber-500" />
                      <span className="font-mono text-[10px]">{repo.stars}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-500">
                      <GitFork className="w-3 h-3" />
                      <span className="font-mono text-[10px]">{repo.forks}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubApp;
