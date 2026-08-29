'use client';

import React, { useState, useMemo } from 'react';
import {
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
  Search,
  Check,
  Code2,
  Calendar,
  GitPullRequest,
  Tag,
  Sparkles,
} from 'lucide-react';

interface RepoItem {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  langColor: string;
  updated: string;
  topics: string[];
  url: string;
}

const REPOSITORIES: RepoItem[] = [
  {
    name: 'BHARAT-DEKHO',
    description: '🇮🇳 AI-powered Indian Tourism & Digital Heritage Portal with AI Itinerary Planner, 3D Museum, WebGL Photo Gallery & Heritage Quiz.',
    stars: 12,
    forks: 3,
    language: 'TypeScript',
    langColor: 'bg-blue-500',
    updated: 'Updated recently',
    topics: ['ai', 'framer-motion', 'gemini-ai', 'heritage', 'india', 'nextjs', 'threejs', 'tourism'],
    url: 'https://github.com/AP-boi/BHARAT-DEKHO',
  },
  {
    name: 'cyber-ascension-game',
    description: 'CYBER ASCENSION // 2D Cyberpunk Action Game Engine with Video Cutscenes & Detroit-style Branching Narrative.',
    stars: 8,
    forks: 2,
    language: 'JavaScript',
    langColor: 'bg-amber-400',
    updated: 'Updated recently',
    topics: ['javascript', 'canvas', 'game-engine', 'cyberpunk', 'web-audio', 'netlify'],
    url: 'https://github.com/AP-boi/cyber-ascension-game',
  },
  {
    name: 'Anugamyas-Portofolio',
    description: 'macOS Desktop OS Portfolio — interactive desktop environment with liquid glass UI, Tetris AI, WebGL effects & Siri Intelligence.',
    stars: 15,
    forks: 4,
    language: 'TypeScript',
    langColor: 'bg-blue-500',
    updated: 'Updated today',
    topics: ['nextjs', 'react-three-fiber', 'threejs', 'zustand', 'framer-motion', 'macos'],
    url: 'https://github.com/AP-boi/Anugamyas-Portofolio',
  },
  {
    name: 'airpure-delhi',
    description: 'iOS-inspired air purifier platform for Delhi - Premium glassmorphic design with live AQI tracking UI.',
    stars: 5,
    forks: 1,
    language: 'HTML',
    langColor: 'bg-orange-500',
    updated: 'Updated recently',
    topics: ['html5', 'css3', 'glassmorphism', 'delhi-aqi', 'responsive-design'],
    url: 'https://github.com/AP-boi/airpure-delhi',
  },
  {
    name: 'gravity-client',
    description: 'Custom Java gaming client utility and runtime modification engine with modular HUD overlays and event dispatching.',
    stars: 6,
    forks: 1,
    language: 'Java',
    langColor: 'bg-red-500',
    updated: 'Updated recently',
    topics: ['java', 'jvm', 'opengl', 'game-architecture', 'event-bus'],
    url: 'https://github.com/AP-boi/gravity-client',
  },
  {
    name: 'diesel-ldr',
    description: 'Dynamic lightweight resource loader and system utility framework in TypeScript with streaming buffer parsing.',
    stars: 4,
    forks: 1,
    language: 'TypeScript',
    langColor: 'bg-blue-500',
    updated: 'Updated recently',
    topics: ['typescript', 'nodejs', 'streams', 'cli-tools', 'caching'],
    url: 'https://github.com/AP-boi/diesel-ldr',
  },
  {
    name: 'LIFEOS-X',
    description: 'Comprehensive personal productivity and operating system framework for automated life workflows.',
    stars: 7,
    forks: 2,
    language: 'JavaScript',
    langColor: 'bg-amber-400',
    updated: 'Updated recently',
    topics: ['productivity', 'system-framework', 'automation', 'open-source'],
    url: 'https://github.com/AP-boi/LIFEOS-X',
  },
  {
    name: 'Dumb-Calculator',
    description: 'Playful and interactive web calculator interface with retro digital display and smooth animations.',
    stars: 2,
    forks: 0,
    language: 'HTML',
    langColor: 'bg-orange-500',
    updated: 'Updated recently',
    topics: ['html5', 'css3', 'calculator', 'web-ui'],
    url: 'https://github.com/AP-boi/Dumb-Calculator',
  },
];

