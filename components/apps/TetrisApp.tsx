'use client';

import React, { useState } from 'react';
import Tetris from '@/components/originkit/ui/tetris';
import { RefreshCw } from 'lucide-react';

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
    <div className="flex flex-col h-full w-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden select-none transition-colors">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md z-10">
        <div className="flex items-center space-x-2.5">
          <img src="/icons/games.png" alt="Game Center" className="w-7 h-7 rounded-lg object-contain shadow-xs" />
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              Autonomous AI Tetris
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 font-mono font-semibold border border-orange-200 dark:border-orange-800">
                LIVE
              </span>
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Self-Playing Heuristic Engine</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              const next = palette === 'vibrant' ? 'neon' : palette === 'neon' ? 'pastel' : 'vibrant';
              setPalette(next);
            }}
            className="px-2 py-1 rounded text-[11px] font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs capitalize"
          >
            {palette}
          </button>

          <button
            onClick={handleRestart}
            className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs"
            title="Restart Game"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="relative flex-1 bg-slate-900 flex items-center justify-center p-2 overflow-hidden">
        <Tetris
          key={key}
          boardWidth={10}
          boardHeight={20}
          colors={palettes[palette]}
          speed={speed}
          className="w-full max-w-[280px] h-full object-contain"
        />
      </div>

      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-mono z-10">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Speed:</span>
          <input
            type="range"
            min="1"
            max="6"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-20 h-1 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-600"
          />
          <span className="text-[10px] text-slate-700 dark:text-slate-300 font-bold">{speed}x</span>
        </div>

        <div className="text-[10px] text-slate-500 dark:text-slate-400">
          Dellacherie Heuristic
        </div>
      </div>
    </div>
  );
};

export default TetrisApp;
