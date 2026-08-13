'use client';

import React, { useState } from 'react';
import { WebcamPixelGrid } from '@/components/ui/webcam-pixel-grid';
import { Camera, Sliders, RefreshCw, Eye, Sparkles, Monitor, Layers } from 'lucide-react';

export const CameraApp: React.FC = () => {
  const [gridCols, setGridCols] = useState<number>(50);
  const [gridRows, setGridRows] = useState<number>(35);
  const [maxElevation, setMaxElevation] = useState<number>(30);
  const [motionSensitivity, setMotionSensitivity] = useState<number>(0.3);
  const [colorMode, setColorMode] = useState<'webcam' | 'monochrome'>('webcam');
  const [monochromeColor, setMonochromeColor] = useState<string>('#00ff88');
  const [mirror, setMirror] = useState<boolean>(true);
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>('Initializing Camera / Wave Fallback...');
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="relative flex flex-col h-full w-full bg-slate-100 text-slate-900 overflow-hidden select-none">
      {/* Top Header Controls Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100/90 border-b border-slate-200 backdrop-blur-md z-20">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-100 border border-cyan-300 text-cyan-700">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Camera & Motion Grid
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-cyan-50 border border-cyan-300 text-cyan-800 font-mono font-semibold">
                <Sparkles className="w-3 h-3 text-cyan-600" />
                {isWebcamActive ? 'LIVE WEBCAM' : 'INTERACTIVE WAVE FALLBACK'}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">{statusText}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Color Mode Switcher */}
          <button
            onClick={() => setColorMode(colorMode === 'webcam' ? 'monochrome' : 'webcam')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              colorMode === 'monochrome'
                ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            {colorMode === 'webcam' ? 'Webcam Colors' : 'Matrix Green'}
          </button>

          {/* Mirror Toggle */}
          <button
            onClick={() => setMirror(!mirror)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
              mirror
                ? 'bg-blue-100 border-blue-300 text-blue-800 font-semibold'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Mirror: {mirror ? 'ON' : 'OFF'}
          </button>

          {/* Refresh / Retry */}
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
            title="Reload Camera Stream"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 3D Grid Canvas Display */}
      <div className="relative flex-1 bg-slate-900 overflow-hidden">
        <WebcamPixelGrid
          key={refreshKey}
          gridCols={gridCols}
          gridRows={gridRows}
          maxElevation={maxElevation}
          motionSensitivity={motionSensitivity}
          colorMode={colorMode}
          monochromeColor={monochromeColor}
          backgroundColor="#0f172a"
          mirror={mirror}
          gapRatio={0.06}
          invertColors={false}
          darken={0.3}
          borderColor="#ffffff"
          borderOpacity={0.1}
          className="w-full h-full"
          onWebcamReady={() => {
            setIsWebcamActive(true);
            setStatusText('Webcam feed connected • 3D Motion Matrix Active');
          }}
          onWebcamError={(err) => {
            setIsWebcamActive(false);
            setStatusText('Camera access restricted • Mouse-Interactive Wave Active');
          }}
        />

        {/* Ambient Overlay Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent via-transparent to-slate-950/60" />
      </div>

      {/* Bottom Parameter Adjuster Drawer */}
      <div className="px-4 py-3 bg-slate-100/90 border-t border-slate-200 backdrop-blur-lg flex items-center justify-between text-xs text-slate-800 gap-6 z-20 font-medium">
        <div className="flex items-center space-x-6">
          {/* Max Elevation */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-600 font-mono text-[11px]">3D Height:</span>
            <input
              type="range"
              min="10"
              max="60"
              value={maxElevation}
              onChange={(e) => setMaxElevation(Number(e.target.value))}
              className="w-24 accent-cyan-600 cursor-pointer"
            />
            <span className="font-mono text-cyan-700 font-bold w-6">{maxElevation}</span>
          </div>

          {/* Grid Resolution */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-600 font-mono text-[11px]">Density:</span>
            <input
              type="range"
              min="30"
              max="80"
              value={gridCols}
              onChange={(e) => {
                const cols = Number(e.target.value);
                setGridCols(cols);
                setGridRows(Math.round(cols * 0.7));
              }}
              className="w-24 accent-cyan-600 cursor-pointer"
            />
            <span className="font-mono text-cyan-700 font-bold w-8">{gridCols}x{gridRows}</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-600" />
          Move mouse over canvas or face camera to elevate 3D voxel grid.
        </div>
      </div>
    </div>
  );
};

export default CameraApp;