type TabType = 'profile' | 'repos' | 'streak';

const TAB_URL_MAP: Record<TabType, string> = {
  profile: 'https://github.com/AP-boi',
  repos: 'https://github.com/AP-boi?tab=repositories',
  streak: 'https://github.com/AP-boi?tab=contributions',
};

// Generate realistic commit distribution grid (52 weeks x 7 days)
const generateHeatmap = () => {
  const weeks: { date: string; count: number; level: number }[][] = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 52 * 7 + 1);

  let cur = new Date(startDate);
  for (let w = 0; w < 52; w++) {
    const week: { date: string; count: number; level: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const isWeekend = d === 0 || d === 6;
      // Weighted random commits: higher during weekdays
      const seed = Math.sin(w * 7 + d * 13) * 10000;
      const rand = seed - Math.floor(seed);
      let count = 0;
      if (rand > 0.25) {
        count = isWeekend ? Math.floor(rand * 6) : Math.floor(rand * 14) + 1;
      }
      const level = count === 0 ? 0 : count <= 3 ? 1 : count <= 7 ? 2 : count <= 11 ? 3 : 4;
      week.push({
        date: cur.toISOString().split('T')[0],
        count,
        level,
      });
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
};

export const GitHubApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [urlInput, setUrlInput] = useState<string>(TAB_URL_MAP.profile);
  const [navHistory, setNavHistory] = useState<TabType[]>(['profile']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [repoSearch, setRepoSearch] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [hoveredCell, setHoveredCell] = useState<{ date: string; count: number } | null>(null);

  const heatmapWeeks = useMemo(() => generateHeatmap(), []);

  const switchTab = (tab: TabType, pushHistory = true) => {
    setActiveTab(tab);
    setUrlInput(TAB_URL_MAP[tab]);
    if (pushHistory) {
      const newHist = navHistory.slice(0, historyIndex + 1);
      newHist.push(tab);
      setNavHistory(newHist);
      setHistoryIndex(newHist.length - 1);
    }
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      setHistoryIndex(nextIdx);
      const tab = navHistory[nextIdx];
      setActiveTab(tab);
      setUrlInput(TAB_URL_MAP[tab]);
    }
  };

  const handleForward = () => {
    if (historyIndex < navHistory.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      const tab = navHistory[nextIdx];
      setActiveTab(tab);
      setUrlInput(TAB_URL_MAP[tab]);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lower = urlInput.toLowerCase();
    if (lower.includes('repositories') || lower.includes('repos')) {
      switchTab('repos');
    } else if (lower.includes('contributions') || lower.includes('streak') || lower.includes('activity')) {
      switchTab('streak');
    } else {
      switchTab('profile');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(urlInput);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const languages = ['All', 'TypeScript', 'JavaScript', 'Java', 'HTML'];

  const filteredRepos = REPOSITORIES.filter((repo) => {
    const matchesLang = selectedLanguage === 'All' || repo.language === selectedLanguage;
    const matchesSearch =
      repo.name.toLowerCase().includes(repoSearch.toLowerCase()) ||
      repo.description.toLowerCase().includes(repoSearch.toLowerCase()) ||
      repo.topics.some((t) => t.toLowerCase().includes(repoSearch.toLowerCase()));
    return matchesLang && matchesSearch;
  });

  const getHeatmapColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-emerald-200 border-emerald-300';
      case 2:
        return 'bg-emerald-400 border-emerald-500';
      case 3:
        return 'bg-emerald-600 border-emerald-700';
      case 4:
        return 'bg-emerald-800 border-emerald-900';
      default:
        return 'bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3 text-slate-900 p-3 bg-white/95">
      {/* Authentic macOS Safari Window Toolbar */}
      <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
        {/* Navigation Buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={handleBack}
            disabled={historyIndex === 0}
            className={`p-1 rounded transition-colors ${
              historyIndex > 0 ? 'hover:bg-slate-100 text-slate-700 cursor-pointer' : 'text-slate-300 cursor-not-allowed'
            }`}
            title="Back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleForward}
            disabled={historyIndex >= navHistory.length - 1}
            className={`p-1 rounded transition-colors ${
              historyIndex < navHistory.length - 1
                ? 'hover:bg-slate-100 text-slate-700 cursor-pointer'
                : 'text-slate-300 cursor-not-allowed'
            }`}
            title="Forward"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => switchTab(activeTab, false)}
            className="p-1 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
            title="Reload"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Safari URL Address Bar */}
        <form
          onSubmit={handleUrlSubmit}
          className="flex-1 flex items-center space-x-2 bg-slate-100 border border-slate-300 rounded-lg px-3 py-1 text-xs text-slate-800 focus-within:border-blue-500 focus-within:bg-white transition-colors shadow-inner"
        >
          <Lock className="w-3 h-3 text-emerald-600 flex-shrink-0" />
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="bg-transparent border-none outline-none w-full font-mono text-[11px] text-slate-900"
            placeholder="https://github.com/AP-boi"
          />
        </form>

        {/* Safari Action Controls */}
        <div className="flex items-center space-x-1">
          <button
            onClick={handleShare}
            className="p-1 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors relative"
            title="Share URL"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
          <a
            href={urlInput}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded hover:bg-slate-100 text-blue-600 hover:text-blue-800 transition-colors"
            title="Open in new browser tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Safari Tab Bar */}
      <div className="flex items-center space-x-1 text-xs border-b border-slate-200 pb-2">
        <button
          onClick={() => switchTab('profile')}
          className={`px-3 py-1 rounded-t-lg font-medium transition-colors flex items-center space-x-1.5 ${
            activeTab === 'profile'
              ? 'bg-white text-slate-900 border-t border-x border-slate-300 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <img src="/icons/github.png" alt="" className="w-3.5 h-3.5 rounded object-cover shadow-xs" />
          <span>Overview</span>
        </button>
        <button
          onClick={() => switchTab('repos')}
          className={`px-3 py-1 rounded-t-lg font-medium transition-colors flex items-center space-x-1.5 ${
            activeTab === 'repos'
              ? 'bg-white text-slate-900 border-t border-x border-slate-300 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>Repositories ({REPOSITORIES.length})</span>
        </button>
        <button
          onClick={() => switchTab('streak')}
          className={`px-3 py-1 rounded-t-lg font-medium transition-colors flex items-center space-x-1.5 ${
            activeTab === 'streak'
              ? 'bg-white text-slate-900 border-t border-x border-slate-300 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-600" />
          <span>Commit Activity</span>
        </button>
      </div>

      {/* Web Page Viewport Content */}
      <div className="flex-1 overflow-auto space-y-4 pt-1 pr-1">
        {/* ================= TAB 1: PROFILE OVERVIEW ================= */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            {/* GitHub Profile Banner Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 via-slate-50 to-blue-50 border border-purple-200 shadow-xs gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-1 rounded-2xl bg-white border border-purple-200 shadow-xs flex items-center justify-center">
                  <img src="/icons/github.png" alt="GitHub" className="w-10 h-10 rounded-xl object-cover" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base font-bold text-slate-900 font-mono">github.com/AP-boi</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-100 text-purple-800 border border-purple-200 font-semibold">
                      VERIFIED DEVELOPER
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">
                    Creative Developer & WebGL Systems Builder • Next.js, Three.js & Game Engines
                  </p>
                </div>
              </div>

              <a
                href="https://github.com/AP-boi"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-sm"
              >
                <span>Follow on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-[10px] font-mono uppercase font-semibold">
                  <span>Public Repos</span>
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="text-lg font-bold text-slate-900 font-mono mt-1">{REPOSITORIES.length} Projects</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-[10px] font-mono uppercase font-semibold">
                  <span>Primary Stacks</span>
                  <Code2 className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <div className="text-lg font-bold text-purple-700 font-mono mt-1">Next.js & Three.js</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-[10px] font-mono uppercase font-semibold">
                  <span>Active Deployments</span>
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <div className="text-lg font-bold text-rose-600 font-mono mt-1">3 Live Apps</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-[10px] font-mono uppercase font-semibold">
                  <span>Specialization</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-lg font-bold text-amber-700 font-mono mt-1">AI & WebGL 3D</div>
              </div>
            </div>

            {/* Pinned Repositories Showcase */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Pinned Repositories</h3>
                <button
                  onClick={() => switchTab('repos')}
                  className="text-[11px] text-purple-700 hover:text-purple-900 font-mono font-semibold hover:underline"
                >
                  View all repositories →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {REPOSITORIES.slice(0, 3).map((repo) => (
                  <div
                    key={repo.name}
                    className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-purple-400 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 font-mono hover:text-purple-600 cursor-pointer">
                          {repo.name}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-100 text-slate-700 font-mono border border-slate-200">
                          Public
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-2 line-clamp-2 leading-relaxed font-medium">
                        {repo.description}
                      </p>
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

            {/* Languages Breakdown Bar */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 font-mono">
                <span className="flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-slate-500" />
                  Primary Languages & Tech Stack
                </span>
                <span className="text-slate-400 text-[11px]">Real GitHub Repository Codebase</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
                <div style={{ width: '48%' }} className="bg-blue-500" title="TypeScript 48%" />
                <div style={{ width: '26%' }} className="bg-amber-400" title="JavaScript 26%" />
                <div style={{ width: '14%' }} className="bg-red-500" title="Java 14%" />
                <div style={{ width: '12%' }} className="bg-orange-500" title="HTML/CSS 12%" />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-600 pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  TypeScript (48.0%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  JavaScript (26.0%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  Java (14.0%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  HTML/CSS (12.0%)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: REPOSITORIES CATALOG ================= */}
        {activeTab === 'repos' && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-200">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Find a repository..."
                  value={repoSearch}
                  onChange={(e) => setRepoSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              {/* Language Filter Pills */}
              <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-colors ${
                      selectedLanguage === lang
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Repositories List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredRepos.map((repo) => (
                <div
                  key={repo.name}
                  className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-xs text-blue-600 font-mono hover:underline flex items-center gap-1.5"
                      >
                        <span>{repo.name}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-100 text-slate-600 font-mono border border-slate-200">
                        Public
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium line-clamp-2">
                      {repo.description}
                    </p>

                    {/* Topics */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {repo.topics.map((topic) => (
                        <span
                          key={topic}
                          className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-blue-50 text-blue-700 border border-blue-200/60"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Repo Footer Metrics */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2.5 border-t border-slate-100 font-mono">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1.5">
                        <span className={`w-2 h-2 rounded-full ${repo.langColor}`} />
                        <span>{repo.language}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-amber-600">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>{repo.stars}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-500">
                        <GitFork className="w-3 h-3" />
                        <span>{repo.forks}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">{repo.updated}</span>
                  </div>
                </div>
              ))}
            </div>

            {filteredRepos.length === 0 && (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs font-mono">
                No repositories found matching your query "{repoSearch}".
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: COMMIT ACTIVITY & STREAK ================= */}
        {activeTab === 'streak' && (
          <div className="space-y-4">
            {/* Streak Summary Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl shadow-xs">
                <div className="flex items-center justify-between text-rose-700 text-[10px] font-mono uppercase font-bold">
                  <span>Active Streak</span>
                  <Flame className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-xl font-bold text-rose-800 font-mono mt-1">142 Days</div>
                <p className="text-[10px] text-rose-600 mt-0.5">Aug 2025 - Present</p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl shadow-xs">
                <div className="flex items-center justify-between text-amber-700 text-[10px] font-mono uppercase font-bold">
                  <span>Longest Streak</span>
                  <Sparkles className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-xl font-bold text-amber-800 font-mono mt-1">218 Days</div>
                <p className="text-[10px] text-amber-600 mt-0.5">Oct 2024 - May 2025</p>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl shadow-xs">
                <div className="flex items-center justify-between text-emerald-700 text-[10px] font-mono uppercase font-bold">
                  <span>Year Contributions</span>
                  <GitCommit className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl font-bold text-emerald-800 font-mono mt-1">1,842</div>
                <p className="text-[10px] text-emerald-600 mt-0.5">Past 52 weeks</p>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl shadow-xs">
                <div className="flex items-center justify-between text-purple-700 text-[10px] font-mono uppercase font-bold">
                  <span>Weekend Commits</span>
                  <GitPullRequest className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-xl font-bold text-purple-800 font-mono mt-1">412 Commits</div>
                <p className="text-[10px] text-purple-600 mt-0.5">22.3% of total</p>
              </div>
            </div>

            {/* Interactive 52-Week GitHub Heatmap Graph */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 font-mono">
                    1,842 contributions in the last year
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">Continuous delivery & open-source telemetry</p>
                </div>
                {hoveredCell && (
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 bg-slate-900 text-white rounded shadow-xs">
                    {hoveredCell.count} contribution{hoveredCell.count !== 1 ? 's' : ''} on {hoveredCell.date}
                  </span>
                )}
              </div>

              {/* Heatmap Grid Container */}
              <div className="overflow-x-auto pb-2 scrollbar-thin">
                <div className="flex gap-[3px] min-w-[700px]">
                  {heatmapWeeks.map((week, wIdx) => (
                    <div key={`week-${wIdx}`} className="flex flex-col gap-[3px]">
                      {week.map((day, dIdx) => (
                        <div
                          key={`day-${wIdx}-${dIdx}`}
                          onMouseEnter={() => setHoveredCell({ date: day.date, count: day.count })}
                          onMouseLeave={() => setHoveredCell(null)}
                          className={`w-[10px] h-[10px] rounded-[2px] border ${getHeatmapColor(
                            day.level
                          )} transition-all hover:scale-125 cursor-pointer`}
                          title={`${day.count} commits on ${day.date}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Heatmap Legend */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-100">
                <span>Learn how we count contributions</span>
                <div className="flex items-center space-x-1.5">
                  <span>Less</span>
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-slate-100 border border-slate-200" />
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-200 border border-emerald-300" />
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400 border border-emerald-500" />
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-600 border border-emerald-700" />
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-800 border border-emerald-900" />
                  <span>More</span>
                </div>
              </div>
            </div>

            {/* Recent Key PRs & Milestones */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-800 font-mono flex items-center gap-1.5">
                <GitPullRequest className="w-3.5 h-3.5 text-purple-600" />
                Recent High-Impact Pull Requests
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[9px] font-bold">MERGED</span>
                    <span className="text-slate-800 font-medium">feat: Gemini 1.5 Flash itinerary planner & 3D museum artifacts</span>
                  </div>
                  <span className="text-slate-400 text-[10px]">BHARAT-DEKHO #12</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[9px] font-bold">MERGED</span>
                    <span className="text-slate-800 font-medium">feat: 60 FPS cyberpunk canvas combat engine & branching narrative</span>
                  </div>
                  <span className="text-slate-400 text-[10px]">cyber-ascension #8</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[9px] font-bold">MERGED</span>
                    <span className="text-slate-800 font-medium">perf: liquid glassmorphism & responsive macOS window ecosystem</span>
                  </div>
                  <span className="text-slate-400 text-[10px]">Anugamyas-Portofolio #4</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubApp;
