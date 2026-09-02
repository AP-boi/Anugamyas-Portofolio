'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Lock,
  Share2,
  Search,
  Check,
  Plus,
  X,
  Globe,
  Loader2,
  ArrowUpRight,
  FileText,
  ShieldCheck,
  ExternalLink,
  PanelLeft,
  Home,
  AlignLeft,
  Star,
  GitFork,
  BookOpen,
  Flame,
  Tag,
  Zap,
} from 'lucide-react';
import { useOSStore } from '@/store/useOSStore';
import { sounds } from '@/lib/soundEngine';

// ================= TYPES =================
export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  favicon: string;
  history: string[];
  historyIndex: number;
  isLoading: boolean;
  pageType: 'startpage' | 'duckduckgo' | 'webview' | 'reader' | 'github';
  searchQuery?: string;
  readerData?: {
    title: string;
    description?: string;
    extract?: string;
    thumbnail?: string;
    url: string;
  };
}

interface DuckDuckGoInstantAnswer {
  heading?: string;
  abstract?: string;
  abstractSource?: string;
  abstractUrl?: string;
  image?: string;
  relatedTopics?: Array<{ text: string; firstUrl: string }>;
}

interface SearchResultItem {
  title: string;
  snippet: string;
  url: string;
  wordcount?: number;
  timestamp?: string;
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

// ================= PRESET DATA =================
const FAVORITES = [
  {
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com',
    icon: '🦆',
    desc: 'Privacy-focused search engine',
    type: 'duckduckgo' as const,
  },
  {
    name: 'GitHub',
    url: 'https://github.com/AP-boi',
    icon: '🐙',
    desc: 'Anugamya (@AP-boi) Developer Profile',
    type: 'github' as const,
  },
  {
    name: 'Wikipedia',
    url: 'https://en.wikipedia.org',
    icon: '📖',
    desc: 'The Free Encyclopedia',
    type: 'webview' as const,
  },
  {
    name: 'Hacker News',
    url: 'https://news.ycombinator.com',
    icon: '⚡',
    desc: 'Tech & open source community',
    type: 'webview' as const,
  },
  {
    name: 'Bharat Dekho',
    url: 'https://github.com/AP-boi/BHARAT-DEKHO',
    icon: '🏛️',
    desc: '3D Cultural Heritage Platform',
    type: 'github' as const,
  },
  {
    name: 'PhysX Studio',
    url: 'https://github.com/AP-boi/PHYSX',
    icon: '⚛️',
    desc: 'GPU Physics Engine in Three.js',
    type: 'github' as const,
  },
  {
    name: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    icon: '🌐',
    desc: 'Open web standards & guides',
    type: 'webview' as const,
  },
  {
    name: 'Dev.to',
    url: 'https://dev.to',
    icon: '👩‍💻',
    desc: 'Software developers community',
    type: 'webview' as const,
  },
];

const DUCKDUCKGO_BANGS = [
  { bang: '!w', label: 'Wikipedia', desc: 'Encyclopedia' },
  { bang: '!gh', label: 'GitHub', desc: 'Repositories' },
  { bang: '!yt', label: 'YouTube', desc: 'Videos' },
  { bang: '!r', label: 'Reddit', desc: 'Discussions' },
  { bang: '!npm', label: 'NPM', desc: 'Packages' },
  { bang: '!so', label: 'StackOverflow', desc: 'Code Q&A' },
];

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
    description: 'High-performance retro arcade space shooter with particle systems, procedural waves, and sound synthesis.',
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
    description: '60 FPS Canvas-based cyberpunk combat engine with dynamic neon lighting and skill progression trees.',
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
    updated: 'Updated 2 months ago',
    topics: ['operating-system', 'typescript', 'react', 'desktop-ui'],
    url: 'https://github.com/AP-boi/flowOS',
  },
];

