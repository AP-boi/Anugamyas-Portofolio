'use client';

import React, { useState } from 'react';
import { DynamicIsland, Options, IslandView } from '@/components/v1/skiper2';

export default function DynamicIslandDemo() {
  const [view, setView] = useState<IslandView>('music');

  return (
    <div className="flex flex-col items-center justify-center min-h-[360px] p-8 space-y-12 bg-slate-950/80 backdrop-blur-xl rounded-3xl border border-white/15 shadow-2xl">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-bold text-white tracking-wide">Skiper UI — Dynamic Island (skiper2)</h3>
        <p className="text-xs text-white/60">Interactive multi-state Dynamic Island with Framer Motion spring physics</p>
      </div>

      <div className="min-h-[180px] flex items-center justify-center">
        <DynamicIsland view={view} onViewChange={setView} />
      </div>

      <Options currentView={view} onSelectView={setView} />
    </div>
  );
}
