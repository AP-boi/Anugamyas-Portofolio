'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  Sparkles,
  Music,
  Sun,
  CloudSun,
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  MoreHorizontal,
  ChevronRight,
  Maximize2,
  Minimize2,
  Volume2,
  Play,
  Pause,
  SkipForward,
  Cpu,
  Wifi,
  BatteryCharging,
  Layers,
} from 'lucide-react';
import { sounds } from '@/lib/soundEngine';
import { cn } from '@/lib/utils';
import { useOSStore } from '@/store/useOSStore';

export interface WidgetCardData {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  gradient: string;
  accentColor: string;
  preview: React.ReactNode;
  details: React.ReactNode;
}

export interface MinimalCardExpandProps {
  cards?: WidgetCardData[];
  className?: string;
  defaultExpandedId?: string | null;
  onCardClick?: (id: string) => void;
}

export const MinimalCardExpand: React.FC<MinimalCardExpandProps> = ({
  cards,
  className = '',
  defaultExpandedId = null,
  onCardClick,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(defaultExpandedId);
  const containerRef = useRef<HTMLDivElement>(null);
  const { openWindow, telemetry } = useOSStore();

  const [isPlaying, setIsPlaying] = useState(true);
  const [todoTasks, setTodoTasks] = useState([
    { id: 1, text: 'Deploy Liquid Glass v2.0', done: true },
    { id: 2, text: 'Review 3D Shaders & WebGL', done: true },
    { id: 3, text: 'Ship AP Intelligence assistant', done: false },
  ]);

  const toggleTodo = (id: number) => {
    sounds.playClick();
    setTodoTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setExpandedId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const defaultCards: WidgetCardData[] = [
    {
      id: 'system-ai',
      title: 'AP Intelligence',
      category: 'System Core',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      gradient: 'from-purple-900/60 via-indigo-900/40 to-slate-900/80',
      accentColor: '#a855f7',
      preview: (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-200">Online & Ready</span>
          </div>
          <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
            {telemetry.fps} FPS
          </span>
        </div>
      ),
      details: (
        <div className="space-y-3 pt-2 text-xs">
          <p className="text-slate-300 leading-relaxed">
            Neural coprocessor active. Ask Anugamya's AI about projects, skills, and system architecture.
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex flex-col">
              <span className="text-slate-400 text-[9px] uppercase">Latency</span>
              <span className="font-bold text-emerald-400">{telemetry.latencyMs} ms</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex flex-col">
              <span className="text-slate-400 text-[9px] uppercase">Engine</span>
              <span className="font-bold text-purple-400">Gemini 2.5</span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              sounds.playClick();
              openWindow('terminal');
            }}
            className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-purple-900/40"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch AP Terminal Intelligence</span>
          </button>
        </div>
      ),
    },
    {
      id: 'music-player',
      title: 'Soundscape Audio',
      category: 'Now Playing',
      icon: <Music className="w-4 h-4 text-cyan-400" />,
      gradient: 'from-cyan-900/60 via-blue-900/40 to-slate-900/80',
      accentColor: '#06b6d4',
      preview: (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2 truncate">
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0ms] h-full" />
              <span className="w-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:150ms] h-2/3" />
              <span className="w-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:300ms] h-4/5" />
            </div>
            <span className="text-xs font-semibold text-slate-200 truncate">Midnight Lo-Fi Dreams</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-300">3:24</span>
        </div>
      ),
      details: (
        <div className="space-y-3 pt-2 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <div>
              <p className="font-bold text-white text-sm">Midnight Lo-Fi Dreams</p>
              <p className="text-[11px] text-cyan-300">Anugamya • Synthesizer OS</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-900/50">
              <Music className="w-5 h-5 text-white" />
            </div>
          </div>
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 w-3/5 rounded-full" />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>1:48</span>
              <span>3:24</span>
            </div>
          </div>
          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-4 pt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                sounds.playClick();
                setIsPlaying(!isPlaying);
              }}
              className="p-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-transform active:scale-95 shadow-md shadow-cyan-500/30"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                sounds.playWindowOpen();
                openWindow('music');
              }}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors"
            >
              Open Full Music App
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'weather-env',
      title: 'Atmosphere & Forecast',
      category: 'Weather',
      icon: <Sun className="w-4 h-4 text-amber-400" />,
      gradient: 'from-amber-900/60 via-orange-900/40 to-slate-900/80',
      accentColor: '#f59e0b',
      preview: (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-1.5">
            <span className="text-base font-light text-white">30°C</span>
            <span className="text-xs text-amber-200">Partly Sunny</span>
          </div>
          <span className="text-[10px] font-mono text-amber-300">New Delhi</span>
        </div>
      ),
      details: (
        <div className="space-y-3 pt-2 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-3xl font-extralight text-white">30°</span>
              <p className="text-xs font-medium text-amber-300">Scattered High Clouds</p>
              <p className="text-[10px] text-slate-400">H: 34° L: 22° • Air Quality: Good</p>
            </div>
            <CloudSun className="w-12 h-12 text-amber-400 animate-pulse" />
          </div>
          <div className="grid grid-cols-3 gap-1.5 pt-1 text-center font-mono text-[10px]">
            <div className="p-1.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-slate-400">HUMIDITY</span>
              <p className="font-bold text-slate-200 mt-0.5">48%</p>
            </div>
            <div className="p-1.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-slate-400">WIND</span>
              <p className="font-bold text-slate-200 mt-0.5">14 km/h</p>
            </div>
            <div className="p-1.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-slate-400">UV INDEX</span>
              <p className="font-bold text-amber-400 mt-0.5">6 High</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'tasks-agenda',
      title: 'Priorities & Milestones',
      category: 'To-Do Tasks',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      gradient: 'from-emerald-900/60 via-teal-900/40 to-slate-900/80',
      accentColor: '#10b981',
      preview: (
        <div className="flex items-center justify-between w-full">
          <span className="text-xs font-semibold text-slate-200">
            {todoTasks.filter((t) => t.done).length} / {todoTasks.length} Completed
          </span>
          <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full">
            Active
          </span>
        </div>
      ),
      details: (
        <div className="space-y-2 pt-2 text-xs">
          {todoTasks.map((task) => (
            <div
              key={task.id}
              onClick={(e) => {
                e.stopPropagation();
                toggleTodo(task.id);
              }}
              className="flex items-center space-x-2 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors"
            >
              {task.done ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-400 flex-shrink-0" />
              )}
              <span
                className={`truncate ${
                  task.done ? 'line-through text-slate-500' : 'text-slate-200'
                }`}
              >
                {task.text}
              </span>
            </div>
          ))}
          <button
            onClick={(e) => {
              e.stopPropagation();
              sounds.playClick();
              openWindow('achievements');
            }}
            className="w-full mt-2 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1"
          >
            <span>View All Milestones</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const items = cards || defaultCards;

  const handleToggle = (id: string) => {
    sounds.playClick();
    const nextId = expandedId === id ? null : id;
    setExpandedId(nextId);
    if (onCardClick) onCardClick(id);
  };

  return (
    <div ref={containerRef} className={cn('w-full max-w-[280px] space-y-2.5 select-none', className)}>
      <LayoutGroup id="skiper23-widgets">
        {items.map((card) => {
          const isExpanded = expandedId === card.id;

          return (
            <motion.div
              layout
              key={card.id}
              onClick={() => handleToggle(card.id)}
              transition={{
                layout: { duration: 0.35, type: 'spring', stiffness: 320, damping: 28 },
              }}
              className={cn(
                'group relative rounded-2xl p-3 border transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl',
                isExpanded
                  ? 'bg-slate-900/90 border-white/30 shadow-2xl ring-1 ring-white/20'
                  : 'bg-slate-950/70 hover:bg-slate-900/80 border-white/15 hover:border-white/25 shadow-lg'
              )}
            >
              {/* Card Ambient Gradient Glow */}
              <div
                className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none',
                  card.gradient
                )}
              />

              {/* Header Row */}
              <motion.div layout="position" className="relative z-10 flex items-center justify-between pb-1">
                <div className="flex items-center space-x-2">
                  <div className="p-1 rounded-lg bg-white/10 border border-white/15">
                    {card.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wide">{card.title}</h4>
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                      {card.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <motion.button
                    layout="position"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(card.id);
                    }}
                    className="p-1 rounded-full hover:bg-white/15 text-slate-400 hover:text-white transition-colors"
                  >
                    {isExpanded ? (
                      <Minimize2 className="w-3.5 h-3.5" />
                    ) : (
                      <Maximize2 className="w-3.5 h-3.5" />
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {/* Collapsed State Preview */}
              {!isExpanded && (
                <motion.div
                  layout="position"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10 pt-1"
                >
                  {card.preview}
                </motion.div>
              )}

              {/* Expanded State Rich Content */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="relative z-10 overflow-hidden"
                  >
                    {card.details}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </LayoutGroup>
    </div>
  );
};

export const Skiper23 = MinimalCardExpand;

export default function Skiper23Demo() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[460px] p-6 bg-slate-950 text-white rounded-3xl border border-white/15 space-y-6">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-bold text-white tracking-wide flex items-center justify-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <span>Skiper UI — Minimal Card Expand (skiper23)</span>
        </h3>
        <p className="text-xs text-white/60">
          Interactive desktop expandable widget cards with spring physics layout animations
        </p>
      </div>

      <MinimalCardExpand defaultExpandedId="system-ai" />
    </div>
  );
}
