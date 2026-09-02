'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  Layers,
  Zap,
  Globe,
  Compass,
  ArrowRight,
  Sparkles,
  Loader2,
  ArrowUpRight,
  FileText,
  Bookmark,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useOSStore } from '@/store/useOSStore';

interface DuckDuckGoInstantAnswer {
  heading?: string;
  abstract?: string;
  abstractSource?: string;
  abstractUrl?: string;
  image?: string;
  relatedTopics?: Array<{ text: string; firstUrl: string }>;
}

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
    name: 'Anugamyas-Portofolio',
    description: 'macOS Desktop OS Portfolio — interactive desktop environment with liquid glass UI, Tetris AI, WebGL effects & full multi-window OS.',
    stars: 1,
    forks: 0,
    language: 'TypeScript',
    langColor: 'bg-blue-500',
    updated: 'Updated today',
    topics: ['nextjs', 'threejs', 'zustand', 'framer-motion', 'macos', 'portfolio'],
    url: 'https://github.com/AP-boi/Anugamyas-Portofolio',
  },
  {
    name: 'BHARAT-DEKHO',
    description: 'Interactive cultural heritage and tourism exploration platform featuring AI-assisted itineraries and 3D architectural showcases.',
    stars: 2,
    forks: 0,
    language: 'TypeScript',
    langColor: 'bg-blue-500',
    updated: 'Updated 3 days ago',
    topics: ['tourism', 'heritage', 'react', 'tailwind', 'gemini-ai', '3d-webgl'],
    url: 'https://github.com/AP-boi/BHARAT-DEKHO',
  },
  {
    name: 'PHYSX',
    description: 'GPU-accelerated rigid-body 2D/3D physics simulation engine in TypeScript and Three.js with real-time collision matrices.',
    stars: 1,
    forks: 0,
    language: 'TypeScript',
    langColor: 'bg-blue-500',
    updated: 'Updated 5 days ago',
    topics: ['physics-engine', 'threejs', 'simulation', 'webgl', 'math'],
    url: 'https://github.com/AP-boi/PHYSX',
  },
  {
    name: 'space-wars-2d',
    description: 'High-performance retro arcade arcade space shooter with particle systems, procedural waves, and sound synthesis.',
    stars: 2,
    forks: 0,
    language: 'JavaScript',
    langColor: 'bg-amber-400',
    updated: 'Updated 1 week ago',
    topics: ['game-development', 'canvas-api', 'arcade', 'retro', 'audio-synthesis'],
    url: 'https://github.com/AP-boi/space-wars-2d',
  },
  {
    name: 'Banking-Management-System-In-Java',
    description: 'Full-featured secure desktop banking management suite with transaction auditing, account ledger, and Swing UI.',
    stars: 2,
    forks: 0,
    language: 'Java',
    langColor: 'bg-red-500',
    updated: 'Updated 2 weeks ago',
    topics: ['java', 'swing-ui', 'banking-system', 'sql-database', 'security'],
    url: 'https://github.com/AP-boi/Banking-Management-System-In-Java',
  },
  {
    name: 'cyber-ascension',
    description: '60 FPS Canvas-based cyberpunk cyberpunk combat engine with dynamic neon lighting and skill progression trees.',
    stars: 1,
    forks: 0,
    language: 'JavaScript',
    langColor: 'bg-amber-400',
    updated: 'Updated 2 weeks ago',
    topics: ['cyberpunk', 'game-engine', 'html5-canvas', 'procedural-generation'],
    url: 'https://github.com/AP-boi/cyber-ascension',
  },
  {
    name: 'E-commerce-frontend',
    description: 'Modern e-commerce storefront with cart state management, checkout validation, and responsive mobile-first design.',
    stars: 1,
    forks: 0,
    language: 'HTML',
    langColor: 'bg-orange-500',
    updated: 'Updated last month',
    topics: ['ecommerce', 'responsive-design', 'shopping-cart', 'css-grid'],
    url: 'https://github.com/AP-boi/E-commerce-frontend',
  },
  {
    name: 'flowOS',
    description: 'Experimental browser operating system prototype exploring window hierarchies and multi-tasking workflows.',
    stars: 3,
    forks: 1,
    language: 'TypeScript',
    langColor: 'bg-blue-500',
    updated: 'Updated 1 month ago',
    topics: ['web-os', 'window-manager', 'react', 'virtual-desktop'],
    url: 'https://github.com/AP-boi/flowOS',
  },
];

