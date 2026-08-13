'use client';

import React, { useState } from 'react';
import Tetris from '@/components/originkit/ui/tetris';
import { Gamepad2, RefreshCw, Sparkles, Play, Pause } from 'lucide-react';

export const TetrisApp: React.FC = () => {
  const [speed, setSpeed] = useState<number>(3);
  const [key, setKey] = useState<number>(0);
  const [palette, setPalette] = useState<'vibrant' | 'neon' | 'pastel'>('vibrant');

  const palettes = {
    vibrant: ['#F9731A', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6', '#F59E0B'],
    neon: ['#00FFCC', '#FF007F', '#7F00FF', '#FFFF00', '#00FF00'],
    pastel: ['#93C5FD', '#FCA5A5', '#FDE047', '#86EFAC', '#C084FC'],
  };

  const handleRestart = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-100 text-slate-900 overflow-hidden select-none">
      {/* App Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-100/90 border-b border-slate-200 backdrop-blur-md z-10">
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-orange-100 border border-orange-300 text-orange-600 shadow-xs">
            <Gamepad2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              Autonomous AI Tetris
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-orange-50 text-orange-700 font-mono font-semibold border border-orange-200">
                LIVE AI
              </span>
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">Dellacherie Self-Playing Engine</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Palette Selector */}
          <button
            onClick={() => {
              const next = palette === 'vibrant' ? 'neon' : palette === 'neon' ? 'pastel' : 'vibrant';
              setPalette(next);
            }}
            className="px-2 py-1 rounded text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs capitalize"
          >
            {palette} Palette
          </button>

          {/* Reset */}
          <button
            onClick={handleRestart}
            className="p-1.5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            title="Restart Game Board"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Game Surface */}
      <div className="relative flex-1 bg-slate-950 p-4 flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-[340px] h-full max-h-[520px] rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
          <Tetris
            key={key}
            boardColor="rgba(15, 23, 42, 0.7)"
            colors={palettes[palette]}
            cellSize={24}
            gap={1.5}
            rounded={12}
            dropSpeed={speed}
            movement={4}
          />
        </div>
      </div>

      {/* Bottom Controls Footer */}
      <div className="px-4 py-2.5 bg-slate-100/90 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700">
        <div className="flex items-center space-x-2 font-mono text-[11px]">
          <span>AI Drop Speed:</span>
          <input
            type="range"
            min="1"
            max="6"
            step="0.5"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-20 accent-orange-600 cursor-pointer"
          />
          <span className="font-bold text-orange-600">{speed}x</span>
        </div>

        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-orange-500" />
          Real-Time Heuristic Matrix
        </div>
      </div>
    </div>
  );
};

export default TetrisApp;
