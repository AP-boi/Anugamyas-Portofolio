'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore, APP_REGISTRY } from '@/store/useOSStore';
import { AppId } from '@/types/os';
import { Search, ArrowRight, CornerDownLeft, Folder, FileText, Terminal, Activity, Lock } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  category: 'Applications' | 'Projects' | 'System Actions';
  subtitle: string;
  iconSrc?: string;
  iconComponent?: React.ReactNode;
  action: () => void;
}

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpotlightSearch: React.FC<SpotlightSearchProps> = ({ isOpen, onClose }) => {
  const { openWindow, lockScreen } = useOSStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const allItems: SearchResult[] = [
    // Apps
    {
      id: 'app-finder',
      title: 'Finder — Projects Portfolio',
      category: 'Applications',
      subtitle: 'Browse all featured fullstack & 3D WebGL repositories',
      iconSrc: '/icons/finder.png',
      action: () => openWindow('projects'),
    },
    {
      id: 'app-safari',
      title: 'Safari — GitHub Profile (@AP-boi)',
      category: 'Applications',
      subtitle: 'View live commits, stars, repositories, and streak',
      iconSrc: '/icons/safari.png',
      action: () => openWindow('github'),
    },
    {
      id: 'app-notes',
      title: 'Notes — Achievements & Milestones',
      category: 'Applications',
      subtitle: 'Timeline of hackathons, credentials, and achievements',
      iconSrc: '/icons/notes.png',
      action: () => openWindow('achievements'),
    },
    {
      id: 'app-terminal',
      title: 'Terminal — Zsh Shell',
      category: 'Applications',
      subtitle: 'Interactive CLI shell with command parser',
      iconSrc: '/icons/terminal.png',
      action: () => openWindow('terminal'),
    },
    {
      id: 'app-settings',
      title: 'System Settings — Telemetry',
      category: 'Applications',
      subtitle: 'Real-time connection performance & edge telemetry monitor',
      iconSrc: '/icons/settings.png',
      action: () => openWindow('system-info'),
    },
    {
      id: 'app-siri',
      title: 'Siri — AP Intelligence AI Assistant',
      category: 'Applications',
      subtitle: 'Ask AI questions about Anugamya’s architecture & stack',
      iconSrc: '/icons/siri.png',
      action: () => openWindow('ai-assistant'),
    },
    {
      id: 'app-camera',
      title: 'Camera — 3D Motion Matrix',
      category: 'Applications',
      subtitle: 'Interactive 3D voxel pixel grid camera app',
      iconSrc: '/icons/camera.png',
      action: () => openWindow('camera'),
    },
    {
      id: 'app-tetris',
      title: 'Game Center — AI Tetris',
      category: 'Applications',
      subtitle: 'Autonomous self-playing Dellacherie heuristic engine',
      iconSrc: '/icons/games.png',
      action: () => openWindow('tetris'),
    },

    // Projects
    {
      id: 'proj-bharat',
      title: 'Bharat Dekho (Chalo Dekhe Bharat)',
      category: 'Projects',
      subtitle: 'Next.js 15, Gemini AI & Three.js 3D Heritage Portal',
      iconSrc: '/icons/finder.png',
      action: () => {
        openWindow('projects');
      },
    },
    {
      id: 'proj-cyber',
      title: 'Cyber Ascension Game',
      category: 'Projects',
      subtitle: '2D Cyberpunk Action Game Engine on HTML5 Canvas',
      iconSrc: '/icons/games.png',
      action: () => {
        openWindow('projects');
      },
    },
    {
      id: 'proj-airpure',
      title: 'AirPure Delhi',
      category: 'Projects',
      subtitle: 'iOS-styled live AQI air quality telemetry platform',
      iconSrc: '/icons/safari.png',
      action: () => {
        openWindow('projects');
      },
    },

    // Actions
    {
      id: 'act-lock',
      title: 'Lock Screen',
      category: 'System Actions',
      subtitle: 'Lock session and display macOS login screen (⌘L)',
      iconComponent: <Lock className="w-4 h-4 text-slate-700" />,
      action: () => lockScreen(),
    },
  ];

  const filteredResults = allItems.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % Math.max(1, filteredResults.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        filteredResults[selectedIndex].action();
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[99999] flex items-start justify-center pt-28 bg-black/25 backdrop-blur-[4px] select-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -15 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="liquid-glass-card w-full max-w-[620px] rounded-2xl shadow-2xl border border-white/50 bg-white/85 backdrop-blur-[30px] overflow-hidden text-slate-900"
        >
          {/* Spotlight Input Header */}
          <div className="flex items-center px-4 py-3 border-b border-slate-200/80">
            <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Spotlight Search (Apps, Projects, Actions)..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-base text-slate-900 placeholder:text-slate-400 outline-none font-medium"
            />
            <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded border border-slate-200">
              ESC
            </span>
          </div>

          {/* Results List */}
          <div className="max-h-[340px] overflow-y-auto p-1.5 space-y-0.5 divide-y divide-slate-100">
            {filteredResults.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No matching applications or files found.
              </div>
            ) : (
              filteredResults.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      item.action();
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {item.iconSrc ? (
                        <img
                          src={item.iconSrc}
                          alt=""
                          className="w-6 h-6 rounded-md object-contain drop-shadow-xs flex-shrink-0"
                        />
                      ) : (
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {item.iconComponent}
                        </div>
                      )}
                      <div>
                        <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {item.title}
                        </div>
                        <p className={`text-[10px] line-clamp-1 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span
                        className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.category}
                      </span>
                      {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Navigation Tip */}
          <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>Use ↑ ↓ to navigate</span>
            <span>Press ↵ to open • esc to dismiss</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SpotlightSearch;
