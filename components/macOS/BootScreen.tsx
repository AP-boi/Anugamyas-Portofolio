'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APLogo } from '@/components/ui/APLogo';

interface BootScreenProps {
  onComplete?: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setProgress(18), 180),
      setTimeout(() => setProgress(45), 600),
      setTimeout(() => setProgress(72), 1100),
      setTimeout(() => setProgress(94), 1600),
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
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-14 flex items-center justify-center"
          >
            <APLogo className="w-36 h-24" variant="light" glow={true} />
          </motion.div>

          <div className="w-56 h-1.5 bg-neutral-800 rounded-full overflow-hidden relative p-[1px] border border-white/10 shadow-inner">
            <motion.div
              className="h-full bg-slate-100 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.85)]"
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

export default BootScreen;

