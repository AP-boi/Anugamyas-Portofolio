'use client';

import { useEffect } from 'react';
import { useOSStore } from '@/store/useOSStore';

interface KeyboardShortcutOptions {
  onToggleSpotlight?: () => void;
}

export function useKeyboardShortcuts(options: KeyboardShortcutOptions = {}) {
  const { openWindow, lockScreen } = useOSStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      // Spotlight Search: Cmd+Space or Ctrl+Space
      if (isCmdOrCtrl && e.code === 'Space') {
        e.preventDefault();
        if (options.onToggleSpotlight) {
          options.onToggleSpotlight();
        }
        return;
      }

      // Terminal: Cmd+K / Ctrl+K
      if (isCmdOrCtrl && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openWindow('terminal');
        return;
      }

      // Lock Screen: Cmd+L / Ctrl+L
      if (isCmdOrCtrl && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        lockScreen();
        return;
      }

      // App shortcuts: Cmd+1 (Projects), Cmd+2 (Analytics), Cmd+3 (GitHub), Cmd+4 (Notes)
      if (isCmdOrCtrl && e.key === '1') {
        e.preventDefault();
        openWindow('projects');
      } else if (isCmdOrCtrl && e.key === '2') {
        e.preventDefault();
        openWindow('analytics');
      } else if (isCmdOrCtrl && e.key === '3') {
        e.preventDefault();
        openWindow('github');
      } else if (isCmdOrCtrl && e.key === '4') {
        e.preventDefault();
        openWindow('achievements');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openWindow, lockScreen, options]);
}
