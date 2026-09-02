'use client';

import React, { useState } from 'react';
import { WebcamPixelGrid } from '@/components/ui/webcam-pixel-grid';
import { RefreshCw, Eye } from 'lucide-react';

export const CameraApp: React.FC = () => {
  const [gridCols, setGridCols] = useState<number>(50);
  const [gridRows, setGridRows] = useState<number>(35);
  const [maxElevation, setMaxElevation] = useState<number>(30);
  const [motionSensitivity, setMotionSensitivity] = useState<number>(0.3);
  const [colorMode, setColorMode] = useState<'webcam' | 'monochrome'>('webcam');
  const [monochromeColor, setMonochromeColor] = useState<string>('#00ff88');
  const [mirror, setMirror] = useState<boolean>(true);
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>('Ready');
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="relative flex flex-col h-full w-full bg-slate-100 text-slate-900 overflow-hidden select-none">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100/90 border-b border-slate-200 backdrop-blur-md z-20">
        <div className="flex items-center space-x-3">
          <img src="/icons/camera.png" alt="Camera" className="w-8 h-8 rounded-lg object-contain shadow-xs" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Camera & Motion Grid
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-cyan-50 border border-cyan-300 text-cyan-800 font-mono font-semibold">
                {isWebcamActive ? 'Live Camera' : 'Motion Matrix'}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">{statusText}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
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

          <button
            onClick={() => setMirror(!mirror)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
              mirror
                ? 'bg-blue-100 border-blue-300 text-blue-800'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {mirror ? 'Mirrored' : 'Normal'}
          </button>

          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            title="Reset Grid"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="relative flex-1 bg-slate-900 overflow-hidden">
        <WebcamPixelGrid
          key={refreshKey}
          gridCols={gridCols}
          gridRows={gridRows}
          maxElevation={maxElevation}
          motionSensitivity={motionSensitivity}
          elevationSmoothing={0.2}
          colorMode={colorMode}
          monochromeColor={monochromeColor}
          backgroundColor="#030712"
          mirror={mirror}
          gapRatio={0.06}
          invertColors={false}
          darken={0.4}
          borderColor="#ffffff"
          borderOpacity={0.08}
          className="w-full h-full"
          onWebcamReady={() => {
            setIsWebcamActive(true);
            setStatusText('Camera active (3D Voxelized)');
          }}
          onWebcamError={() => {
            setIsWebcamActive(false);
            setStatusText('Interactive particle wave mode');
          }}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 border-t border-slate-200 text-xs text-slate-600 font-mono z-20">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Density:</span>
            <input
              type="range"
              min="30"
              max="70"
              value={gridCols}
              onChange={(e) => {
                const cols = parseInt(e.target.value);
                setGridCols(cols);
                setGridRows(Math.round((cols * 35) / 50));
              }}
              className="w-20 h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-[10px] text-slate-700 font-bold">{gridCols}x{gridRows}</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">3D Depth:</span>
            <input
              type="range"
              min="10"
              max="50"
              value={maxElevation}
              onChange={(e) => setMaxElevation(parseInt(e.target.value))}
              className="w-20 h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-[10px] text-slate-700 font-bold">{maxElevation}px</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-500">
          Hardware Accelerated • WebGL 2.0
        </div>
      </div>
    </div>
  );
};

export default CameraApp;
