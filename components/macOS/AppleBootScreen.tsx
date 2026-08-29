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
    const timers = [
      setTimeout(() => setProgress(15), 180),
      setTimeout(() => setProgress(42), 600),
      setTimeout(() => setProgress(70), 1100),
      setTimeout(() => setProgress(92), 1600),
      setTimeout(() => setProgress(100), 2000),
      setTimeout(() => {
        setIsDone(true);
        if (onComplete) onComplete();
      }, 2400),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center select-none cursor-wait overflow-hidden"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-14"
          >
            <Apple className="w-20 h-20 fill-white text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.35)]" />
          </motion.div>

          <div className="w-56 h-1.5 bg-neutral-800 rounded-full overflow-hidden relative p-[1px] border border-white/10 shadow-inner">
            <motion.div
              className="h-full bg-slate-100 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.75)]"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
            />
          </div>

          <div className="absolute bottom-10 text-[11px] font-mono tracking-widest text-neutral-500 uppercase">
            Anugamya OS
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppleBootScreen;
