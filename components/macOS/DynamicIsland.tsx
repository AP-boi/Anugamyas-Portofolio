'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore } from '@/store/useOSStore';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Activity,
  Sparkles,
  Wifi,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { sounds } from '@/lib/soundEngine';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverColor: string;
}

export const PLAYLIST: Track[] = [
  {
    id: 't-1',
    title: 'Sonoma Sunset',
    artist: 'Anugamya Audio Lab',
    album: 'macOS Ambient Vol. 1',
    duration: 184,
    coverColor: 'from-amber-500 via-rose-500 to-indigo-600',
  },
  {
    id: 't-2',
    title: 'Cyber Ascension (Theme)',
    artist: 'AP-boi',
    album: 'Cyber Ascension OST',
    duration: 215,
    coverColor: 'from-cyan-500 via-blue-600 to-purple-700',
  },
  {
    id: 't-3',
    title: 'Bharat Heritage Melody',
    artist: 'Indian Classical Synth',
    album: 'Bharat Dekho OST',
    duration: 198,
    coverColor: 'from-orange-500 via-amber-600 to-emerald-600',
  },
  {
    id: 't-4',
    title: 'Midnight Coding in Tokyo',
    artist: 'Lofi Chilled Vibes',
    album: 'Deep Focus Beats',
    duration: 160,
    coverColor: 'from-purple-600 via-pink-600 to-rose-500',
  },
];

export const DynamicIsland: React.FC = () => {
  const { openWindow, telemetry } = useOSStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(42);
  const [volume, setVolume] = useState(75);

  const currentTrack = PLAYLIST[currentTrackIndex];

  // Track playback time ticker
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentTime((prev) => (prev >= currentTrack.duration ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, currentTrack.duration]);

  const handleTogglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    sounds.playClick();
    setIsPlaying((prev) => !prev);
  };

  const handleNextTrack = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    sounds.playClick();
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setCurrentTime(0);
  };

  const handlePrevTrack = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    sounds.playClick();
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setCurrentTime(0);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="relative flex items-center justify-center select-none">
      <motion.div
        layout
        onClick={() => {
          sounds.playClick();
          setIsExpanded(!isExpanded);
        }}
        initial={false}
        animate={{
          width: isExpanded ? 340 : isPlaying ? 240 : 180,
          height: isExpanded ? 160 : 26,
          borderRadius: isExpanded ? 24 : 13,
        }}
        transition={{
          type: 'spring',
          stiffness: 420,
          damping: 32,
          mass: 0.7,
        }}
        className="bg-black/90 text-white backdrop-blur-[24px] border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer overflow-hidden flex flex-col justify-between p-2.5 z-[1000]"
      >
        {/* COMPACT PILL MODE */}
        {!isExpanded && (
          <motion.div
            layout="position"
            className="flex items-center justify-between w-full h-full px-1 text-xs"
          >
            {/* Left: Album cover or Activity indicator */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br ${currentTrack.coverColor} flex-shrink-0 animate-pulse`}
              />
              <span className="text-[11px] font-semibold text-white/90 truncate max-w-[110px]">
                {currentTrack.title}
              </span>
            </div>

            {/* Right: Real-time sound wave bars */}
            <div className="flex items-center space-x-1.5">
              {isPlaying ? (
                <div className="flex items-center space-x-0.5 h-3">
                  <span className="w-0.5 h-2.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '0.6s' }} />
                  <span className="w-0.5 h-3.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.1s' }} />
                  <span className="w-0.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '0.5s', animationDelay: '0.2s' }} />
                  <span className="w-0.5 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '0.7s', animationDelay: '0.15s' }} />
                </div>
              ) : (
                <span className="text-[10px] text-white/50 font-mono">PAUSED</span>
              )}
            </div>
          </motion.div>
        )}

        {/* EXPANDED ISLAND HUD MODE */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col justify-between h-full w-full space-y-2 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Track Info Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${currentTrack.coverColor} flex items-center justify-center shadow-lg border border-white/20`}
                >
                  <Radio className="w-5 h-5 text-white/90" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">{currentTrack.title}</h4>
                  <p className="text-[11px] text-white/70">{currentTrack.artist}</p>
                  <span className="text-[9px] text-white/40 font-mono">{currentTrack.album}</span>
                </div>
              </div>

              {/* Edge Node Telemetry Mini Badge */}
              <div className="text-right">
                <div className="flex items-center space-x-1 justify-end text-[10px] text-emerald-400 font-mono font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>{telemetry.fps} FPS</span>
                </div>
                <span className="text-[9px] text-white/40 font-mono">{telemetry.latencyMs}ms latency</span>
              </div>
            </div>

            {/* Middle Scrubber Bar */}
            <div className="space-y-1">
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-white/60">
                <span>{formatSeconds(currentTime)}</span>
                <span>{formatSeconds(currentTrack.duration)}</span>
              </div>
            </div>

            {/* Bottom Controls Row */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => openWindow('music')}
                  className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] text-white font-medium transition-colors flex items-center gap-1"
                >
                  <span>Open Music</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePrevTrack}
                  className="text-white/70 hover:text-white transition-colors p-1"
                >
                  <SkipBack className="w-4 h-4 fill-current" />
                </button>

                <button
                  onClick={handleTogglePlay}
                  className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={handleNextTrack}
                  className="text-white/70 hover:text-white transition-colors p-1"
                >
                  <SkipForward className="w-4 h-4 fill-current" />
                </button>
              </div>

              <div className="flex items-center space-x-1.5 text-white/70">
                <Volume2 className="w-3.5 h-3.5" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-14 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default DynamicIsland;
