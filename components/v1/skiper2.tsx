'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Phone,
  PhoneOff,
  Mic,
  Timer as TimerIcon,
  Music,
  Share2,
  Radio,
  BatteryCharging,
  ScanFace,
  Check,
  RotateCcw,
  Sparkles,
  ExternalLink,
  CircleDot,
  Bell,
  SlidersHorizontal,
} from 'lucide-react';
import { sounds } from '@/lib/soundEngine';

export type IslandView =
  | 'idle'
  | 'ring'
  | 'call'
  | 'timer'
  | 'record'
  | 'music'
  | 'airdrop'
  | 'battery'
  | 'faceid';

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

const springTransition = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 32,
  mass: 0.75,
};

export interface DynamicIslandProps {
  view?: IslandView;
  variantKey?: string;
  className?: string;
  onViewChange?: (view: IslandView) => void;
  onOpenApp?: (appId: string) => void;
  interactive?: boolean;
}

export const DynamicIsland: React.FC<DynamicIslandProps> = ({
  view: controlledView,
  variantKey,
  className = '',
  onViewChange,
  onOpenApp,
  interactive = true,
}) => {
  const [internalView, setInternalView] = useState<IslandView>('music');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const activeView: IslandView = controlledView || internalView;

  const setView = (newView: IslandView) => {
    setInternalView(newView);
    if (onViewChange) onViewChange(newView);
  };

  // Music State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(42);
  const [volume, setVolume] = useState<number>(75);
  const currentTrack = PLAYLIST[currentTrackIndex];

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(300); // 5 mins
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Record State
  const [recordSeconds, setRecordSeconds] = useState<number>(18);
  const [isRecording, setIsRecording] = useState<boolean>(true);

  // Airdrop State
  const [airdropProgress, setAirdropProgress] = useState<number>(64);
  const [airdropAccepted, setAirdropAccepted] = useState<boolean>(false);

  // FaceID State
  const [faceIdVerified, setFaceIdVerified] = useState<boolean>(false);

  // Music timer loop
  useEffect(() => {
    if (!isPlaying || activeView !== 'music') return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => (prev >= currentTrack.duration ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, activeView, currentTrack.duration]);

  // Timer countdown loop
  useEffect(() => {
    if (!isTimerRunning || activeView !== 'timer') return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, activeView]);

  // Record timer loop
  useEffect(() => {
    if (!isRecording || activeView !== 'record') return;
    const interval = setInterval(() => {
      setRecordSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording, activeView]);

  // FaceID verification trigger
  useEffect(() => {
    if (activeView === 'faceid') {
      setFaceIdVerified(false);
      const timer = setTimeout(() => {
        setFaceIdVerified(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [activeView]);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
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

  // Dimensions mapper depending on view and expansion
  const getDimensions = () => {
    if (isExpanded) {
      switch (activeView) {
        case 'music':
          return { width: 360, height: 168, borderRadius: 28 };
        case 'timer':
          return { width: 340, height: 140, borderRadius: 26 };
        case 'ring':
        case 'call':
          return { width: 340, height: 110, borderRadius: 24 };
        case 'record':
          return { width: 340, height: 135, borderRadius: 26 };
        case 'airdrop':
          return { width: 340, height: 140, borderRadius: 26 };
        case 'battery':
          return { width: 320, height: 115, borderRadius: 24 };
        case 'faceid':
          return { width: 260, height: 125, borderRadius: 24 };
        case 'idle':
        default:
          return { width: 320, height: 100, borderRadius: 24 };
      }
    }

    // Compact pill dimensions
    switch (activeView) {
      case 'idle':
        return { width: 140, height: 28, borderRadius: 14 };
      case 'ring':
      case 'call':
        return { width: 220, height: 28, borderRadius: 14 };
      case 'timer':
        return { width: 195, height: 28, borderRadius: 14 };
      case 'record':
        return { width: 190, height: 28, borderRadius: 14 };
      case 'airdrop':
        return { width: 220, height: 28, borderRadius: 14 };
      case 'battery':
        return { width: 175, height: 28, borderRadius: 14 };
      case 'faceid':
        return { width: 155, height: 28, borderRadius: 14 };
      case 'music':
      default:
        return { width: isPlaying ? 245 : 185, height: 28, borderRadius: 14 };
    }
  };

  const dimensions = getDimensions();

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <motion.div
        layout
        onClick={() => {
          if (interactive) {
            sounds.playClick();
            setIsExpanded(!isExpanded);
          }
        }}
        initial={false}
        animate={{
          width: dimensions.width,
          height: dimensions.height,
          borderRadius: dimensions.borderRadius,
        }}
        transition={springTransition}
        className="bg-black/95 text-white backdrop-blur-[30px] border border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.08)] cursor-pointer overflow-hidden flex flex-col justify-between p-2.5 z-[1000] relative"
      >
        <AnimatePresence mode="wait">
          {/* COMPACT PILL MODE */}
          {!isExpanded && (
            <motion.div
              key={`compact-${activeView}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-between w-full h-full px-1 text-xs"
            >
              {/* IDLE */}
              {activeView === 'idle' && (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700 ring-1 ring-white/20 shadow-inner" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500/80 animate-pulse" />
                  </div>
                  <span className="text-[10px] font-mono text-white/50">AP OS</span>
                </div>
              )}

              {/* MUSIC COMPACT */}
              {activeView === 'music' && (
                <>
                  <div className="flex items-center space-x-2 min-w-0">
                    <div
                      className={`w-4 h-4 rounded-full bg-gradient-to-br ${currentTrack.coverColor} flex-shrink-0 animate-pulse`}
                    />
                    <span className="text-[11px] font-semibold text-white/95 truncate max-w-[125px]">
                      {currentTrack.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    {isPlaying ? (
                      <div className="flex items-center space-x-0.5 h-3">
                        <span className="w-0.5 h-2.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '0.6s' }} />
                        <span className="w-0.5 h-3.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.1s' }} />
                        <span className="w-0.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '0.5s', animationDelay: '0.2s' }} />
                        <span className="w-0.5 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '0.7s', animationDelay: '0.15s' }} />
                      </div>
                    ) : (
                      <span className="text-[9px] text-white/50 font-mono">PAUSED</span>
                    )}
                  </div>
                </>
              )}

              {/* TIMER COMPACT */}
              {activeView === 'timer' && (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-1.5">
                    <TimerIcon className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span className="text-[10px] font-medium text-amber-300">Timer</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-white tracking-wider">
                    {formatSeconds(timerSeconds)}
                  </span>
                </div>
              )}

              {/* CALL / RING COMPACT */}
              {(activeView === 'ring' || activeView === 'call') && (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center animate-pulse">
                      <Phone className="w-2 h-2 text-white" />
                    </div>
                    <span className="text-[10px] font-medium text-white/90 truncate max-w-[110px]">
                      Tim Cook
                    </span>
                  </div>
                  <span className="text-[9px] text-emerald-400 font-mono">00:48</span>
                </div>
              )}

              {/* RECORD COMPACT */}
              {activeView === 'record' && (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-[10px] font-medium text-rose-300">Recording</span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-white">
                    {formatSeconds(recordSeconds)}
                  </span>
                </div>
              )}

              {/* AIRDROP COMPACT */}
              {activeView === 'airdrop' && (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-1.5">
                    <Share2 className="w-3.5 h-3.5 text-blue-400 animate-bounce" />
                    <span className="text-[10px] font-medium text-blue-300 truncate max-w-[110px]">
                      AirDrop
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-white/80">{airdropProgress}%</span>
                </div>
              )}

              {/* BATTERY COMPACT */}
              {activeView === 'battery' && (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-1.5">
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] font-medium text-emerald-300">MagSafe</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-white">98%</span>
                </div>
              )}

              {/* FACEID COMPACT */}
              {activeView === 'faceid' && (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-1.5">
                    <ScanFace className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[10px] font-medium text-cyan-300">Face ID</span>
                  </div>
                  {faceIdVerified ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* EXPANDED ISLAND HUD MODE */}
          {isExpanded && (
            <motion.div
              key={`expanded-${activeView}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col justify-between h-full w-full space-y-2 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* MUSIC VIEW */}
              {activeView === 'music' && (
                <>
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

                    <div className="text-right">
                      <div className="flex items-center space-x-1 justify-end text-[10px] text-emerald-400 font-mono font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        <span>Playing</span>
                      </div>
                      <span className="text-[9px] text-white/40 font-mono">Spatial Audio</span>
                    </div>
                  </div>

                  {/* Scrubber Bar */}
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
                  <div className="flex items-center justify-between pt-0.5">
                    <button
                      onClick={() => onOpenApp ? onOpenApp('music') : sounds.playClick()}
                      className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] text-white font-medium transition-colors flex items-center gap-1"
                    >
                      <span>Open Music</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handlePrevTrack}
                        className="text-white/70 hover:text-white transition-colors p-1"
                      >
                        <SkipBack className="w-4 h-4 fill-current" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sounds.playClick();
                          setIsPlaying(!isPlaying);
                        }}
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
                </>
              )}

              {/* TIMER VIEW */}
              {activeView === 'timer' && (
                <div className="flex flex-col justify-between h-full space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <TimerIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Focus Timer</h4>
                        <p className="text-[10px] text-white/60">Anugamya Deep Work Session</p>
                      </div>
                    </div>
                    <span className="text-xl font-mono font-bold text-amber-400 tracking-wider">
                      {formatSeconds(timerSeconds)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300"
                      style={{ width: `${(timerSeconds / 300) * 100}%` }}
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setTimerSeconds(300);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-medium transition-colors flex items-center gap-1 text-white/80"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        setIsTimerRunning(!isTimerRunning);
                      }}
                      className={`px-4 py-1 rounded-full text-[10px] font-bold transition-all shadow-md ${
                        isTimerRunning
                          ? 'bg-amber-500 text-black hover:bg-amber-400'
                          : 'bg-emerald-500 text-white hover:bg-emerald-400'
                      }`}
                    >
                      {isTimerRunning ? 'Pause' : 'Resume'}
                    </button>
                  </div>
                </div>
              )}

              {/* CALL / RING VIEW */}
              {(activeView === 'ring' || activeView === 'call') && (
                <div className="flex items-center justify-between h-full px-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 border border-white/20 flex items-center justify-center font-bold text-sm text-white shadow-md">
                      TC
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h4 className="text-xs font-bold text-white">Tim Cook</h4>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          Apple Inc.
                        </span>
                      </div>
                      <p className="text-[11px] text-white/60">Incoming FaceTime Audio...</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setView('idle');
                        setIsExpanded(false);
                      }}
                      className="w-9 h-9 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-rose-900/40"
                    >
                      <PhoneOff className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setView('call');
                      }}
                      className="w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-900/40"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* RECORD VIEW */}
              {activeView === 'record' && (
                <div className="flex flex-col justify-between h-full space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                      <span className="text-xs font-bold text-rose-400">Voice Memo</span>
                    </div>
                    <span className="text-sm font-mono font-bold text-white">
                      {formatSeconds(recordSeconds)}
                    </span>
                  </div>

                  {/* Equalizer Visualizer Bars */}
                  <div className="flex items-center justify-center space-x-1 h-8 bg-black/40 rounded-xl px-3 border border-white/10">
                    {[12, 24, 18, 28, 14, 22, 30, 16, 26, 10, 20, 32, 14, 22, 18].map((h, i) => (
                      <motion.span
                        key={i}
                        animate={{
                          height: isRecording ? [h * 0.4, h, h * 0.5] : h * 0.3,
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.6 + (i % 5) * 0.1,
                          ease: 'easeInOut',
                        }}
                        className="w-1 bg-rose-500 rounded-full"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/50">48kHz • 24-bit Lossless</span>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setIsRecording(!isRecording);
                      }}
                      className="px-3 py-0.5 rounded-full bg-rose-600/80 hover:bg-rose-500 text-[10px] font-bold text-white transition-all"
                    >
                      {isRecording ? 'Stop' : 'Resume'}
                    </button>
                  </div>
                </div>
              )}

              {/* AIRDROP VIEW */}
              {activeView === 'airdrop' && (
                <div className="flex flex-col justify-between h-full space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
                        <Share2 className="w-4 h-4 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Anugamya Resume 2026</h4>
                        <p className="text-[10px] text-white/60">From "MacBook Pro M3 Max"</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-blue-400">{airdropProgress}%</span>
                  </div>

                  <div className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-300"
                      style={{ width: `${airdropProgress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-[10px] text-white/50">4.8 MB • PDF Document</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          sounds.playClick();
                          setView('idle');
                          setIsExpanded(false);
                        }}
                        className="px-2.5 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] text-white font-medium"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => {
                          sounds.playClick();
                          setAirdropProgress(100);
                          setAirdropAccepted(true);
                        }}
                        className="px-3 py-0.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-[10px] font-bold text-white shadow-md"
                      >
                        {airdropAccepted ? 'Accepted' : 'Accept'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* BATTERY VIEW */}
              {activeView === 'battery' && (
                <div className="flex items-center justify-between h-full px-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                      <BatteryCharging className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">MagSafe Power</h4>
                      <p className="text-[11px] text-emerald-400 font-semibold">Fast Charging 98%</p>
                      <span className="text-[9px] text-white/50">45W • 12 mins to full</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-mono font-bold text-white">98%</span>
                  </div>
                </div>
              )}

              {/* FACEID VIEW */}
              {activeView === 'faceid' && (
                <div className="flex items-center justify-center flex-col h-full space-y-1.5 py-1">
                  <div className="relative w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
                    {faceIdVerified ? (
                      <Check className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <ScanFace className="w-6 h-6 text-cyan-400 animate-pulse" />
                    )}
                  </div>
                  <div className="text-center">
                    <h4 className="text-xs font-bold text-white">
                      {faceIdVerified ? 'Face ID Verified' : 'Scanning Face...'}
                    </h4>
                    <p className="text-[9px] text-white/60">Anugamya Protected Portfolio</p>
                  </div>
                </div>
              )}

              {/* IDLE EXPANDED VIEW */}
              {activeView === 'idle' && (
                <div className="flex items-center justify-between h-full px-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Anugamya OS Island</h4>
                      <p className="text-[10px] text-white/60">All system services active</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">Connected</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export interface OptionsProps {
  currentView?: IslandView;
  onSelectView: (view: IslandView) => void;
  className?: string;
}

export const Options: React.FC<OptionsProps> = ({
  currentView = 'music',
  onSelectView,
  className = '',
}) => {
  const optionsList: { id: IslandView; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'music', label: 'Music', icon: <Music className="w-3.5 h-3.5" />, color: 'hover:text-emerald-400' },
    { id: 'timer', label: 'Timer', icon: <TimerIcon className="w-3.5 h-3.5" />, color: 'hover:text-amber-400' },
    { id: 'ring', label: 'Call', icon: <Phone className="w-3.5 h-3.5" />, color: 'hover:text-emerald-400' },
    { id: 'record', label: 'Record', icon: <Mic className="w-3.5 h-3.5" />, color: 'hover:text-rose-400' },
    { id: 'airdrop', label: 'AirDrop', icon: <Share2 className="w-3.5 h-3.5" />, color: 'hover:text-blue-400' },
    { id: 'battery', label: 'Battery', icon: <BatteryCharging className="w-3.5 h-3.5" />, color: 'hover:text-emerald-400' },
    { id: 'faceid', label: 'Face ID', icon: <ScanFace className="w-3.5 h-3.5" />, color: 'hover:text-cyan-400' },
    { id: 'idle', label: 'Idle', icon: <CircleDot className="w-3.5 h-3.5" />, color: 'hover:text-slate-300' },
  ];

  return (
    <div
      className={`inline-flex items-center gap-1 p-1 bg-black/80 backdrop-blur-xl border border-white/15 rounded-full shadow-2xl text-xs text-white/70 ${className}`}
    >
      {optionsList.map((opt) => {
        const isActive = currentView === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => {
              sounds.playClick();
              onSelectView(opt.id);
            }}
            title={opt.label}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-white/25 text-white shadow-sm ring-1 ring-white/30 font-semibold'
                : `text-white/60 hover:bg-white/10 ${opt.color}`
            }`}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default function Skiper2Demo() {
  const [view, setView] = useState<IslandView>('music');

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <DynamicIsland view={view} onViewChange={setView} />
      <Options currentView={view} onSelectView={setView} />
    </div>
  );
}
