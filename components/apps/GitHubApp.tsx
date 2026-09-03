'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Lock,
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
  Star,
  GitFork,
  Download,
  Bookmark,
  Share2,
  SlidersHorizontal,
  Layers,
} from 'lucide-react';
import { useOSStore } from '@/store/useOSStore';
import { sounds } from '@/lib/soundEngine';
import {
  BrandIcon,
  BrandIconKey,
  DuckDuckGoLogo,
  SafariCompassIcon,
  SafariReaderIcon,
  SafariShareIcon,
  SafariSidebarIcon,
} from '@/components/apps/SafariBrandIcons';

// ================= TYPES =================
export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  iconKey: BrandIconKey;
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
const FAVORITES: Array<{
  name: string;
  url: string;
  iconKey: BrandIconKey;
  desc: string;
  type: 'startpage' | 'duckduckgo' | 'webview' | 'reader' | 'github';
}> = [
  {
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com',
    iconKey: 'duckduckgo',
    desc: 'Private Search Engine',
    type: 'duckduckgo',
  },
  {
    name: 'GitHub',
    url: 'https://github.com/AP-boi',
    iconKey: 'github',
    desc: 'Anugamya (@AP-boi) Developer Profile',
    type: 'github',
  },
  {
    name: 'Wikipedia',
    url: 'https://en.wikipedia.org',
    iconKey: 'wikipedia',
    desc: 'The Free Encyclopedia',
    type: 'webview',
  },
  {
    name: 'Hacker News',
    url: 'https://news.ycombinator.com',
    iconKey: 'hackernews',
    desc: 'Tech & Open Source Community',
    type: 'webview',
  },
  {
    name: 'Bharat Dekho',
    url: 'https://github.com/AP-boi/BHARAT-DEKHO',
    iconKey: 'bharatdekho',
    desc: '3D Cultural Heritage Platform',
    type: 'github',
  },
  {
    name: 'PhysX Studio',
    url: 'https://github.com/AP-boi/PHYSX',
    iconKey: 'physx',
    desc: 'GPU Physics Engine in Three.js',
    type: 'github',
  },
  {
    name: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    iconKey: 'mdn',
    desc: 'Open Web Standards & Guides',
    type: 'webview',
  },
  {
    name: 'Dev.to',
    url: 'https://dev.to',
    iconKey: 'devto',
    desc: 'Developer Articles & Engineering',
    type: 'webview',
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

const TRACKERS_BLOCKED = [
  { name: 'doubleclick.net', category: 'Advertising', count: 34 },
  { name: 'google-analytics.com', category: 'Analytics', count: 28 },
  { name: 'facebook.com / meta-pixel', category: 'Cross-Site Tracking', count: 14 },
  { name: 'scorecardresearch.com', category: 'Market Profiling', count: 8 },
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

function resolveBrandIconKey(url: string): BrandIconKey {
  if (url === 'safari:startpage') return 'safari';
  if (url.includes('duckduckgo.com')) return 'duckduckgo';
  if (url.includes('github.com')) return 'github';
  if (url.includes('wikipedia.org')) return 'wikipedia';
  if (url.includes('news.ycombinator.com')) return 'hackernews';
  if (url.includes('BHARAT-DEKHO')) return 'bharatdekho';
  if (url.includes('PHYSX')) return 'physx';
  if (url.includes('developer.mozilla.org')) return 'mdn';
  if (url.includes('dev.to')) return 'devto';
  return 'web';
}

export const GitHubApp: React.FC = () => {
  // Global Store for Spotlight integration
  const { safariSearchQuery, setSafariSearchQuery } = useOSStore();

  // Multi-Tab System
  const [tabs, setTabs] = useState<BrowserTab[]>([
    {
      id: 'tab-1',
      title: 'Safari — Start Page',
      url: 'safari:startpage',
      iconKey: 'safari',
      history: ['safari:startpage'],
      historyIndex: 0,
      isLoading: false,
      pageType: 'startpage',
    },
    {
      id: 'tab-2',
      title: 'Anugamya (@AP-boi) · GitHub',
      url: 'https://github.com/AP-boi',
      iconKey: 'github',
      history: ['https://github.com/AP-boi'],
      historyIndex: 0,
      isLoading: false,
      pageType: 'github',
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');

  // Toolbar & Omnibox state
  const [addressInput, setAddressInput] = useState<string>('safari:startpage');
  const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showBookmarksBar, setShowBookmarksBar] = useState<boolean>(true);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [sidebarView, setSidebarView] = useState<'bookmarks' | 'readingList'>('bookmarks');
  const [showDownloadsPopover, setShowDownloadsPopover] = useState<boolean>(false);
  const [showPrivacyDetails, setShowPrivacyDetails] = useState<boolean>(false);

  // Search Results Cache
  const [ddgAnswer, setDdgAnswer] = useState<DuckDuckGoInstantAnswer | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [readerFontSize, setReaderFontSize] = useState<number>(16);
  const [readerTheme, setReaderTheme] = useState<'paper' | 'sepia' | 'dark'>('paper');

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
      setAddressInput(activeTab.url === 'safari:startpage' ? '' : activeTab.url);
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
      } catch (err) {
        console.warn('Using local fallback for GitHub repository data:', err);
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
    const iconKey = resolveBrandIconKey(url);
    const newTab: BrowserTab = {
      id: newId,
      title,
      url,
      iconKey,
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
      setTabs([
        {
          id: 'tab-1',
          title: 'Start Page',
          url: 'safari:startpage',
          iconKey: 'safari',
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

    let pageType: BrowserTab['pageType'] = 'webview';
    let iconKey: BrandIconKey = resolveBrandIconKey(finalUrl);
    let title = finalUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

    if (finalUrl === 'safari:startpage') {
      pageType = 'startpage';
      iconKey = 'safari';
      title = 'Start Page';
    } else if (finalUrl.includes('duckduckgo.com')) {
      pageType = 'duckduckgo';
      iconKey = 'duckduckgo';
      title = 'DuckDuckGo';
    } else if (finalUrl.includes('github.com/AP-boi') || finalUrl.includes('github.com')) {
      pageType = 'github';
      iconKey = 'github';
      title = 'Anugamya (@AP-boi) · GitHub';
    } else if (finalUrl.includes('wikipedia.org')) {
      iconKey = 'wikipedia';
      title = 'Wikipedia';
    }

    updateActiveTab({
      url: finalUrl,
      title,
      iconKey,
      pageType,
      isLoading: true,
      history: [...activeTab.history.slice(0, activeTab.historyIndex + 1), finalUrl],
      historyIndex: activeTab.historyIndex + 1,
    });

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
      iconKey: 'duckduckgo',
      pageType: 'duckduckgo',
      searchQuery: query,
      isLoading: true,
      history: [...activeTab.history.slice(0, activeTab.historyIndex + 1), finalUrl],
      historyIndex: activeTab.historyIndex + 1,
    });

    setDdgAnswer(null);
    setSearchResults([]);

    try {
      const ddgPromise = (async () => {
        try {
          const ddgRes = await fetch(
            `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
          );
          if (ddgRes.ok) {
            const data = await ddgRes.json();
            if (data.Heading || data.AbstractText) {
              setDdgAnswer({
                heading: data.Heading || query,
                abstract: data.AbstractText,
                abstractSource: data.AbstractSource,
                abstractUrl: data.AbstractURL,
                image: data.Image,
                relatedTopics: Array.isArray(data.RelatedTopics)
                  ? data.RelatedTopics.slice(0, 4).map((rt: any) => ({
                      text: rt.Text || '',
                      firstUrl: rt.FirstURL || '',
                    }))
                  : [],
              });
            }
          }
        } catch (e) {
          console.warn('DuckDuckGo Instant Answer fetch skipped:', e);
        }
      })();

      const wikiPromise = (async () => {
        try {
          const wikiRes = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
              query
            )}&format=json&origin=*`
          );
          if (wikiRes.ok) {
            const data = await wikiRes.json();
            if (data.query?.search) {
              const formatted: SearchResultItem[] = data.query.search.map((item: any) => ({
                title: item.title,
                snippet: item.snippet.replace(/<[^>]*>?/gm, ''),
                url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`,
                wordcount: item.wordcount,
                timestamp: item.timestamp,
              }));
              setSearchResults(formatted);
            }
          }
        } catch (e) {
          console.warn('Wikipedia Search API query skipped:', e);
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
          iconKey: 'reader',
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
          iconKey: 'reader',
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
        iconKey: 'reader',
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
    <div className="flex flex-col h-full bg-[#f6f6f7] dark:bg-[#1c1c1e] text-slate-800 dark:text-slate-100 font-sans select-none overflow-hidden transition-colors">
      {/* ================= 1. UNIFIED MAC OS SAFARI TOOLBAR ================= */}
      <div className="flex items-center space-x-2 px-3 py-2 bg-[#f0f0f2]/95 dark:bg-[#28282a]/95 border-b border-black/[0.08] dark:border-white/[0.08] backdrop-blur-md flex-shrink-0 z-20">
        {/* Left Action Controls */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          {/* Sidebar Toggle Button */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setShowSidebar(!showSidebar);
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              showSidebar
                ? 'bg-black/10 dark:bg-white/20 text-blue-600 dark:text-blue-400'
                : 'hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300'
            }`}
            title="Toggle Safari Sidebar (Bookmarks & Reading List)"
          >
            <SafariSidebarIcon className="w-4 h-4" />
          </button>

          {/* Navigation Chevron Cluster */}
          <div className="flex items-center space-x-0.5 bg-black/[0.04] dark:bg-white/[0.06] rounded-lg p-0.5">
            <button
              type="button"
              onClick={handleBack}
              disabled={activeTab.historyIndex === 0}
              className={`p-1 rounded-md transition-colors ${
                activeTab.historyIndex > 0
                  ? 'hover:bg-black/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 cursor-pointer'
                  : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
              }`}
              title="Back (⌘[)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleForward}
              disabled={activeTab.historyIndex >= activeTab.history.length - 1}
              className={`p-1 rounded-md transition-colors ${
                activeTab.historyIndex < activeTab.history.length - 1
                  ? 'hover:bg-black/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 cursor-pointer'
                  : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
              }`}
              title="Forward (⌘])"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Unified Smart Search Field (Omnibox) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsEditingAddress(false);
            navigateTo(addressInput);
          }}
          className="flex-1 max-w-2xl mx-auto flex items-center space-x-2 bg-white dark:bg-[#1a1a1c] border border-black/[0.12] dark:border-white/[0.12] rounded-xl px-3 py-1.5 text-xs shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all"
        >
          {activeTab.pageType === 'startpage' ? (
            <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          ) : (
            <div className="flex items-center space-x-1.5 flex-shrink-0 text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">Secure</span>
            </div>
          )}

          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              value={addressInput}
              onFocus={() => {
                setIsEditingAddress(true);
                if (activeTab.pageType === 'startpage') setAddressInput('');
              }}
              onBlur={() => {
                setIsEditingAddress(false);
                if (!addressInput) setAddressInput(activeTab.url === 'safari:startpage' ? '' : activeTab.url);
              }}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="Search DuckDuckGo or enter website URL"
              className="w-full bg-transparent border-none outline-none font-sans text-xs text-slate-900 dark:text-white placeholder:text-slate-400 text-center focus:text-left selection:bg-blue-500/30"
            />
          </div>

          {/* Reader Mode Button */}
          {activeTab.pageType === 'reader' && (
            <button
              type="button"
              onClick={() => {
                if (activeTab.readerData?.url) navigateTo(activeTab.readerData.url);
              }}
              className="p-1 rounded-md text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 transition-colors cursor-pointer flex-shrink-0"
              title="Exit Reader Mode"
            >
              <SafariReaderIcon className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Embedded Reload / Stop Button */}
          <button
            type="button"
            onClick={activeTab.isLoading ? () => updateActiveTab({ isLoading: false }) : handleReload}
            className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer flex-shrink-0"
            title={activeTab.isLoading ? 'Stop Loading' : 'Reload Page (⌘R)'}
          >
            {activeTab.isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
            ) : (
              <RotateCw className="w-3.5 h-3.5" />
            )}
          </button>
        </form>

        {/* Right Toolbar Actions */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer relative"
            title="Share Page / Copy Link"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <SafariShareIcon className="w-4 h-4" />}
          </button>

          {/* Downloads Popover Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDownloadsPopover(!showDownloadsPopover)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                showDownloadsPopover
                  ? 'bg-black/10 dark:bg-white/20 text-blue-600 dark:text-blue-400'
                  : 'hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300'
              }`}
              title="Downloads"
            >
              <Download className="w-4 h-4" />
            </button>

            {showDownloadsPopover && (
              <div className="absolute right-0 top-9 w-64 p-3 bg-white dark:bg-[#252528] rounded-xl shadow-xl border border-black/10 dark:border-white/10 z-50 animate-fadeIn space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-900 dark:text-white">Safari Downloads</span>
                  <span className="text-[10px] text-slate-400 font-mono">2 files</span>
                </div>
                <div className="space-y-1.5">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                    <div className="truncate pr-2">
                      <p className="font-medium text-slate-800 dark:text-slate-200 truncate">architecture_manifest.ts</p>
                      <p className="text-[10px] text-slate-400">14.2 KB · Completed</p>
                    </div>
                    <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                    <div className="truncate pr-2">
                      <p className="font-medium text-slate-800 dark:text-slate-200 truncate">anugamya_resume.pdf</p>
                      <p className="text-[10px] text-slate-400">182 KB · Completed</p>
                    </div>
                    <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* New Tab Button */}
          <button
            type="button"
            onClick={() => createNewTab()}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="New Tab (⌘T)"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= 2. AUTHENTIC MAC OS SAFARI TAB BAR ================= */}
      <div className="flex items-center bg-[#e4e4e7] dark:bg-[#18181a] px-2 pt-1.5 border-b border-black/[0.08] dark:border-white/[0.08] overflow-x-auto no-scrollbar gap-1 flex-shrink-0">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setActiveTabId(tab.id);
              }}
              className={`group relative flex items-center min-w-[140px] max-w-[240px] flex-1 h-8 px-3 rounded-t-lg text-xs transition-all cursor-pointer border-t border-x ${
                isActive
                  ? 'bg-white dark:bg-[#252528] text-slate-900 dark:text-white border-black/[0.08] dark:border-white/[0.08] shadow-xs font-semibold'
                  : 'bg-transparent text-slate-600 dark:text-slate-400 border-transparent hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <div className="mr-2 flex-shrink-0 flex items-center justify-center">
                <BrandIcon iconKey={tab.iconKey} className="w-3.5 h-3.5" />
              </div>
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

        {/* Tab Strip Inline Plus Button */}
        <button
          type="button"
          onClick={() => createNewTab()}
          className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer mb-0.5 ml-1"
          title="New Tab (⌘T)"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ================= 3. FAVORITES / BOOKMARKS BAR ================= */}
      {showBookmarksBar && (
        <div className="flex items-center space-x-1 px-3 py-1 bg-[#fbfbfb] dark:bg-[#1f1f22] border-b border-black/[0.06] dark:border-white/[0.06] text-[11px] overflow-x-auto no-scrollbar flex-shrink-0">
          {FAVORITES.map((f, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => navigateTo(f.url)}
              className="flex items-center space-x-1.5 px-2 py-0.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer flex-shrink-0 font-medium"
            >
              <BrandIcon iconKey={f.iconKey} className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{f.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* ================= 4. MAIN BROWSER BODY (WITH OPTIONAL SIDEBAR) ================= */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Safari Collapsible Sidebar */}
        {showSidebar && (
          <aside className="w-56 bg-[#f4f4f6] dark:bg-[#202022] border-r border-black/[0.08] dark:border-white/[0.08] flex flex-col flex-shrink-0 animate-fadeIn text-xs">
            <div className="flex items-center border-b border-slate-200 dark:border-slate-800 p-2 gap-1 font-medium">
              <button
                type="button"
                onClick={() => setSidebarView('bookmarks')}
                className={`flex-1 py-1 px-2 rounded-md text-center transition-colors ${
                  sidebarView === 'bookmarks'
                    ? 'bg-white dark:bg-[#2c2c2e] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Bookmarks
              </button>
              <button
                type="button"
                onClick={() => setSidebarView('readingList')}
                className={`flex-1 py-1 px-2 rounded-md text-center transition-colors ${
                  sidebarView === 'readingList'
                    ? 'bg-white dark:bg-[#2c2c2e] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Reading List
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {sidebarView === 'bookmarks' ? (
                <div className="space-y-1">
                  <p className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 pt-1 pb-0.5">
                    Favorites
                  </p>
                  {FAVORITES.map((f, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => navigateTo(f.url)}
                      className="w-full flex items-center space-x-2 px-2 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-left text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      <BrandIcon iconKey={f.iconKey} className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{f.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 pt-1 pb-0.5">
                    Unread Articles
                  </p>
                  <div
                    onClick={() => openReaderMode('Three.js', 'https://en.wikipedia.org/wiki/Three.js')}
                    className="p-2 rounded-lg bg-white dark:bg-[#28282b] border border-black/5 dark:border-white/5 space-y-1 cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <p className="font-semibold text-slate-900 dark:text-white text-[11px] truncate">
                      Three.js — 3D Computer Graphics in JavaScript
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">en.wikipedia.org</p>
                  </div>
                  <div
                    onClick={() => openReaderMode('Next.js', 'https://en.wikipedia.org/wiki/Next.js')}
                    className="p-2 rounded-lg bg-white dark:bg-[#28282b] border border-black/5 dark:border-white/5 space-y-1 cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <p className="font-semibold text-slate-900 dark:text-white text-[11px] truncate">
                      Next.js — Full-stack React Framework
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">en.wikipedia.org</p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Browser Content Area */}
        <main className="flex-1 overflow-auto bg-white dark:bg-[#18181a] relative">
          {/* Top Thin Page Loading Indicator */}
          {activeTab.isLoading && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 animate-pulse z-50" />
          )}

          {/* ---------------- A. AUTHENTIC SAFARI START PAGE ---------------- */}
          {activeTab.pageType === 'startpage' && (
            <div className="min-h-full p-8 max-w-4xl mx-auto space-y-8 animate-fadeIn">
              {/* Safari Greeting */}
              <div className="text-center space-y-2 pt-6">
                <div className="flex justify-center mb-2">
                  <SafariCompassIcon className="w-14 h-14" />
                </div>
                <h1 className="text-3xl font-serif font-medium tracking-tight text-slate-900 dark:text-white">
                  Favorites
                </h1>
                <p className="text-xs text-slate-500 font-mono">macOS Sonoma Safari Architecture</p>
              </div>

              {/* Apple Squircle Favorites Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {FAVORITES.map((f, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigateTo(f.url)}
                    className="group flex flex-col items-center p-4 rounded-2xl bg-[#f5f5f7] dark:bg-[#252528] hover:bg-[#eaeaea] dark:hover:bg-[#2e2e32] transition-all cursor-pointer border border-black/5 dark:border-white/5 hover:scale-[1.03] shadow-xs"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#1a1a1c] flex items-center justify-center shadow-sm border border-black/5 dark:border-white/10 mb-2.5 group-hover:shadow-md transition-shadow">
                      <BrandIcon iconKey={f.iconKey} className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white text-center truncate w-full">
                      {f.name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 text-center truncate w-full mt-0.5 font-sans">
                      {f.desc}
                    </span>
                  </div>
                ))}
              </div>

              {/* Privacy Report Widget */}
              <div className="p-5 rounded-2xl bg-[#f5f5f7] dark:bg-[#252528] border border-black/5 dark:border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-semibold text-xs">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                    <span>Privacy Report</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPrivacyDetails(!showPrivacyDetails)}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    {showPrivacyDetails ? 'Hide Details' : 'View Trackers'}
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  In the last 30 days, Safari protected your browsing session and prevented 84 cross-site trackers from profiling you via DuckDuckGo private browsing.
                </p>

                {showPrivacyDetails && (
                  <div className="pt-2 border-t border-black/10 dark:border-white/10 space-y-2 text-xs">
                    <p className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Trackers Prevented</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {TRACKERS_BLOCKED.map((tr, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-xl bg-white dark:bg-[#1a1a1c] border border-black/5 dark:border-white/5 flex items-center justify-between"
                        >
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px]">{tr.name}</span>
                            <span className="text-[10px] text-slate-400">{tr.category}</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                            {tr.count} blocked
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ---------------- B. DUCKDUCKGO SEARCH PAGE ---------------- */}
          {activeTab.pageType === 'duckduckgo' && (
            <div className="min-h-full bg-white dark:bg-[#18181a] p-6 max-w-4xl mx-auto space-y-6 animate-fadeIn">
              {/* DuckDuckGo SERP Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-black/10 dark:border-white/10 pb-4">
                <div className="flex items-center space-x-3">
                  <DuckDuckGoLogo className="w-8 h-8 flex-shrink-0" />
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
                <div className="p-4 rounded-xl bg-[#fafafa] dark:bg-[#202022] border border-black/10 dark:border-white/10 space-y-3">
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
                          className="text-[11px] px-2.5 py-1 rounded-md bg-white dark:bg-[#2b2b2e] border border-black/10 dark:border-white/10 hover:border-[#DE5833] text-slate-800 dark:text-slate-200 transition-colors"
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
                      Search DuckDuckGo or enter a search query in the Safari address bar.
                    </p>
                    <div className="flex justify-center flex-wrap gap-2 pt-2">
                      {DUCKDUCKGO_BANGS.map((b, idx) => (
                        <button
                          key={idx}
                          onClick={() => navigateToSearch(`${b.bang} `)}
                          className="text-xs px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/10 font-mono hover:bg-black/10 transition-colors"
                        >
                          {b.bang} <span className="font-sans text-[10px] text-slate-500">({b.label})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.map((item, idx) => (
                  <div key={idx} className="space-y-1 group">
                    <div className="flex items-center space-x-1.5 text-[11px] text-[#006621] dark:text-[#34a853] font-mono truncate">
                      <Globe className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{item.url}</span>
                    </div>

                    <h4
                      onClick={() => openReaderMode(item.title, item.url)}
                      className="text-base font-medium text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer"
                    >
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                      {item.snippet}
                    </p>

                    <div className="flex items-center space-x-3 pt-1 text-[11px] text-slate-500">
                      <button
                        type="button"
                        onClick={() => openReaderMode(item.title, item.url)}
                        className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <SafariReaderIcon className="w-3 h-3" />
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

          {/* ---------------- C. AUTHENTIC SAFARI READER MODE ---------------- */}
          {activeTab.pageType === 'reader' && activeTab.readerData && (
            <div
              className={`min-h-full p-8 max-w-2xl mx-auto space-y-6 animate-fadeIn ${
                readerTheme === 'sepia'
                  ? 'bg-[#fbf0d9] text-[#5f4b32]'
                  : readerTheme === 'dark'
                  ? 'bg-[#18181a] text-[#dcdcdc]'
                  : 'bg-[#fafafa] text-[#1a1a1a]'
              }`}
            >
              {/* Reader Floating Controls Bar */}
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3 text-xs font-sans">
                <div className="flex items-center space-x-2 font-mono text-[10px] uppercase font-bold text-slate-400">
                  <SafariReaderIcon className="w-3.5 h-3.5" />
                  <span>Safari Reader</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center rounded-lg bg-black/5 dark:bg-white/10 p-0.5 font-bold">
                    <button
                      type="button"
                      onClick={() => setReaderFontSize((prev) => Math.max(12, prev - 2))}
                      className="px-2 py-0.5 rounded hover:bg-white dark:hover:bg-black/30"
                      title="Smaller text"
                    >
                      A-
                    </button>
                    <button
                      type="button"
                      onClick={() => setReaderFontSize((prev) => Math.min(26, prev + 2))}
                      className="px-2 py-0.5 rounded hover:bg-white dark:hover:bg-black/30"
                      title="Larger text"
                    >
                      A+
                    </button>
                  </div>
                  <div className="flex items-center space-x-1 pl-2 border-l border-black/10 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setReaderTheme('paper')}
                      className={`w-4 h-4 rounded-full border border-black/20 ${
                        readerTheme === 'paper' ? 'ring-2 ring-blue-500' : ''
                      } bg-[#fafafa]`}
                      title="Light Theme"
                    />
                    <button
                      type="button"
                      onClick={() => setReaderTheme('sepia')}
                      className={`w-4 h-4 rounded-full border border-black/20 ${
                        readerTheme === 'sepia' ? 'ring-2 ring-blue-500' : ''
                      } bg-[#fbf0d9]`}
                      title="Sepia Theme"
                    />
                    <button
                      type="button"
                      onClick={() => setReaderTheme('dark')}
                      className={`w-4 h-4 rounded-full border border-white/20 ${
                        readerTheme === 'dark' ? 'ring-2 ring-blue-500' : ''
                      } bg-[#1c1c1e]`}
                      title="Dark Theme"
                    />
                  </div>
                  <a
                    href={activeTab.readerData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 ml-2 font-medium"
                  >
                    <span>Original</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Article Content */}
              <article className="space-y-4 font-serif leading-relaxed">
                <h1 className="text-3xl font-bold leading-tight">
                  {activeTab.readerData.title}
                </h1>

                {activeTab.readerData.description && (
                  <p className="text-sm italic opacity-75">
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
                  className="space-y-4 pt-2"
                >
                  <p>{activeTab.readerData.extract}</p>
                </div>
              </article>
            </div>
          )}

          {/* ---------------- D. GITHUB IN-BROWSER PAGE ---------------- */}
          {activeTab.pageType === 'github' && (
            <div className="min-h-full bg-white dark:bg-[#0d1117] text-slate-900 dark:text-[#c9d1d9] p-6 max-w-5xl mx-auto space-y-6 animate-fadeIn">
              {/* GitHub In-Page Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center space-x-3.5">
                  <img
                    src={userProfile.avatar_url}
                    alt="Anugamya"
                    className="w-14 h-14 rounded-full border-2 border-slate-300 dark:border-slate-700 shadow-sm"
                  />
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>Anugamya</span>
                      <BrandIcon iconKey="github" className="w-4 h-4 text-slate-500" />
                    </h2>
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
        </main>
      </div>
    </div>
  );
};

export default GitHubApp;
