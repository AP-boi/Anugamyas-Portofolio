'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APLogo } from '@/components/ui/APLogo';
import { sounds } from '@/lib/soundEngine';

interface Skiper8Props {
  onComplete?: () => void;
  words?: string[];
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
];

const opacityVariant = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: [0.33, 1, 0.68, 1] },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.22, ease: [0.33, 1, 0.68, 1] },
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

export const Skiper8: React.FC<Skiper8Props> = ({
  onComplete,
  words = DEFAULT_WORDS,
}) => {
  const [index, setIndex] = useState(0);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });

    const handleResize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (index === words.length - 1) {
      const exitTimer = setTimeout(() => {
        setIsDone(true);
        if (onComplete) onComplete();
      }, 700);
      return () => clearTimeout(exitTimer);
    }

    const timer = setTimeout(
      () => {
        setIndex((prev) => prev + 1);
      },
      index === 0 ? 320 : 190
    );

    return () => clearTimeout(timer);
  }, [index, words.length, onComplete]);

  // Initial SVG curve paths for theatrical curtain reveal
  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`;

  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {!isDone && (
        <motion.div
          variants={slideUp}
          initial="initial"
          exit="exit"
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-slate-950 text-white select-none cursor-wait overflow-hidden"
        >
          {dimension.width > 0 && (
            <>
              {/* Subtle Ambient Radial Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.12),transparent_70%)] pointer-events-none" />

              {/* Top Watermark */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute top-10 flex items-center space-x-2 text-slate-400 font-mono text-xs tracking-widest uppercase"
              >
                <APLogo className="w-5 h-4" variant="light" />
                <span>Anugamya OS</span>
              </motion.div>

              {/* Main Animated Word Display */}
              <div className="relative flex items-center justify-center z-10">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={words[index]}
                    variants={opacityVariant}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-white font-sans"
                  >
                    {words[index]}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Bottom Progress Counter */}
              <div className="absolute bottom-10 flex flex-col items-center space-y-2">
                <div className="w-36 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${Math.round(((index + 1) / words.length) * 100)}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  {Math.round(((index + 1) / words.length) * 100)}%
                </span>
              </div>

              {/* SVG Curtain Curve */}
              <svg className="absolute top-0 w-full h-[calc(100%+300px)] pointer-events-none fill-slate-950">
                <motion.path
                  variants={curve}
                  initial="initial"
                  exit="exit"
                />
              </svg>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Skiper8;
