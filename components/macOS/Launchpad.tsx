'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore, APP_REGISTRY } from '@/store/useOSStore';
import { AppId } from '@/types/os';
import { Search } from 'lucide-react';
import { sounds } from '@/lib/soundEngine';
import { MAC_OVERLAY_SPRING, staggerContainer, staggerItem } from '@/lib/animations';

interface LaunchpadProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Launchpad: React.FC<LaunchpadProps> = ({ isOpen, onClose }) => {
  const { openWindow } = useOSStore();
  const [search, setSearch] = useState('');

  const appList = Object.keys(APP_REGISTRY).map((key) => APP_REGISTRY[key as AppId]);

  const filteredApps = appList.filter(
    (app) =>
      app.title.toLowerCase().includes(search.toLowerCase()) ||
      app.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleLaunch = (appId: AppId) => {
    sounds.playWindowOpen();
    openWindow(appId);
    onClose();
  };

  return (
    // AnimatePresence must stay mounted so exit animations actually play
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="launchpad-overlay"
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(36px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          onClick={onClose}
          className="fixed inset-0 z-[99990] bg-black/60 flex flex-col items-center justify-between p-10 select-none"
        >
          {/* Search Bar — drops in with a spring */}
          <motion.div
            initial={{ opacity: 0, y: -18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97, transition: { duration: 0.15 } }}
            transition={{ ...MAC_OVERLAY_SPRING, delay: 0.05 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-md shadow-2xl mt-4"
          >
            <Search className="w-4 h-4 text-white/60" />
            <input
              type="text"
              placeholder="Search Applications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className="bg-transparent border-none outline-none text-sm text-white placeholder-white/50 w-full"
            />
          </motion.div>

          {/* Apps Grid — staggered zoom-out reveal, like real Launchpad */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-8 max-w-4xl w-full my-auto"
          >
            <AnimatePresence mode="popLayout">
              {filteredApps.map((app, index) => (
                <motion.div
                  key={app.id}
                  variants={staggerItem(22)}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  transition={{ ...MAC_OVERLAY_SPRING, delay: index * 0.025 }}
                  whileHover={{ scale: 1.12, y: -4 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handleLaunch(app.id)}
                  className="flex flex-col items-center space-y-2 cursor-pointer group"
                >
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-white/10 p-2 border border-white/15 flex items-center justify-center shadow-xl group-hover:bg-white/20 transition-colors duration-200 backdrop-blur-md">
                    {app.iconSrc ? (
                      <img
                        src={app.iconSrc}
                        alt={app.title}
                        className="w-full h-full object-contain drop-shadow-md pointer-events-none"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold">
                        {app.title.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-white/90 group-hover:text-white drop-shadow-md text-center line-clamp-1 max-w-[100px]">
                    {app.title.split('—')[0].trim()}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Bottom indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ delay: 0.25 }}
            className="flex items-center space-x-1.5 pb-4"
          >
            <span className="w-2 h-2 rounded-full bg-white" />
            <span className="w-2 h-2 rounded-full bg-white/30" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Launchpad;