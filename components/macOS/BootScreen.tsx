'use client';

import React from 'react';
import { WordsPreloader } from '@/components/v1/skiper8';

interface BootScreenProps {
  onComplete?: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  return (
    <WordsPreloader
      words={[
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
      ]}
      duration={190}
      onComplete={onComplete}
    />
  );
};

export default BootScreen;
