'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PLAYLIST, Track } from '@/components/macOS/DynamicIsland';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Music,
  ListMusic,
  Radio,
  Sparkles,
  Heart,
  Share2,
} from 'lucide-react';
import { sounds } from '@/lib/soundEngine';

export const MusicApp: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(38);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({ 't-1': true });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentTrack = PLAYLIST[currentTrackIndex];

  // Visualizer Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 48;
      const barWidth = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        const heightMultiplier = isPlaying
          ? Math.sin(phase + i * 0.25) * 0.4 + Math.cos(phase * 0.7 + i * 0.15) * 0.3 + 0.35
          : 0.08;
        const barHeight = Math.max(4, heightMultiplier * canvas.height * 0.85);
        const x = i * barWidth;
        const y = (canvas.height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, '#38bdf8');
        gradient.addColorStop(0.5, '#a855f7');
        gradient.addColorStop(1, '#ec4899');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x + 1.5, y, barWidth - 3, barHeight, 4);
        ctx.fill();
      }

      if (isPlaying) {
        phase += 0.08;
      }
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Timer ticker
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentTime((prev) => (prev >= currentTrack.duration ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, currentTrack.duration]);

  const togglePlay = () => {
    sounds.playClick();
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    sounds.playClick();
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setCurrentTime(0);
  };

  const prevTrack = () => {
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
    <div className="flex flex-col h-full w-full bg-slate-950 text-white select-none overflow-hidden">
      {/* Top Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar Menu */}
        <div className="w-full md:w-52 bg-slate-900/90 border-r border-white/10 p-3 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 px-1">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-md">
                <Music className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-bold text-white tracking-wide">Apple Music</span>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase text-slate-400 font-semibold px-2">Library</span>
              <button className="w-full text-left px-2.5 py-1.5 rounded-lg bg-rose-600/20 text-rose-300 font-semibold text-xs flex items-center space-x-2 border border-rose-500/30">
                <Radio className="w-3.5 h-3.5 text-rose-400" />
                <span>Now Playing</span>
              </button>
              <button className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-300 hover:bg-white/10 text-xs flex items-center space-x-2 transition-colors">
                <ListMusic className="w-3.5 h-3.5 text-slate-400" />
                <span>Coding Playlist</span>
              </button>
              <button className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-300 hover:bg-white/10 text-xs flex items-center space-x-2 transition-colors">
                <Heart className="w-3.5 h-3.5 text-slate-400" />
                <span>Favorites</span>
              </button>
            </div>
          </div>

          {/* Mini Status Card */}
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] space-y-1 text-slate-300">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Lossless Spatial Audio</span>
            </div>
            <p className="text-slate-400 text-[9px]">48kHz / 24-bit WebGL Stream</p>
          </div>
        </div>

        {/* Right Main Player & Playlist Canvas */}
        <div className="flex-1 flex flex-col p-5 overflow-y-auto space-y-5 bg-gradient-to-b from-slate-900 to-slate-950">
          {/* Featured Album Hero */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5">
            {/* Album Cover Art */}
            <div
              className={`w-36 h-36 rounded-2xl bg-gradient-to-br ${currentTrack.coverColor} flex items-center justify-center shadow-2xl border border-white/20 flex-shrink-0 relative overflow-hidden group`}
            >
              <Music className="w-14 h-14 text-white/80" />
              <button
                onClick={togglePlay}
                className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
              >
                <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </div>
              </button>
            </div>

            {/* Track Info & Actions */}
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase font-semibold">
                Lofi Coding Beats
              </span>
              <h2 className="text-xl font-bold text-white leading-tight">{currentTrack.title}</h2>
              <p className="text-xs text-slate-300 font-medium">{currentTrack.artist}</p>
              <p className="text-[11px] text-slate-400 font-mono">{currentTrack.album} • 2026</p>

              <div className="flex items-center justify-center sm:justify-start space-x-2 pt-2">
                <button
                  onClick={() => setIsLiked((prev) => ({ ...prev, [currentTrack.id]: !prev[currentTrack.id] }))}
                  className={`p-2 rounded-xl border transition-colors ${
                    isLiked[currentTrack.id]
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                      : 'bg-white/10 border-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked[currentTrack.id] ? 'fill-current' : ''}`} />
                </button>
                <button className="p-2 rounded-xl bg-white/10 border border-white/10 text-slate-300 hover:bg-white/20 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Real-Time Audio Frequency Waveform Visualizer Canvas */}
          <div className="w-full h-16 bg-black/40 rounded-2xl border border-white/10 p-2 overflow-hidden shadow-inner flex items-center justify-center">
            <canvas ref={canvasRef} width={500} height={60} className="w-full h-full" />
          </div>

          {/* Tracks Queue Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">Track Queue</h4>
            <div className="divide-y divide-white/5 rounded-xl bg-white/5 border border-white/10 overflow-hidden">
              {PLAYLIST.map((track, idx) => {
                const isCurrent = idx === currentTrackIndex;
                return (
                  <div
                    key={track.id}
                    onClick={() => {
                      sounds.playClick();
                      setCurrentTrackIndex(idx);
                      setCurrentTime(0);
                      setIsPlaying(true);
                    }}
                    className={`flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors ${
                      isCurrent ? 'bg-white/15 text-white font-semibold' : 'hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-mono text-slate-400 w-4">{idx + 1}</span>
                      <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${track.coverColor} flex-shrink-0`} />
                      <div>
                        <div className="text-xs font-bold text-white">{track.title}</div>
                        <p className="text-[10px] text-slate-400">{track.artist}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {isCurrent && isPlaying && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          PLAYING
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-slate-400">{formatSeconds(track.duration)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Player Controls Bar */}
      <div className="h-18 bg-slate-900 border-t border-white/10 px-5 flex items-center justify-between">
        {/* Track Title */}
        <div className="flex items-center space-x-3 w-1/4 truncate">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${currentTrack.coverColor} flex-shrink-0`} />
          <div className="truncate">
            <h5 className="text-xs font-bold text-white truncate">{currentTrack.title}</h5>
            <p className="text-[10px] text-slate-400 truncate">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Center Controls & Scrubber */}
        <div className="flex-1 max-w-md flex flex-col items-center space-y-1">
          <div className="flex items-center space-x-4">
            <button onClick={prevTrack} className="text-slate-400 hover:text-white transition-colors">
              <SkipBack className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            <button onClick={nextTrack} className="text-slate-400 hover:text-white transition-colors">
              <SkipForward className="w-4 h-4 fill-current" />
            </button>
          </div>

          <div className="w-full flex items-center space-x-2 text-[10px] font-mono text-slate-400">
            <span>{formatSeconds(currentTime)}</span>
            <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-200"
                style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
              />
            </div>
            <span>{formatSeconds(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Volume & Audio Mode */}
        <div className="w-1/4 flex items-center justify-end space-x-2 text-slate-400">
          <button onClick={() => setIsMuted(!isMuted)} className="hover:text-white transition-colors">
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseInt(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicApp;