type TabType = 'search' | 'profile' | 'repos' | 'streak' | 'webview';

const TAB_URL_MAP: Record<TabType, string> = {
  search: 'https://duckduckgo.com',
  profile: 'https://github.com/AP-boi',
  repos: 'https://github.com/AP-boi?tab=repositories',
  streak: 'https://github.com/AP-boi?tab=contributions',
  webview: 'https://en.wikipedia.org',
};

const QUICK_BOOKMARKS = [
  {
    name: 'DuckDuckGo',
    desc: 'Privacy & Open Web Search',
    url: 'https://duckduckgo.com',
    icon: '🦆',
    isSearch: true,
  },
  {
    name: 'Wikipedia',
    desc: 'The Free Encyclopedia',
    url: 'https://en.wikipedia.org',
    icon: '📖',
  },
  {
    name: 'GitHub',
    desc: 'Anugamya (@AP-boi)',
    action: 'profile',
    icon: '🐙',
  },
  {
    name: 'Hacker News',
    desc: 'Tech & Open Source News',
    url: 'https://news.ycombinator.com',
    icon: '⚡',
  },
  {
    name: 'Bharat Dekho',
    desc: '3D Cultural Heritage Portal',
    url: 'https://github.com/AP-boi/BHARAT-DEKHO',
    icon: '🏛️',
  },
  {
    name: 'PhysX Studio',
    desc: '3D Physics Sandbox',
    url: 'https://github.com/AP-boi/PHYSX',
    icon: '⚛️',
  },
  {
    name: 'MDN Web Docs',
    desc: 'Open Web Standards',
    url: 'https://developer.mozilla.org',
    icon: '🌐',
  },
  {
    name: 'Dev.to',
    desc: 'Developer Community',
    url: 'https://dev.to',
    icon: '👩‍💻',
  },
];

