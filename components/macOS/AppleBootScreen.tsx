'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple } from 'lucide-react';

interface AppleBootScreenProps {
  onComplete?: () => void;
}

export const AppleBootScreen: React.FC<AppleBootScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Realistic macOS boot progress animation intervals
    const timer1 = setTimeout(() => setProgress(15), 200);
    const timer2 = setTimeout(() => setProgress(38), 600);
    const timer3 = setTimeout(() => setProgress(64), 1100);
    const timer4 = setTimeout(() => setProgress(88), 1600);
    const timer5 = setTimeout(() => setProgress(100), 2100);

    const timer6 = setTimeout(() => {
      setIsDone(true);
      if (onComplete) onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center select-none cursor-wait overflow-hidden"
        >
          {/* Apple Metallic Logo */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-14"
          >
            <Apple className="w-20 h-20 fill-white text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]" />
          </motion.div>

          {/* Authentic macOS Boot Progress Bar Container */}
          <div className="w-56 h-1.5 bg-neutral-800 rounded-full overflow-hidden relative p-[1px] shadow-inner border border-white/5">
            <motion.div
              className="h-full bg-slate-100 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.8)]"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>

          {/* System Boot Subtext */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-10 text-[11px] font-mono tracking-widest text-neutral-400 uppercase"
          >
            Anugamya OS v1.0 • macOS Sonoma Kernel
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppleBootScreen;
