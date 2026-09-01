'use client';

import React, { useState } from 'react';
import { SmoothInput, Input } from '@/components/ui/skiper-ui/skiper106';

export default function SmoothInputDemo() {
  const [textVal, setTextVal] = useState('Anugamya Portfolio');
  const [passVal, setPassVal] = useState('macOS2026');

  return (
    <div className="flex flex-col items-center justify-center min-h-[380px] p-8 space-y-8 bg-slate-950/85 backdrop-blur-2xl rounded-3xl border border-white/15 shadow-2xl text-white">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-bold text-white tracking-wide">
          Skiper UI — Smooth Caret Input (skiper106)
        </h3>
        <p className="text-xs text-white/60">
          Canvas-measured spring physics animated caret with password support
        </p>
      </div>

      <div className="w-full max-w-md space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-400">Smooth Text Input</label>
          <SmoothInput
            value={textVal}
            onChange={(e) => setTextVal(e.target.value)}
            placeholder="Type anywhere..."
            wrapperClassName="bg-white/10 border border-white/20 text-white rounded-2xl p-3.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/30"
            className="text-base text-white placeholder:text-white/40"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-400">Smooth Password Input</label>
          <SmoothInput
            type="password"
            value={passVal}
            onChange={(e) => setPassVal(e.target.value)}
            placeholder="Enter password..."
            wrapperClassName="bg-white/10 border border-white/20 text-white rounded-2xl p-3.5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/30"
            className="text-base text-white placeholder:text-white/40"
          />
        </div>
      </div>
    </div>
  );
}