const SUGGESTED_SEARCHES = [
  'Three.js WebGL 3D graphics',
  'Next.js 14 App Router architecture',
  'Apple M3 Max silicon benchmarks',
  'DuckDuckGo open source privacy',
  'Physics simulation in JavaScript',
  'macOS liquid glass UI design',
];

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
  const [activeTab, setActiveTab] = useState<TabType>('search');
  const [urlInput, setUrlInput] = useState<string>(TAB_URL_MAP.search);
  const [navHistory, setNavHistory] = useState<TabType[]>(['search']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [repoSearch, setRepoSearch] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [hoveredCell, setHoveredCell] = useState<{ date: string; count: number } | null>(null);
  const [reposList, setReposList] = useState<RepoItem[]>(REPOSITORIES);

  // Search Engine State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<
    Array<{ title: string; snippet: string; url: string; wordcount?: number; timestamp?: string }>
  >([]);
  const [ddgAnswer, setDdgAnswer] = useState<DuckDuckGoInstantAnswer | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [searchStats, setSearchStats] = useState<{ count: number; timeMs: number } | null>(null);
  const [readerArticle, setReaderArticle] = useState<{
    title: string;
    description?: string;
    extract?: string;
    thumbnail?: string;
    url: string;
  } | null>(null);
  const [webViewerUrl, setWebViewerUrl] = useState<string>('https://en.wikipedia.org');

  const { safariSearchQuery, setSafariSearchQuery } = useOSStore();

  const [userProfile, setUserProfile] = useState<{
    public_repos: number;
    followers: number;
    following: number;
    avatar_url: string;
  }>({
    public_repos: 13,
    followers: 0,
    following: 1,
    avatar_url: 'https://avatars.githubusercontent.com/u/189377676?v=4',
  });

  // Fetch real-time GitHub data directly from API
  useEffect(() => {
    const fetchLiveGitHubData = async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch('https://api.github.com/users/AP-boi'),
          fetch('https://api.github.com/users/AP-boi/repos?per_page=100&sort=updated'),
        ]);

        if (userRes.ok) {
          const u = await userRes.json();
          setUserProfile({
            public_repos: u.public_repos || 13,
            followers: u.followers || 0,
            following: u.following || 1,
            avatar_url: u.avatar_url || 'https://avatars.githubusercontent.com/u/189377676?v=4',
          });
        }

        if (reposRes.ok) {
          const data = await reposRes.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped: RepoItem[] = data.map((r: any) => {
              const lang = r.language || 'TypeScript';
              const langColor =
                lang === 'TypeScript'
                  ? 'bg-blue-500'
                  : lang === 'JavaScript'
                  ? 'bg-amber-400'
                  : lang === 'Java'
                  ? 'bg-red-500'
                  : lang === 'HTML'
                  ? 'bg-orange-500'
                  : 'bg-purple-500';
              return {
                name: r.name,
                description: r.description || `${r.name} repository by AP-boi`,
                stars: r.stargazers_count || 0,
                forks: r.forks_count || 0,
                language: lang,
                langColor,
                updated: `Updated ${new Date(r.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
                topics: Array.isArray(r.topics) ? r.topics : [],
                url: r.html_url,
              };
            });
            setReposList(mapped);
          }
        }
      } catch (e) {
        // Fallback to preloaded real repositories
      }
    };

    fetchLiveGitHubData();
  }, []);

  // Listen for global Safari search queries dispatched from Spotlight
  useEffect(() => {
    if (safariSearchQuery && safariSearchQuery.trim()) {
      const q = safariSearchQuery.trim();
      setSearchQuery(q);
      setActiveTab('search');
      executeSearch(q);
      setSafariSearchQuery('');
    }
  }, [safariSearchQuery, setSafariSearchQuery]);

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

  // Real-life Free & Open-Source DuckDuckGo + Wikipedia Search Execution
  const executeSearch = async (query: string) => {
    if (!query.trim()) return;
    setIsSearching(true);
    setHasSearched(true);
    setReaderArticle(null);
    setDdgAnswer(null);
    const startTime = performance.now();
    setUrlInput(`https://duckduckgo.com/?q=${encodeURIComponent(query)}`);

    try {
      // 1. DuckDuckGo Instant Answers API
      const ddgPromise = (async () => {
        try {
          const ddgRes = await fetch(
            `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1&skip_disambig=1`
          );
          if (ddgRes.ok) {
            const ddgData = await ddgRes.json();
            const related: Array<{ text: string; firstUrl: string }> = [];
            if (Array.isArray(ddgData.RelatedTopics)) {
              for (const item of ddgData.RelatedTopics.slice(0, 8)) {
                if (item.Text && item.FirstURL) {
                  related.push({ text: item.Text, firstUrl: item.FirstURL });
                } else if (Array.isArray(item.Topics)) {
                  for (const sub of item.Topics.slice(0, 3)) {
                    if (sub.Text && sub.FirstURL) {
                      related.push({ text: sub.Text, firstUrl: sub.FirstURL });
                    }
                  }
                }
              }
            }

            const abstractText =
              ddgData.AbstractText || (ddgData.Abstract ? ddgData.Abstract.replace(/<[^>]*>?/gm, '') : '');

            if (abstractText || ddgData.Heading || related.length > 0) {
              setDdgAnswer({
                heading: ddgData.Heading || query,
                abstract: abstractText,
                abstractSource: ddgData.AbstractSource || 'DuckDuckGo Knowledge',
                abstractUrl: ddgData.AbstractURL || `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
                image: ddgData.Image || undefined,
                relatedTopics: related,
              });
            }
          }
        } catch (ddgErr) {
          console.warn('DuckDuckGo API fetch error:', ddgErr);
        }
      })();

      // 2. Wikipedia Open Search API
      const wikiPromise = (async () => {
        try {
          const wikiRes = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
              query
            )}&utf8=&format=json&origin=*`
          );
          const wikiData = await wikiRes.json();
          if (wikiData?.query?.search) {
            const results = wikiData.query.search.map((item: any) => ({
              title: item.title,
              snippet: item.snippet.replace(/<[^>]*>?/gm, ''),
              url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`,
              wordcount: item.wordcount,
              timestamp: item.timestamp,
            }));
            setSearchResults(results);
            setSearchStats({ count: results.length, timeMs: Math.round(performance.now() - startTime) });
          } else {
            setSearchResults([]);
            setSearchStats({ count: 0, timeMs: Math.round(performance.now() - startTime) });
          }
        } catch (wErr) {
          console.warn('Wiki API fetch error:', wErr);
        }
      })();

      await Promise.allSettled([ddgPromise, wikiPromise]);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const openReaderArticle = async (title: string, url: string) => {
    try {
      setIsSearching(true);
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`
      );
      if (res.ok) {
        const data = await res.json();
        setReaderArticle({
          title: data.title || title,
          description: data.description,
          extract: data.extract,
          thumbnail: data.thumbnail?.source,
          url,
        });
      } else {
        setReaderArticle({
          title,
          extract: 'Preview extracted. Click "Open External Page" to read the complete article on Wikipedia.',
          url,
        });
      }
    } catch (err) {
      setReaderArticle({
        title,
        extract: 'Article summary preview. Click "Open External Page" to view.',
        url,
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      setWebViewerUrl(trimmed);
      switchTab('webview');
    } else if (trimmed.toLowerCase().includes('github.com') || trimmed.toLowerCase() === 'github') {
      if (trimmed.toLowerCase().includes('repos')) {
        switchTab('repos');
      } else if (trimmed.toLowerCase().includes('streak') || trimmed.toLowerCase().includes('activity')) {
        switchTab('streak');
      } else {
        switchTab('profile');
      }
    } else {
      // Treat as open-source search query!
      setSearchQuery(trimmed);
      switchTab('search');
      executeSearch(trimmed);
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

  const filteredRepos = reposList.filter((repo) => {
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
        return 'bg-emerald-200 border-emerald-300 dark:bg-emerald-800 dark:border-emerald-700';
      case 2:
        return 'bg-emerald-400 border-emerald-500 dark:bg-emerald-600 dark:border-emerald-500';
      case 3:
        return 'bg-emerald-600 border-emerald-700 dark:bg-emerald-500 dark:border-emerald-400';
      case 4:
        return 'bg-emerald-800 border-emerald-900 dark:bg-emerald-400 dark:border-emerald-300';
      default:
        return 'bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700';
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3 text-slate-900 dark:text-slate-100 p-3 bg-white/95 dark:bg-slate-950 transition-colors select-none font-sans">
      {/* Authentic macOS Safari Window Toolbar */}
      <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
        {/* Navigation Buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={handleBack}
            disabled={historyIndex === 0}
            className={`p-1 rounded transition-colors ${
              historyIndex > 0
                ? 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer'
                : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
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
                ? 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer'
                : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
            }`}
            title="Forward"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (activeTab === 'search' && searchQuery) {
                executeSearch(searchQuery);
              } else {
                switchTab(activeTab, false);
              }
            }}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Reload"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Safari URL & Search Address Bar */}
        <form
          onSubmit={handleUrlSubmit}
          className="flex-1 flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1 text-xs text-slate-800 dark:text-slate-200 focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-slate-950 transition-colors shadow-inner"
        >
          {activeTab === 'search' ? (
            <Compass className="w-3 h-3 text-blue-500 flex-shrink-0" />
          ) : (
            <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          )}
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="bg-transparent border-none outline-none w-full font-mono text-[11px] text-slate-900 dark:text-slate-100"
            placeholder="Search DuckDuckGo & Wikipedia or enter URL..."
          />
          {urlInput && (
            <button
              type="button"
              onClick={() => setUrlInput('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </form>

        {/* Safari Action Controls */}
        <div className="flex items-center space-x-1">
          <button
            onClick={handleShare}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors relative cursor-pointer"
            title="Share URL"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
          <a
            href={urlInput.startsWith('http') ? urlInput : `https://duckduckgo.com/?q=${encodeURIComponent(urlInput)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors cursor-pointer"
            title="Open in new browser tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Safari Tab Bar */}
      <div className="flex items-center space-x-1 text-xs border-b border-slate-200 dark:border-slate-800 pb-1 flex-shrink-0">
        <button
          onClick={() => switchTab('search')}
          className={`px-3 py-1 rounded-t-lg font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'search'
              ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 border-t border-x border-slate-300 dark:border-slate-700 shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span className="text-xs select-none">🦆</span>
          <span>DuckDuckGo</span>
        </button>

        <button
          onClick={() => switchTab('profile')}
          className={`px-3 py-1 rounded-t-lg font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-t border-x border-slate-300 dark:border-slate-700 shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <img src="/icons/github.png" alt="" className="w-3.5 h-3.5 rounded object-cover shadow-xs" />
          <span>GitHub Profile</span>
        </button>

        <button
          onClick={() => switchTab('repos')}
          className={`px-3 py-1 rounded-t-lg font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'repos'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-t border-x border-slate-300 dark:border-slate-700 shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Repositories ({reposList.length})</span>
        </button>

        <button
          onClick={() => switchTab('streak')}
          className={`px-3 py-1 rounded-t-lg font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'streak'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-t border-x border-slate-300 dark:border-slate-700 shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-600" />
          <span>Commit Activity</span>
        </button>

        {activeTab === 'webview' && (
          <button
            onClick={() => switchTab('webview')}
            className="px-3 py-1 rounded-t-lg font-medium bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 border-t border-x border-slate-300 dark:border-slate-700 shadow-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Web Reader</span>
          </button>
        )}
      </div>

      {/* Web Page Viewport Content */}
      <div className="flex-1 overflow-auto space-y-4 pt-1 pr-1">
        {/* ================= TAB 0: DUCKDUCKGO SEARCH ENGINE ================= */}
        {activeTab === 'search' && (
          <div className="space-y-4 max-w-3xl mx-auto py-2">
            {/* DuckDuckGo Official Search Banner */}
            <div className="text-center space-y-2.5 pb-1">
              <div className="flex items-center justify-center space-x-2.5">
                <span className="text-3xl filter drop-shadow-xs select-none">🦆</span>
                <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  DuckDuck<span className="text-[#DE5833]">Go</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Privacy, simplified. The search engine that doesn&apos;t track you.
              </p>

              {/* Privacy Guarantee Badges */}
              <div className="flex items-center justify-center flex-wrap gap-1.5 pt-0.5">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Private Search
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 font-semibold flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Instant Answers
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> !Bangs Enabled
                </span>
              </div>

              {/* Instant Search Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  executeSearch(searchQuery);
                }}
                className="flex items-center space-x-2 max-w-xl mx-auto mt-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-orange-300 dark:border-orange-600/50 focus-within:border-[#DE5833] dark:focus-within:border-[#DE5833] rounded-2xl px-4 py-2.5 shadow-sm transition-colors"
              >
                <span className="text-base select-none">🦆</span>
                <input
                  type="text"
                  placeholder="Search DuckDuckGo or enter URL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                />
                {isSearching ? (
                  <Loader2 className="w-4 h-4 text-[#DE5833] animate-spin" />
                ) : (
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-xl bg-[#DE5833] hover:bg-[#c44926] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                  >
                    Search
                  </button>
                )}
              </form>

              {/* DuckDuckGo Quick !Bangs bar */}
              <div className="flex items-center justify-center flex-wrap gap-1.5 pt-1 max-w-xl mx-auto">
                <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 mr-1">
                  !Bangs:
                </span>
                {[
                  { bang: '!w', label: 'Wikipedia' },
                  { bang: '!gh', label: 'GitHub' },
                  { bang: '!yt', label: 'YouTube' },
                  { bang: '!r', label: 'Reddit' },
                  { bang: '!npm', label: 'NPM' },
                  { bang: '!so', label: 'StackOverflow' },
                ].map((b, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const nextQ = searchQuery.startsWith(b.bang) ? searchQuery : `${b.bang} ${searchQuery}`.trim();
                      setSearchQuery(nextQ);
                    }}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 border border-slate-200 dark:border-slate-700 transition-colors"
                    title={`DuckDuckGo Bang for ${b.label}`}
                  >
                    {b.bang} <span className="font-sans text-[9px] opacity-75">({b.label})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* DuckDuckGo Instant Answer Card (if available) */}
            {ddgAnswer && (
              <div className="bg-gradient-to-br from-orange-50/90 to-amber-50/70 dark:from-slate-900 dark:to-orange-950/30 p-4 rounded-2xl border-2 border-orange-300 dark:border-orange-600/50 shadow-md space-y-3">
                <div className="flex items-center justify-between border-b border-orange-200 dark:border-orange-800/60 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-base select-none">🦆</span>
                    <span className="text-xs font-bold text-orange-900 dark:text-orange-300 font-mono uppercase tracking-wider">
                      DuckDuckGo Instant Answer
                    </span>
                  </div>
                  {ddgAnswer.abstractSource && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/60 text-orange-800 dark:text-orange-200 font-semibold border border-orange-200 dark:border-orange-700">
                      Source: {ddgAnswer.abstractSource}
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  {ddgAnswer.image && (
                    <img
                      src={ddgAnswer.image}
                      alt={ddgAnswer.heading}
                      className="w-16 h-16 object-contain rounded-xl bg-white p-1 border border-orange-200 dark:border-orange-800 shadow-xs flex-shrink-0"
                    />
                  )}
                  <div className="space-y-1 flex-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{ddgAnswer.heading}</h3>
                    {ddgAnswer.abstract && (
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                        {ddgAnswer.abstract}
                      </p>
                    )}
                    {ddgAnswer.abstractUrl && (
                      <div className="pt-1">
                        <a
                          href={ddgAnswer.abstractUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline"
                        >
                          <span>Full source on {ddgAnswer.abstractSource || 'DuckDuckGo'}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* DuckDuckGo Related Quick Topics */}
                {ddgAnswer.relatedTopics && ddgAnswer.relatedTopics.length > 0 && (
                  <div className="pt-2 border-t border-orange-200/70 dark:border-orange-800/40">
                    <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1.5 font-mono">
                      DuckDuckGo Related Topics
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {ddgAnswer.relatedTopics.map((topic, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            const cleanTopic = topic.text.split(' - ')[0] || topic.text.slice(0, 32);
                            setSearchQuery(cleanTopic);
                            executeSearch(cleanTopic);
                          }}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-800/80 text-slate-800 dark:text-slate-200 hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50/50 dark:hover:bg-slate-700/50 transition-colors shadow-2xs truncate max-w-xs text-left cursor-pointer"
                          title={topic.text}
                        >
                          {topic.text.slice(0, 48)}...
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reader Article Preview Modal/Card (if selected) */}
            {readerArticle && (
              <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border-2 border-blue-500/50 shadow-lg space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase">
                      Safari Reader Mode
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={readerArticle.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <span>Open External Page</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => setReaderArticle(null)}
                      className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {readerArticle.thumbnail && (
                    <img
                      src={readerArticle.thumbnail}
                      alt={readerArticle.title}
                      className="w-28 h-28 object-cover rounded-xl border border-slate-300 dark:border-slate-700 shadow-sm flex-shrink-0"
                    />
                  )}
                  <div className="space-y-1.5 flex-1">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{readerArticle.title}</h2>
                    {readerArticle.description && (
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 italic">
                        {readerArticle.description}
                      </p>
                    )}
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans pt-1">
                      {readerArticle.extract}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Live Search Results */}
            {hasSearched ? (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-1.5">
                  <span>
                    About {searchResults.length + (ddgAnswer ? 1 : 0)} open results ({searchStats?.timeMs || 0} ms)
                  </span>
                  <span className="font-mono text-[10px] text-[#DE5833] font-semibold flex items-center gap-1">
                    🦆 DuckDuckGo + Open Search Engine
                  </span>
                </div>

                {/* DuckDuckGo Web Live Search Callout */}
                <div className="flex items-center justify-between gap-3 p-3 bg-orange-50/80 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/80 rounded-xl text-xs">
                  <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                    <span className="text-base select-none">🦆</span>
                    <span>Want live results across the entire web without tracking?</span>
                  </div>
                  <a
                    href={`https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#DE5833] hover:bg-[#c44926] text-white rounded-lg font-semibold transition-colors shadow-xs flex-shrink-0 cursor-pointer"
                  >
                    <span>Search on DuckDuckGo.com</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {searchResults.length === 0 && !isSearching && (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      No matching articles found for "{searchQuery}"
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Try another keyword or search on DuckDuckGo directly.</p>
                    <a
                      href={`https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
                    >
                      <span>Search on DuckDuckGo Web</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                <div className="space-y-2.5">
                  {searchResults.map((result, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/80 transition-all shadow-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono truncate max-w-md">
                          {result.url}
                        </span>
                        {result.wordcount && (
                          <span className="text-[10px] font-mono text-slate-400">
                            {result.wordcount.toLocaleString()} words
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => openReaderArticle(result.title, result.url)}
                        className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        {result.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                        {result.snippet}...
                      </p>

                      <div className="flex items-center space-x-3 pt-1 text-xs">
                        <button
                          onClick={() => openReaderArticle(result.title, result.url)}
                          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Preview in Safari Reader</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
                        >
                          <span>Open Full Page</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Safari Start Page: Bookmarks & Trending */
              <div className="space-y-5 pt-3">
                {/* Favorites Grid */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                    <Bookmark className="w-3.5 h-3.5 text-blue-500" />
                    <span>Favorites & Quick Bookmarks</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {QUICK_BOOKMARKS.map((b, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          if (b.action === 'profile') {
                            switchTab('profile');
                          } else if (b.url) {
                            if (b.isSearch) {
                              setSearchQuery('');
                              setUrlInput(b.url);
                            } else {
                              setWebViewerUrl(b.url);
                              switchTab('webview');
                            }
                          }
                        }}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-all shadow-xs flex items-center space-x-2.5"
                      >
                        <div className="text-xl flex-shrink-0">{b.icon}</div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{b.name}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{b.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested Search Prompts */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                    <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                    <span>Suggested Searches</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_SEARCHES.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchQuery(prompt);
                          executeSearch(prompt);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-800 text-xs font-medium transition-colors cursor-pointer"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 1: PROFILE OVERVIEW ================= */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            {/* GitHub Profile Banner Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-900/80 dark:to-blue-950/40 border border-purple-200 dark:border-purple-900 shadow-xs gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-1 rounded-2xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 shadow-xs flex items-center justify-center">
                  <img src="/icons/github.png" alt="GitHub" className="w-10 h-10 rounded-xl object-cover" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white font-mono">github.com/AP-boi</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-700 font-semibold">
                      VERIFIED DEVELOPER
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
                    Creative Developer & WebGL Systems Builder • Next.js, Three.js & Game Engines
                  </p>
                </div>
              </div>

              <a
                href="https://github.com/AP-boi"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-sm cursor-pointer"
              >
                <span>Follow on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-[10px] font-mono uppercase font-semibold">
                  <span>Public Repos</span>
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-1">
                  {userProfile.public_repos || reposList.length} Repositories
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-[10px] font-mono uppercase font-semibold">
                  <span>Primary Stacks</span>
                  <Code2 className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <div className="text-lg font-bold text-purple-700 dark:text-purple-400 font-mono mt-1">
                  TypeScript & Next.js
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-[10px] font-mono uppercase font-semibold">
                  <span>Active Deployments</span>
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <div className="text-lg font-bold text-rose-600 dark:text-rose-400 font-mono mt-1">4 Live Apps</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-[10px] font-mono uppercase font-semibold">
                  <span>Specialization</span>
                  <Code2 className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-lg font-bold text-amber-700 dark:text-amber-400 font-mono mt-1">3D WebGL & AI</div>
              </div>
            </div>

            {/* Pinned Repositories Showcase */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                  Pinned Repositories
                </h3>
                <button
                  onClick={() => switchTab('repos')}
                  className="text-[11px] text-purple-700 dark:text-purple-400 hover:underline font-mono font-semibold cursor-pointer"
                >
                  View all repositories ({reposList.length}) →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {reposList.slice(0, 3).map((repo) => (
                  <div
                    key={repo.name}
                    className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-purple-400 dark:hover:border-purple-500 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white font-mono hover:text-purple-600 cursor-pointer truncate">
                          {repo.name}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-700">
                          Public
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed font-medium">
                        {repo.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800 mt-3 font-mono">
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
        )}

        {/* ================= TAB 2: REPOSITORIES LIST ================= */}
        {activeTab === 'repos' && (
          <div className="space-y-3">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2 w-full sm:w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter repositories by name or topic..."
                  value={repoSearch}
                  onChange={(e) => setRepoSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs w-full text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
                      selectedLanguage === lang
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Repositories Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredRepos.map((repo) => (
                <div
                  key={repo.name}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 transition-all flex flex-col justify-between shadow-xs space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-xs text-blue-600 dark:text-blue-400 hover:underline font-mono flex items-center gap-1"
                      >
                        <span>{repo.name}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                        Public
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                      {repo.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {repo.topics.slice(0, 4).map((topic) => (
                        <span
                          key={topic}
                          className="px-1.5 py-0.5 rounded text-[9px] bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 font-mono"
                        >
                          #{topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2.5 border-t border-slate-200 dark:border-slate-800 font-mono">
                    <div className="flex items-center space-x-1.5">
                      <span className={`w-2 h-2 rounded-full ${repo.langColor}`} />
                      <span>{repo.language}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{repo.updated}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: COMMIT STREAK ================= */}
        {activeTab === 'streak' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                    52-Week Contribution Matrix
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Continuous commit cadence across all open-source repositories
                  </p>
                </div>
                <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-500">
                  <span>Less</span>
                  <div className="w-2.5 h-2.5 rounded-xs bg-slate-200 dark:bg-slate-800" />
                  <div className="w-2.5 h-2.5 rounded-xs bg-emerald-300" />
                  <div className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                  <div className="w-2.5 h-2.5 rounded-xs bg-emerald-700" />
                  <span>More</span>
                </div>
              </div>

              {/* Heatmap Grid */}
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-1 min-w-[720px]">
                  {heatmapWeeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-1">
                      {week.map((day, dIdx) => (
                        <div
                          key={dIdx}
                          onMouseEnter={() => setHoveredCell({ date: day.date, count: day.count })}
                          onMouseLeave={() => setHoveredCell(null)}
                          className={`w-2.5 h-2.5 rounded-xs border transition-transform hover:scale-125 cursor-pointer ${getHeatmapColor(
                            day.level
                          )}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Hover Indicator */}
              <div className="text-right text-[11px] font-mono text-slate-500 h-4">
                {hoveredCell ? (
                  <span>
                    <strong>{hoveredCell.count}</strong> contributions on {hoveredCell.date}
                  </span>
                ) : (
                  <span>Hover over any square to view date and commit metrics</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: WEB READER / LIVE URL VIEWER ================= */}
        {activeTab === 'webview' && (
          <div className="h-full flex flex-col space-y-2">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center space-x-2 truncate">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span className="font-mono font-bold truncate text-slate-900 dark:text-white">{webViewerUrl}</span>
              </div>
              <a
                href={webViewerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer flex-shrink-0"
              >
                <span>Open in Real Browser</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex-1 min-h-[460px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white relative">
              <iframe
                src={webViewerUrl}
                title="Safari Web View"
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubApp;
