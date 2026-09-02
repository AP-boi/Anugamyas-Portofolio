'use client';

import React from 'react';
import { Skiper8 } from '@/components/ui/skiper8';

interface BootScreenProps {
  onComplete?: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  return <Skiper8 onComplete={onComplete} />;
};

export default BootScreen;