export const GitHubApp: React.FC = () => {
  // Global Store for Spotlight integration
  const { safariSearchQuery, setSafariSearchQuery } = useOSStore();

  // Multi-Tab System
  const [tabs, setTabs] = useState<BrowserTab[]>([
    {
      id: 'tab-1',
      title: 'DuckDuckGo — Privacy, simplified.',
      url: 'https://duckduckgo.com',
      favicon: '🦆',
      history: ['https://duckduckgo.com'],
      historyIndex: 0,
      isLoading: false,
      pageType: 'duckduckgo',
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');

  // Toolbar & Omnibox state
  const [addressInput, setAddressInput] = useState<string>('https://duckduckgo.com');
  const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showBookmarksBar, setShowBookmarksBar] = useState<boolean>(true);

  // Search Results Cache
  const [ddgAnswer, setDdgAnswer] = useState<DuckDuckGoInstantAnswer | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [searchStats, setSearchStats] = useState<{ count: number; timeMs: number } | null>(null);
  const [readerFontSize, setReaderFontSize] = useState<number>(16);

  // GitHub in-browser state
  const [reposList, setReposList] = useState<RepoItem[]>(REPOSITORIES);
  const [repoSearch, setRepoSearch] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [gitHubActiveSubTab, setGitHubActiveSubTab] = useState<'overview' | 'repositories' | 'activity'>('overview');
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

  const activeTab = useMemo(() => {
    return tabs.find((t) => t.id === activeTabId) || tabs[0];
  }, [tabs, activeTabId]);

  // Sync address input when active tab changes
  useEffect(() => {
    if (activeTab && !isEditingAddress) {
      setAddressInput(activeTab.url);
    }
  }, [activeTab, isEditingAddress]);

  // Fetch real-time GitHub data
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
              const lang = r.language || 'Code';
              let langColor = 'bg-slate-400';
              if (lang === 'TypeScript') langColor = 'bg-blue-500';
              else if (lang === 'JavaScript') langColor = 'bg-amber-400';
              else if (lang === 'Java') langColor = 'bg-red-500';
              else if (lang === 'HTML') langColor = 'bg-orange-500';
              else if (lang === 'CSS') langColor = 'bg-purple-500';

              return {
                name: r.name,
                description: r.description || `${r.name} repository by AP-boi`,
                stars: r.stargazers_count || 0,
                forks: r.forks_count || 0,
                language: lang,
                langColor,
                updated: `Updated ${new Date(r.updated_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}`,
                topics: Array.isArray(r.topics) ? r.topics : [],
                url: r.html_url,
              };
            });
            setReposList(mapped);
          }
        }
      } catch (e) {
        // Fallback to static list
      }
    };
    fetchLiveGitHubData();
  }, []);

  // Listen for global Safari search queries dispatched from Spotlight
  useEffect(() => {
    if (safariSearchQuery && safariSearchQuery.trim()) {
      const q = safariSearchQuery.trim();
      navigateToSearch(q);
      setSafariSearchQuery('');
    }
  }, [safariSearchQuery, setSafariSearchQuery]);

  // Tab operations
  const createNewTab = (url = 'safari:startpage', title = 'Start Page') => {
    sounds.playClick();
    const newId = `tab-${Date.now()}`;
    const newTab: BrowserTab = {
      id: newId,
      title,
      url,
      favicon: url === 'safari:startpage' ? '🧭' : '🦆',
      history: [url],
      historyIndex: 0,
      isLoading: false,
      pageType: url === 'safari:startpage' ? 'startpage' : 'duckduckgo',
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
    setAddressInput(url === 'safari:startpage' ? '' : url);
  };

  const closeTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    sounds.playClick();
    if (tabs.length === 1) {
      // Reset last tab to startpage
      setTabs([
        {
          id: 'tab-1',
          title: 'Start Page',
          url: 'safari:startpage',
          favicon: '🧭',
          history: ['safari:startpage'],
          historyIndex: 0,
          isLoading: false,
          pageType: 'startpage',
        },
      ]);
      setActiveTabId('tab-1');
      return;
    }

    const nextTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(nextTabs);
    if (activeTabId === tabId) {
      const closedIdx = tabs.findIndex((t) => t.id === tabId);
      const nextActive = nextTabs[Math.max(0, closedIdx - 1)];
      setActiveTabId(nextActive.id);
    }
  };

  // Navigation logic
  const navigateTo = async (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;

    sounds.playClick();

    // Check if input is a search query or a real URL
    const isUrl =
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(trimmed) ||
      trimmed.startsWith('localhost:');

    if (!isUrl && !trimmed.startsWith('safari:')) {
      navigateToSearch(trimmed);
      return;
    }

    let finalUrl = trimmed;
    if (isUrl && !trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      finalUrl = `https://${trimmed}`;
    }

    // Determine page type
    let pageType: BrowserTab['pageType'] = 'webview';
    let favicon = '🌐';
    let title = finalUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

    if (finalUrl === 'safari:startpage') {
      pageType = 'startpage';
      favicon = '🧭';
      title = 'Start Page';
    } else if (finalUrl.includes('duckduckgo.com')) {
      pageType = 'duckduckgo';
      favicon = '🦆';
      title = 'DuckDuckGo';
    } else if (finalUrl.includes('github.com/AP-boi') || finalUrl.includes('github.com')) {
      pageType = 'github';
      favicon = '🐙';
      title = 'Anugamya (@AP-boi) · GitHub';
    } else if (finalUrl.includes('wikipedia.org')) {
      favicon = '📖';
    }

    updateActiveTab({
      url: finalUrl,
      title,
      favicon,
      pageType,
      isLoading: true,
      history: [...activeTab.history.slice(0, activeTab.historyIndex + 1), finalUrl],
      historyIndex: activeTab.historyIndex + 1,
    });

    // Simulate page load completion
    setTimeout(() => {
      updateActiveTab({ isLoading: false });
    }, 450);
  };

  const navigateToSearch = async (query: string) => {
    if (!query.trim()) return;
    const finalUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;

    updateActiveTab({
      url: finalUrl,
      title: `${query} — DuckDuckGo`,
      favicon: '🦆',
      pageType: 'duckduckgo',
      searchQuery: query,
      isLoading: true,
      history: [...activeTab.history.slice(0, activeTab.historyIndex + 1), finalUrl],
      historyIndex: activeTab.historyIndex + 1,
    });

    setDdgAnswer(null);
    setSearchResults([]);
    const startTime = performance.now();

    try {
      // 1. Live DuckDuckGo Instant Answers API
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
        } catch (e) {
          // Ignored
        }
      })();

      // 2. Open Web Knowledge Results (Wikipedia Search API)
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
          }
        } catch (e) {
          // Ignored
        }
      })();

      await Promise.allSettled([ddgPromise, wikiPromise]);
    } finally {
      updateActiveTab({ isLoading: false });
    }
  };

  const openReaderMode = async (title: string, url: string) => {
    sounds.playClick();
    updateActiveTab({ isLoading: true });

    try {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`
      );
      if (res.ok) {
        const data = await res.json();
        updateActiveTab({
          pageType: 'reader',
          title: `Reader: ${data.title || title}`,
          favicon: '📄',
          isLoading: false,
          readerData: {
            title: data.title || title,
            description: data.description,
            extract: data.extract,
            thumbnail: data.thumbnail?.source,
            url,
          },
        });
      } else {
        updateActiveTab({
          pageType: 'reader',
          title: `Reader: ${title}`,
          favicon: '📄',
          isLoading: false,
          readerData: {
            title,
            extract: 'Unable to extract reader text. Click "Open External Page" to view the full web document.',
            url,
          },
        });
      }
    } catch (e) {
      updateActiveTab({
        pageType: 'reader',
        title: `Reader: ${title}`,
        favicon: '📄',
        isLoading: false,
        readerData: {
          title,
          extract: 'Article summary unavailable offline.',
          url,
        },
      });
    }
  };

  const updateActiveTab = (updates: Partial<BrowserTab>) => {
    setTabs((prev) => prev.map((t) => (t.id === activeTabId ? { ...t, ...updates } : t)));
  };

  const handleBack = () => {
    if (activeTab.historyIndex > 0) {
      sounds.playClick();
      const prevIdx = activeTab.historyIndex - 1;
      const prevUrl = activeTab.history[prevIdx];
      updateActiveTab({
        historyIndex: prevIdx,
        url: prevUrl,
        isLoading: true,
      });
      navigateTo(prevUrl);
    }
  };

  const handleForward = () => {
    if (activeTab.historyIndex < activeTab.history.length - 1) {
      sounds.playClick();
      const nextIdx = activeTab.historyIndex + 1;
      const nextUrl = activeTab.history[nextIdx];
      updateActiveTab({
        historyIndex: nextIdx,
        url: nextUrl,
        isLoading: true,
      });
      navigateTo(nextUrl);
    }
  };

  const handleReload = () => {
    sounds.playClick();
    updateActiveTab({ isLoading: true });
    setTimeout(() => {
      updateActiveTab({ isLoading: false });
    }, 400);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(activeTab.url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const formatDomainDisplay = (rawUrl: string) => {
    if (rawUrl === 'safari:startpage') return 'Start Page';
    try {
      const urlObj = new URL(rawUrl);
      return urlObj.hostname.replace(/^www\./, '');
    } catch (e) {
      return rawUrl;
    }
  };

  const filteredRepos = useMemo(() => {
    return reposList.filter((repo) => {
      const matchesLang = selectedLanguage === 'All' || repo.language === selectedLanguage;
      const matchesSearch =
        repo.name.toLowerCase().includes(repoSearch.toLowerCase()) ||
        repo.description.toLowerCase().includes(repoSearch.toLowerCase()) ||
        repo.topics.some((t) => t.toLowerCase().includes(repoSearch.toLowerCase()));
      return matchesLang && matchesSearch;
    });
  }, [reposList, selectedLanguage, repoSearch]);

  return (
    <div className="flex flex-col h-full bg-[#f6f6f6] dark:bg-[#1e1e1e] text-slate-800 dark:text-slate-100 font-sans select-none overflow-hidden transition-colors">
      {/* ================= 1. MAC OS SAFARI TAB BAR ================= */}
      <div className="flex items-center bg-[#e5e5e7] dark:bg-[#141414] px-2 pt-2 border-b border-black/10 dark:border-white/10 select-none overflow-x-auto no-scrollbar gap-1 flex-shrink-0">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setActiveTabId(tab.id);
              }}
              className={`group relative flex items-center min-w-[140px] max-w-[220px] flex-1 h-8 px-3 rounded-t-lg text-xs transition-all cursor-pointer border-t border-x ${
                isActive
                  ? 'bg-white dark:bg-[#252526] text-slate-900 dark:text-white border-black/10 dark:border-white/10 shadow-xs font-semibold'
                  : 'bg-transparent text-slate-600 dark:text-slate-400 border-transparent hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <span className="text-xs mr-2 flex-shrink-0 select-none">{tab.favicon}</span>
              <span className="truncate flex-1 font-medium text-[11px]">{tab.title}</span>

              {/* Close Tab button */}
              <button
                type="button"
                onClick={(e) => closeTab(e, tab.id)}
                className={`ml-1.5 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/15 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors opacity-0 group-hover:opacity-100 ${
                  isActive ? 'opacity-100' : ''
                }`}
                title="Close Tab (⌘W)"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}

        {/* New Tab Button */}
        <button
          type="button"
          onClick={() => createNewTab()}
          className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer mb-0.5 ml-1"
          title="New Tab (⌘T)"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ================= 2. UNIFIED SAFARI TOOLBAR ================= */}
      <div className="flex items-center space-x-2 px-3 py-1.5 bg-white dark:bg-[#252526] border-b border-black/10 dark:border-white/10 flex-shrink-0">
        {/* Navigation Buttons */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={handleBack}
            disabled={activeTab.historyIndex === 0}
            className={`p-1.5 rounded-md transition-colors ${
              activeTab.historyIndex > 0
                ? 'hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 cursor-pointer'
                : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
            }`}
            title="Back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleForward}
            disabled={activeTab.historyIndex >= activeTab.history.length - 1}
            className={`p-1.5 rounded-md transition-colors ${
              activeTab.historyIndex < activeTab.history.length - 1
                ? 'hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 cursor-pointer'
                : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
            }`}
            title="Forward"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleReload}
            className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            title="Reload Page (⌘R)"
          >
            {activeTab.isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
            ) : (
              <RotateCw className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => navigateTo('safari:startpage')}
            className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            title="Start Page"
          >
            <Home className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Smart Search Field (Omnibox) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsEditingAddress(false);
            navigateTo(addressInput);
          }}
          className="flex-1 max-w-xl mx-auto flex items-center space-x-2 bg-[#f0f0f2] dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-xl px-3 py-1 text-xs focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-[#121212] transition-all"
        >
          {activeTab.pageType === 'startpage' ? (
            <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          ) : (
            <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          )}

          <input
            type="text"
            value={addressInput}
            onFocus={() => {
              setIsEditingAddress(true);
              if (activeTab.pageType === 'startpage') setAddressInput('');
            }}
            onBlur={() => {
              setIsEditingAddress(false);
              if (!addressInput) setAddressInput(activeTab.url);
            }}
            onChange={(e) => setAddressInput(e.target.value)}
            placeholder="Search DuckDuckGo or enter website URL"
            className="flex-1 bg-transparent border-none outline-none font-sans text-xs text-slate-900 dark:text-white placeholder:text-slate-400 text-center focus:text-left selection:bg-blue-500/30"
          />

          {/* Inline Reader Mode Button if available */}
          {activeTab.pageType === 'reader' && (
            <button
              type="button"
              onClick={() => {
                if (activeTab.readerData?.url) navigateTo(activeTab.readerData.url);
              }}
              className="p-1 rounded text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer"
              title="Exit Reader Mode"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
          )}

          {addressInput && (
            <button
              type="button"
              onClick={() => setAddressInput('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </form>

        {/* Right Toolbar Actions */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={handleShare}
            className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            title="Copy / Share Link"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
          <a
            href={activeTab.url.startsWith('http') ? activeTab.url : `https://duckduckgo.com/?q=${encodeURIComponent(activeTab.url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            title="Open in External Browser Tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* ================= 3. FAVORITES BAR ================= */}
      {showBookmarksBar && (
        <div className="flex items-center space-x-3 px-3 py-1 bg-[#fbfbfb] dark:bg-[#202020] border-b border-black/5 dark:border-white/5 text-[11px] overflow-x-auto no-scrollbar flex-shrink-0">
          {FAVORITES.map((f, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => navigateTo(f.url)}
              className="flex items-center space-x-1.5 px-2 py-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer flex-shrink-0 font-medium"
            >
              <span className="text-xs">{f.icon}</span>
              <span>{f.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* ================= 4. BROWSER VIEWPORT ================= */}
      <div className="flex-1 overflow-auto bg-white dark:bg-[#181818] relative">
        {/* Loading Bar */}
        {activeTab.isLoading && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 animate-pulse z-50" />
        )}

        {/* ---------------- A. SAFARI START PAGE ---------------- */}
        {activeTab.pageType === 'startpage' && (
          <div className="min-h-full p-8 max-w-4xl mx-auto space-y-8 animate-fadeIn">
            {/* Safari Greeting */}
            <div className="text-center space-y-2 pt-4">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Favorites
              </h1>
            </div>

            {/* Apple Style Favorites Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {FAVORITES.map((f, idx) => (
                <div
                  key={idx}
                  onClick={() => navigateTo(f.url)}
                  className="group flex flex-col items-center p-4 rounded-2xl bg-[#f5f5f7] dark:bg-[#262626] hover:bg-[#ebebee] dark:hover:bg-[#303030] transition-all cursor-pointer border border-black/5 dark:border-white/5 hover:scale-[1.03] shadow-xs"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#1a1a1a] flex items-center justify-center text-3xl shadow-sm border border-black/5 dark:border-white/10 mb-2.5">
                    {f.icon}
                  </div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white text-center truncate w-full">
                    {f.name}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 text-center truncate w-full mt-0.5">
                    {f.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* Privacy Report Widget */}
            <div className="p-5 rounded-2xl bg-[#f5f5f7] dark:bg-[#262626] border border-black/5 dark:border-white/5 space-y-2">
              <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-semibold text-xs">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span>Privacy Report</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                In the last 30 days, Safari protected your browsing session and prevented 84 trackers from profiling you via DuckDuckGo private browsing.
              </p>
            </div>
          </div>
        )}

        {/* ---------------- B. DUCKDUCKGO SEARCH PAGE ---------------- */}
        {activeTab.pageType === 'duckduckgo' && (
          <div className="min-h-full bg-white dark:bg-[#181818] p-6 max-w-4xl mx-auto space-y-6">
            {/* DuckDuckGo SERP Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-black/10 dark:border-white/10 pb-4">
              <div className="flex items-center space-x-2.5">
                <span className="text-2xl select-none">🦆</span>
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  DuckDuck<span className="text-[#DE5833]">Go</span>
                </span>
              </div>

              {/* Clean SERP Tabs */}
              <div className="flex items-center space-x-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                <span className="text-[#DE5833] font-bold border-b-2 border-[#DE5833] pb-1 cursor-pointer">
                  All
                </span>
                <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer">Images</span>
                <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer">Videos</span>
                <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer">News</span>
                <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer">Maps</span>
              </div>
            </div>

            {/* DuckDuckGo Instant Answer / Knowledge Panel */}
            {ddgAnswer && (
              <div className="p-4 rounded-xl bg-[#fafafa] dark:bg-[#202020] border border-black/10 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#DE5833] font-mono">
                    Instant Answer
                  </span>
                  {ddgAnswer.abstractSource && (
                    <span className="text-[10px] text-slate-500 font-medium">
                      From {ddgAnswer.abstractSource}
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {ddgAnswer.image && (
                    <img
                      src={ddgAnswer.image}
                      alt={ddgAnswer.heading}
                      className="w-16 h-16 object-contain rounded-lg bg-white p-1 border border-black/10 dark:border-white/10 flex-shrink-0"
                    />
                  )}
                  <div className="space-y-1 flex-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {ddgAnswer.heading}
                    </h3>
                    {ddgAnswer.abstract && (
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                        {ddgAnswer.abstract}
                      </p>
                    )}
                    {ddgAnswer.abstractUrl && (
                      <a
                        href={ddgAnswer.abstractUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-xs text-[#DE5833] hover:underline font-medium pt-1"
                      >
                        <span>More on {ddgAnswer.abstractSource || 'DuckDuckGo'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* DuckDuckGo Related Quick Topics */}
                {ddgAnswer.relatedTopics && ddgAnswer.relatedTopics.length > 0 && (
                  <div className="pt-2 border-t border-black/5 dark:border-white/5 flex flex-wrap gap-1.5">
                    {ddgAnswer.relatedTopics.map((t, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => navigateToSearch(t.text.split(' - ')[0])}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-white dark:bg-[#2b2b2b] border border-black/10 dark:border-white/10 hover:border-[#DE5833] text-slate-800 dark:text-slate-200 transition-colors"
                      >
                        {t.text.slice(0, 42)}...
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Organic Web Search Results */}
            <div className="space-y-5">
              {searchResults.length === 0 && !activeTab.isLoading && (
                <div className="text-center py-12 space-y-3">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Search DuckDuckGo or enter a search query above.
                  </p>
                  <div className="flex justify-center gap-2">
                    {DUCKDUCKGO_BANGS.map((b, idx) => (
                      <button
                        key={idx}
                        onClick={() => navigateToSearch(`${b.bang} `)}
                        className="text-xs px-2.5 py-1 rounded bg-black/5 dark:bg-white/10 font-mono"
                      >
                        {b.bang} <span className="font-sans text-[10px] text-slate-500">({b.label})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.map((item, idx) => (
                <div key={idx} className="space-y-1 group">
                  {/* Green URL Breadcrumb */}
                  <div className="flex items-center space-x-1.5 text-[11px] text-[#006621] dark:text-[#34a853] font-mono truncate">
                    <Globe className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{item.url}</span>
                  </div>

                  {/* Clean Blue Link */}
                  <h4
                    onClick={() => openReaderMode(item.title, item.url)}
                    className="text-base font-medium text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer"
                  >
                    {item.title}
                  </h4>

                  {/* Snippet text */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                    {item.snippet}
                  </p>

                  {/* Clean Action Links */}
                  <div className="flex items-center space-x-3 pt-1 text-[11px] text-slate-500">
                    <button
                      type="button"
                      onClick={() => openReaderMode(item.title, item.url)}
                      className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Safari Reader</span>
                    </button>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
                    >
                      <span>Open Website</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- C. SAFARI READER MODE VIEW ---------------- */}
        {activeTab.pageType === 'reader' && activeTab.readerData && (
          <div className="min-h-full bg-[#fbfbfa] dark:bg-[#1a1a1a] p-8 max-w-2xl mx-auto space-y-6 animate-fadeIn">
            {/* Reader Header */}
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3 text-xs">
              <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
                Safari Reader
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setReaderFontSize((prev) => Math.max(12, prev - 2))}
                  className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 font-bold"
                  title="Smaller text"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => setReaderFontSize((prev) => Math.min(24, prev + 2))}
                  className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 font-bold"
                  title="Larger text"
                >
                  A+
                </button>
                <a
                  href={activeTab.readerData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 ml-2 font-medium"
                >
                  <span>Original Article</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Article Content */}
            <article className="space-y-4">
              <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white leading-tight">
                {activeTab.readerData.title}
              </h1>

              {activeTab.readerData.description && (
                <p className="text-sm italic text-slate-500 dark:text-slate-400 font-serif">
                  {activeTab.readerData.description}
                </p>
              )}

              {activeTab.readerData.thumbnail && (
                <img
                  src={activeTab.readerData.thumbnail}
                  alt={activeTab.readerData.title}
                  className="w-full max-h-80 object-cover rounded-xl shadow-xs"
                />
              )}

              <div
                style={{ fontSize: `${readerFontSize}px` }}
                className="leading-relaxed font-serif text-slate-800 dark:text-slate-200 pt-2 space-y-4"
              >
                <p>{activeTab.readerData.extract}</p>
              </div>
            </article>
          </div>
        )}

        {/* ---------------- D. GITHUB IN-BROWSER PAGE ---------------- */}
        {activeTab.pageType === 'github' && (
          <div className="min-h-full bg-white dark:bg-[#0d1117] text-slate-900 dark:text-[#c9d1d9] p-6 max-w-5xl mx-auto space-y-6">
            {/* GitHub In-Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-3.5">
                <img
                  src={userProfile.avatar_url}
                  alt="Anugamya"
                  className="w-14 h-14 rounded-full border-2 border-slate-300 dark:border-slate-700 shadow-sm"
                />
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Anugamya</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">@AP-boi</p>
                </div>
              </div>

              {/* GitHub In-Page Nav Tabs */}
              <div className="flex items-center space-x-1 text-xs border border-slate-200 dark:border-slate-800 rounded-lg p-1 bg-slate-50 dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => setGitHubActiveSubTab('overview')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors ${
                    gitHubActiveSubTab === 'overview'
                      ? 'bg-white dark:bg-[#161b22] text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Overview
                </button>
                <button
                  type="button"
                  onClick={() => setGitHubActiveSubTab('repositories')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors ${
                    gitHubActiveSubTab === 'repositories'
                      ? 'bg-white dark:bg-[#161b22] text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Repositories ({reposList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setGitHubActiveSubTab('activity')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors ${
                    gitHubActiveSubTab === 'activity'
                      ? 'bg-white dark:bg-[#161b22] text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Commit Heatmap
                </button>
              </div>
            </div>

            {/* Sub-Tab 1: Overview */}
            {gitHubActiveSubTab === 'overview' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 space-y-2">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Bio &amp; Research Focus
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                    Software engineer and creative technologist specializing in fullstack web architecture, 3D WebGL computer graphics, GPU physics simulations, and desktop operating system simulators.
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Pinned Repositories
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {REPOSITORIES.slice(0, 4).map((repo, idx) => (
                      <a
                        key={idx}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-xl bg-slate-50 dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all space-y-2 block group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                            {repo.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500">
                            Public
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                          {repo.description}
                        </p>
                        <div className="flex items-center space-x-3 text-[10px] text-slate-500 pt-1">
                          <span className="flex items-center gap-1">
                            <span className={`w-2 h-2 rounded-full ${repo.langColor}`} />
                            {repo.language}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Star className="w-3 h-3" /> {repo.stars}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 2: Repositories list with Search */}
            {gitHubActiveSubTab === 'repositories' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 text-xs">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Find a repository..."
                      value={repoSearch}
                      onChange={(e) => setRepoSearch(e.target.value)}
                      className="bg-transparent border-none outline-none w-full text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="divide-y divide-slate-200 dark:divide-slate-800 border-t border-slate-200 dark:border-slate-800">
                  {filteredRepos.map((repo, idx) => (
                    <div key={idx} className="py-3.5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {repo.name}
                        </a>
                        <span className="text-[10px] px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 font-mono">
                          Public
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{repo.description}</p>
                      <div className="flex items-center space-x-3 text-[10px] text-slate-500 pt-1 font-mono">
                        <span className="flex items-center gap-1 font-sans">
                          <span className={`w-2 h-2 rounded-full ${repo.langColor}`} />
                          {repo.language}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Star className="w-3 h-3" /> {repo.stars}
                        </span>
                        <span>{repo.updated}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Tab 3: Commit Heatmap */}
            {gitHubActiveSubTab === 'activity' && (
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    52-Week Contribution Matrix
                  </span>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    Continuous Commits
                  </span>
                </div>
                <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto py-2">
                  {Array.from({ length: 364 }).map((_, i) => {
                    const level = (i * 7 + 3) % 5;
                    const colors = [
                      'bg-slate-200 dark:bg-slate-800',
                      'bg-emerald-200 dark:bg-emerald-900',
                      'bg-emerald-300 dark:bg-emerald-700',
                      'bg-emerald-400 dark:bg-emerald-500',
                      'bg-emerald-500 dark:bg-emerald-400',
                    ];
                    return (
                      <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-xs ${colors[level]}`}
                        title={`Day ${i + 1}: ${level * 3} contributions`}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------- E. LIVE WEB VIEW (IFRAME) ---------------- */}
        {activeTab.pageType === 'webview' && (
          <div className="w-full h-full relative">
            <iframe
              src={activeTab.url}
              title={activeTab.title}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              className="w-full h-full border-none bg-white"
              onLoad={() => updateActiveTab({ isLoading: false })}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubApp;
