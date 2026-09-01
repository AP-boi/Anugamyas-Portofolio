'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Bot } from 'lucide-react';
import { sounds } from '@/lib/soundEngine';

export type GlowIntensity = 'sm' | 'md' | 'lg' | 'xl';

export interface AppleBorderGradientProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  preview?: boolean;
  isActive?: boolean;
  intensity?: GlowIntensity;
  speed?: number; // duration in seconds for full rotation
  borderRadius?: number | string;
  borderWidth?: number;
  fullscreen?: boolean;
  sound?: boolean;
}

const intensityMap: Record<GlowIntensity, { blur: string; spread: string; opacity: number }> = {
  sm: { blur: 'blur-xs', spread: 'p-[1.5px]', opacity: 0.75 },
  md: { blur: 'blur-sm', spread: 'p-[2px]', opacity: 0.85 },
  lg: { blur: 'blur-md', spread: 'p-[3px]', opacity: 0.95 },
  xl: { blur: 'blur-lg', spread: 'p-[4px]', opacity: 1.0 },
};

export const AppleBorderGradient: React.FC<AppleBorderGradientProps> = ({
  children,
  className = '',
  containerClassName = '',
  preview = true,
  isActive = true,
  intensity = 'lg',
  speed = 4,
  borderRadius = '1.25rem',
  borderWidth = 2,
  fullscreen = false,
  sound = false,
}) => {
  const active = preview && isActive;
  const config = intensityMap[intensity] || intensityMap.lg;

  useEffect(() => {
    if (active && sound) {
      sounds.playUnlockChime();
    }
  }, [active, sound]);

  if (fullscreen) {
    return (
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: config.opacity }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden"
          >
            {/* Screen edge rotating conic gradient */}
            <div
              className="absolute -inset-[20px] opacity-90 animate-spin"
              style={{
                animationDuration: `${speed}s`,
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
                background:
                  'conic-gradient(from 0deg at 50% 50%, #ff2d55, #af52de, #5856d6, #007aff, #5ac8fa, #34c759, #ff9500, #ff2d55)',
              }}
            />
            {/* Mask inner viewport to only display iridescent perimeter edge */}
            <div
              className="absolute inset-[3px] rounded-3xl bg-transparent"
              style={{
                boxShadow:
                  'inset 0 0 40px rgba(175,82,222,0.45), inset 0 0 80px rgba(0,122,255,0.3)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div
      className={`relative group ${containerClassName}`}
      style={{ borderRadius }}
    >
      <AnimatePresence>
        {active && (
          <>
            {/* Ambient Outer Glow Layer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: config.opacity, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className={`absolute -inset-[2px] pointer-events-none ${config.blur} -z-10`}
              style={{ borderRadius }}
            >
              <div
                className="w-full h-full animate-spin"
                style={{
                  animationDuration: `${speed}s`,
                  animationTimingFunction: 'linear',
                  animationIterationCount: 'infinite',
                  borderRadius,
                  background:
                    'conic-gradient(from 0deg, #ff2d55, #af52de, #5856d6, #007aff, #5ac8fa, #34c759, #ff9500, #ff2d55)',
                }}
              />
            </motion.div>

            {/* Crisp Border Edge Layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 pointer-events-none overflow-hidden -z-10"
              style={{ borderRadius, padding: `${borderWidth}px` }}
            >
              <div
                className="w-full h-full animate-spin"
                style={{
                  animationDuration: `${speed}s`,
                  animationTimingFunction: 'linear',
                  animationIterationCount: 'infinite',
                  background:
                    'conic-gradient(from 0deg, #ff2d55, #af52de, #5856d6, #007aff, #5ac8fa, #34c759, #ff9500, #ff2d55)',
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Content Container */}
      <div
        className={`relative z-10 w-full h-full ${className}`}
        style={{ borderRadius }}
      >
        {children}
      </div>
    </div>
  );
};

export const AppleIntelligenceGlow: React.FC<{
  size?: number;
  className?: string;
  spinning?: boolean;
}> = ({ size = 36, className = '', spinning = true }) => {
  return (
    <div
      className={`relative flex items-center justify-center rounded-full p-[2px] overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.5)] ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className={`absolute inset-0 ${spinning ? 'animate-spin' : ''}`}
        style={{
          animationDuration: '3s',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          background:
            'conic-gradient(from 0deg, #ff2d55, #af52de, #5856d6, #007aff, #5ac8fa, #34c759, #ff9500, #ff2d55)',
        }}
      />
      <div className="relative z-10 w-full h-full rounded-full bg-slate-950/90 flex items-center justify-center">
        <Sparkles className="w-1/2 h-1/2 text-cyan-300 animate-pulse" />
      </div>
    </div>
  );
};

export default function Skiper86Demo() {
  const [isActive, setIsActive] = useState(true);
  const [intensity, setIntensity] = useState<GlowIntensity>('xl');
  const [fullscreenMode, setFullscreenMode] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[420px] p-8 space-y-8 bg-slate-950 text-white rounded-3xl border border-white/15">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-bold text-white tracking-wide flex items-center justify-center gap-2">
          <AppleIntelligenceGlow size={26} />
          <span>Skiper UI — Apple Intelligence Animation (skiper86)</span>
        </h3>
        <p className="text-xs text-white/60">
          Iridescent Apple Intelligence chromatic border gradient & screen glow
        </p>
      </div>

      <AppleBorderGradient
        preview={isActive}
        intensity={intensity}
        speed={3.5}
        borderRadius="1.5rem"
        className="p-6 bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/10 text-center max-w-sm space-y-3"
      >
        <div className="w-12 h-12 mx-auto rounded-2xl bg-fuchsia-500/20 border border-fuchsia-400/40 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-fuchsia-400" />
        </div>
        <h4 className="font-bold text-sm text-white">Apple Intelligence Active</h4>
        <p className="text-xs text-white/70">
          Chromatic rotating gradient with customizable luminescence intensity and smooth fade transitions.
        </p>
      </AppleBorderGradient>

      {/* Screen Edge Demo Overlay */}
      {fullscreenMode && (
        <AppleBorderGradient preview={true} fullscreen={true} intensity="xl" />
      )}

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => {
            sounds.playClick();
            setIsActive(!isActive);
          }}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-md ${
            isActive ? 'bg-fuchsia-600 text-white' : 'bg-white/10 text-white/60'
          }`}
        >
          {isActive ? 'Glowing: Active' : 'Glowing: Off'}
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setFullscreenMode(!fullscreenMode);
          }}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-md ${
            fullscreenMode
              ? 'bg-cyan-600 text-white ring-2 ring-cyan-400'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          {fullscreenMode ? 'Exit Screen Edge Glow' : 'Toggle Fullscreen Edge Glow'}
        </button>

        {(['sm', 'md', 'lg', 'xl'] as GlowIntensity[]).map((int) => (
          <button
            key={int}
            onClick={() => {
              sounds.playClick();
              setIntensity(int);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
              intensity === int ? 'bg-white text-black font-bold' : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            {int.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
