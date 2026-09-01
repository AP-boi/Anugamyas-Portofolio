'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APLogo } from '@/components/ui/APLogo';
import { sounds } from '@/lib/soundEngine';

export interface WordsPreloaderProps {
  words?: string[];
  onComplete?: () => void;
  className?: string;
  duration?: number;
}

const DEFAULT_WORDS = [
  'Hello',
  'Bonjour',
  'Ciao',
  'Olà',
  'やあ',
  'Hallå',
  'Guten Tag',
  'नमस्ते',
  'Welcome',
  'Anugamya OS',
];

export const WordsPreloader: React.FC<WordsPreloaderProps> = ({
  words = DEFAULT_WORDS,
  onComplete,
  className = '',
  duration = 200,
}) => {
  const [index, setIndex] = useState(0);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setDimension({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () => {
      setDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (index === words.length - 1) {
      const exitTimer = setTimeout(() => {
        sounds.playUnlockChime();
        setIsDone(true);
        if (onComplete) onComplete();
      }, 700);
      return () => clearTimeout(exitTimer);
    }

    const interval = setTimeout(() => {
      setIndex((prev) => prev + 1);
    }, index === 0 ? 350 : duration);

    return () => clearTimeout(interval);
  }, [index, words.length, duration, onComplete]);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${
    dimension.width / 2
  } ${dimension.height + 300} 0 ${dimension.height}  L0 0`;

  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${
    dimension.width / 2
  } ${dimension.height} 0 ${dimension.height}  L0 0`;

  const exitCurve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 },
    },
  };

  const slideUp = {
    initial: {
      top: 0,
    },
    exit: {
      top: '-100vh',
      transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1], delay: 0.2 },
    },
  };

  const opacity = {
    initial: {
      opacity: 0,
      y: 15,
    },
    enter: {
      opacity: 0.95,
      y: 0,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {!isDone && dimension.width > 0 && (
        <motion.div
          variants={slideUp}
          initial="initial"
          exit="exit"
          className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#09090b] text-white select-none overflow-hidden cursor-wait ${className}`}
        >
          {/* Center Brand Logo & Word Cycle */}
          <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex items-center justify-center"
            >
              <APLogo className="w-28 h-20" variant="light" glow={true} />
            </motion.div>

            <motion.div
              key={index}
              variants={opacity}
              initial="initial"
              animate="enter"
              className="flex items-center text-2xl md:text-4xl font-semibold tracking-tight text-white/90"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-3.5 inline-block animate-pulse shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
              <span>{words[index]}</span>
            </motion.div>

            {/* Subtle Progress Bar */}
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-4">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-400 rounded-full"
                animate={{ width: `${((index + 1) / words.length) * 100}%` }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* SVG Animated Bezier Curve */}
          <svg className="absolute top-0 left-0 w-full h-[calc(100%+300px)] pointer-events-none fill-[#09090b]">
            <motion.path variants={exitCurve} initial="initial" exit="exit" />
          </svg>

          {/* Bottom System Subtitle */}
          <div className="absolute bottom-10 z-10 text-[11px] font-mono tracking-widest text-neutral-500 uppercase">
            Anugamya OS • Liquid Glass 2026
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const Skiper8 = WordsPreloader;

export default function Skiper8Demo() {
  const [key, setKey] = useState(0);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[460px] p-6 bg-slate-950 text-white rounded-3xl border border-white/15 space-y-6">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-bold text-white tracking-wide">
          Skiper UI — Words Preloader (skiper8)
        </h3>
        <p className="text-xs text-white/60">
          Dennis Snellenberg-inspired multi-language preloader with SVG curve transitions
        </p>
      </div>

      <button
        onClick={() => setKey((k) => k + 1)}
        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shadow-md"
      >
        Replay Preloader
      </button>

      <WordsPreloader key={key} duration={180} />
    </div>
  );
}
