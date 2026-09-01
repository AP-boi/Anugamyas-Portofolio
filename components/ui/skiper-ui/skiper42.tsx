'use client';

import React, { useState } from 'react';
import { motion, SVGMotionProps } from 'framer-motion';
import { sounds } from '@/lib/soundEngine';

export interface IconBaseProps extends SVGMotionProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  color?: string;
  isHovered?: boolean;
  active?: boolean;
}

// 1. Animated Search Icon (Lens tilt & pulse)
export const AnimatedSearchIcon: React.FC<IconBaseProps> = ({
  size = 18,
  className = '',
  color = 'currentColor',
  isHovered,
  active,
  ...props
}) => {
  const [hover, setHover] = useState(false);
  const activeHover = isHovered !== undefined ? isHovered : hover;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`select-none ${className}`}
      {...props}
    >
      <motion.circle
        cx="11"
        cy="11"
        r="8"
        animate={activeHover ? { scale: [1, 1.15, 1], rotate: [0, -10, 0] } : { scale: 1, rotate: 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      />
      <motion.line
        x1="21"
        y1="21"
        x2="16.65"
        y2="16.65"
        animate={activeHover ? { x2: 17.5, y2: 17.5, scale: [1, 1.2, 1] } : { x2: 16.65, y2: 16.65, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      />
    </motion.svg>
  );
};

// 2. Animated Bell / Notification Icon (Wiggle ring & clapper)
export const AnimatedBellIcon: React.FC<IconBaseProps> = ({
  size = 18,
  className = '',
  color = 'currentColor',
  isHovered,
  active,
  ...props
}) => {
  const [hover, setHover] = useState(false);
  const activeHover = isHovered !== undefined ? isHovered : hover;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      animate={activeHover ? { rotate: [0, -18, 18, -12, 12, -4, 4, 0] } : { rotate: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      style={{ originX: '50%', originY: '15%' }}
      className={`select-none ${className}`}
      {...props}
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <motion.path
        d="M13.73 21a2 2 0 0 1-3.46 0"
        animate={activeHover ? { x: [-1, 1, -1, 1, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
      />
    </motion.svg>
  );
};

// 3. Animated Sparkles / AI Icon (Spinning ray bursts)
export const AnimatedSparklesIcon: React.FC<IconBaseProps> = ({
  size = 18,
  className = '',
  color = 'currentColor',
  isHovered,
  active,
  ...props
}) => {
  const [hover, setHover] = useState(false);
  const activeHover = isHovered !== undefined ? isHovered : hover;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`select-none ${className}`}
      {...props}
    >
      <motion.path
        d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"
        animate={activeHover ? { scale: [1, 1.25, 0.9, 1.1, 1], rotate: [0, 90, 180, 270, 360] } : { scale: 1, rotate: 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        style={{ originX: '50%', originY: '50%' }}
      />
      <motion.path
        d="M5 3v4"
        animate={activeHover ? { opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, repeat: activeHover ? Infinity : 0 }}
      />
      <motion.path
        d="M19 17v4"
        animate={activeHover ? { opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.15, repeat: activeHover ? Infinity : 0 }}
      />
    </motion.svg>
  );
};

// 4. Animated Wifi Icon (Sequenced radiating waves)
export const AnimatedWifiIcon: React.FC<IconBaseProps> = ({
  size = 18,
  className = '',
  color = 'currentColor',
  isHovered,
  active,
  ...props
}) => {
  const [hover, setHover] = useState(false);
  const activeHover = isHovered !== undefined ? isHovered : hover;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`select-none ${className}`}
      {...props}
    >
      <motion.path
        d="M12 20h.01"
        animate={activeHover ? { scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, repeat: activeHover ? Infinity : 0 }}
      />
      <motion.path
        d="M8.5 16.5a5 5 0 0 1 7 0"
        animate={activeHover ? { opacity: [0.2, 1, 0.2] } : { opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1, repeat: activeHover ? Infinity : 0 }}
      />
      <motion.path
        d="M5 13a10 10 0 0 1 14 0"
        animate={activeHover ? { opacity: [0.2, 1, 0.2] } : { opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, repeat: activeHover ? Infinity : 0 }}
      />
      <motion.path
        d="M2 8.82a15 15 0 0 1 20 0"
        animate={activeHover ? { opacity: [0.2, 1, 0.2] } : { opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, repeat: activeHover ? Infinity : 0 }}
      />
    </motion.svg>
  );
};

// 5. Animated Battery Charging Icon (Lightning bolt pulse & fill)
export const AnimatedBatteryIcon: React.FC<IconBaseProps> = ({
  size = 18,
  className = '',
  color = 'currentColor',
  isHovered,
  active,
  ...props
}) => {
  const [hover, setHover] = useState(false);
  const activeHover = isHovered !== undefined ? isHovered : hover;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`select-none ${className}`}
      {...props}
    >
      <rect width="16" height="10" x="2" y="7" rx="2" ry="2" />
      <line x1="22" x2="22" y1="11" y2="13" />
      <motion.path
        d="m11 9-3 3h4l-1 3"
        animate={activeHover ? { scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, repeat: activeHover ? Infinity : 0 }}
      />
    </motion.svg>
  );
};

// 6. Animated Lock / Security Icon (Shackle unlatches & snaps shut)
export const AnimatedLockIcon: React.FC<IconBaseProps> = ({
  size = 18,
  className = '',
  color = 'currentColor',
  isHovered,
  active,
  ...props
}) => {
  const [hover, setHover] = useState(false);
  const activeHover = isHovered !== undefined ? isHovered : hover;
  const isUnlocked = active !== undefined ? active : activeHover;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`select-none ${className}`}
      {...props}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <motion.path
        d="M7 11V7a5 5 0 0 1 10 0v4"
        animate={isUnlocked ? { y: -3, rotate: 12 } : { y: 0, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 450, damping: 22 }}
        style={{ originX: '25%', originY: '100%' }}
      />
    </motion.svg>
  );
};

// 7. Animated Music Icon (Floating audio notes)
export const AnimatedMusicIcon: React.FC<IconBaseProps> = ({
  size = 18,
  className = '',
  color = 'currentColor',
  isHovered,
  active,
  ...props
}) => {
  const [hover, setHover] = useState(false);
  const activeHover = isHovered !== undefined ? isHovered : hover;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`select-none ${className}`}
      {...props}
    >
      <motion.path
        d="M9 18V5l12-2v13"
        animate={activeHover ? { y: [0, -2, 0] } : { y: 0 }}
        transition={{ duration: 0.4, repeat: activeHover ? Infinity : 0 }}
      />
      <motion.circle
        cx="6"
        cy="18"
        r="3"
        animate={activeHover ? { scale: [1, 1.2, 1] } : { scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1, repeat: activeHover ? Infinity : 0 }}
      />
      <motion.circle
        cx="18"
        cy="16"
        r="3"
        animate={activeHover ? { scale: [1, 1.2, 1] } : { scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2, repeat: activeHover ? Infinity : 0 }}
      />
    </motion.svg>
  );
};

// 8. Animated Settings / Gears Icon (Smooth rotation)
export const AnimatedSettingsIcon: React.FC<IconBaseProps> = ({
  size = 18,
  className = '',
  color = 'currentColor',
  isHovered,
  active,
  ...props
}) => {
  const [hover, setHover] = useState(false);
  const activeHover = isHovered !== undefined ? isHovered : hover;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      animate={activeHover ? { rotate: 180 } : { rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      className={`select-none ${className}`}
      {...props}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </motion.svg>
  );
};

// 9. Animated Heart / Like Icon (Beating pulse)
export const AnimatedHeartIcon: React.FC<IconBaseProps> = ({
  size = 18,
  className = '',
  color = 'currentColor',
  isHovered,
  active,
  ...props
}) => {
  const [hover, setHover] = useState(false);
  const activeHover = isHovered !== undefined ? isHovered : hover;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={active ? color : 'none'}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      animate={activeHover ? { scale: [1, 1.35, 1.15, 1.3, 1] } : { scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      className={`select-none ${className}`}
      {...props}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </motion.svg>
  );
};

// 10. Animated Copy / Check Icon (Sheet slide & checkmark)
export const AnimatedCopyIcon: React.FC<IconBaseProps> = ({
  size = 18,
  className = '',
  color = 'currentColor',
  isHovered,
  active,
  ...props
}) => {
  const [hover, setHover] = useState(false);
  const activeHover = isHovered !== undefined ? isHovered : hover;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`select-none ${className}`}
      {...props}
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <motion.path
        d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
        animate={activeHover ? { x: -2, y: -2 } : { x: 0, y: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      />
    </motion.svg>
  );
};

// 11. Animated Send / Paperplane Icon (Tilts & lifts)
export const AnimatedSendIcon: React.FC<IconBaseProps> = ({
  size = 18,
  className = '',
  color = 'currentColor',
  isHovered,
  active,
  ...props
}) => {
  const [hover, setHover] = useState(false);
  const activeHover = isHovered !== undefined ? isHovered : hover;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      animate={activeHover ? { x: [0, 3, 0], y: [0, -3, 0], rotate: [0, -10, 0] } : { x: 0, y: 0, rotate: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`select-none ${className}`}
      {...props}
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </motion.svg>
  );
};

// Dynamic Animated Icon Registry Mapper
export type AnimatedIconName =
  | 'search'
  | 'bell'
  | 'sparkles'
  | 'wifi'
  | 'battery'
  | 'lock'
  | 'music'
  | 'settings'
  | 'heart'
  | 'copy'
  | 'send';

export interface AnimatedIconProps extends IconBaseProps {
  name: AnimatedIconName;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'search':
      return <AnimatedSearchIcon {...props} />;
    case 'bell':
      return <AnimatedBellIcon {...props} />;
    case 'sparkles':
      return <AnimatedSparklesIcon {...props} />;
    case 'wifi':
      return <AnimatedWifiIcon {...props} />;
    case 'battery':
      return <AnimatedBatteryIcon {...props} />;
    case 'lock':
      return <AnimatedLockIcon {...props} />;
    case 'music':
      return <AnimatedMusicIcon {...props} />;
    case 'settings':
      return <AnimatedSettingsIcon {...props} />;
    case 'heart':
      return <AnimatedHeartIcon {...props} />;
    case 'copy':
      return <AnimatedCopyIcon {...props} />;
    case 'send':
      return <AnimatedSendIcon {...props} />;
    default:
      return <AnimatedSparklesIcon {...props} />;
  }
};

export default function Skiper42Demo() {
  const icons: { name: AnimatedIconName; label: string }[] = [
    { name: 'sparkles', label: 'Sparkles' },
    { name: 'search', label: 'Search' },
    { name: 'bell', label: 'Bell' },
    { name: 'wifi', label: 'Wifi' },
    { name: 'battery', label: 'Battery' },
    { name: 'lock', label: 'Lock' },
    { name: 'music', label: 'Music' },
    { name: 'settings', label: 'Settings' },
    { name: 'heart', label: 'Heart' },
    { name: 'send', label: 'Send' },
    { name: 'copy', label: 'Copy' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[420px] p-8 space-y-8 bg-slate-950 text-white rounded-3xl border border-white/15">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-bold text-white tracking-wide flex items-center justify-center gap-2">
          <AnimatedSparklesIcon size={22} className="text-cyan-400" />
          <span>Skiper UI — Animated Micro-Icons (skiper42)</span>
        </h3>
        <p className="text-xs text-white/60">
          Interactive SVG icons with Framer Motion spring physics and hover micro-animations
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 w-full max-w-lg">
        {icons.map((item) => (
          <motion.div
            key={item.name}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => sounds.playClick()}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/5 hover:bg-white/12 border border-white/10 hover:border-white/25 transition-colors cursor-pointer group space-y-2 shadow-md"
          >
            <AnimatedIcon
              name={item.name}
              size={24}
              className="text-slate-300 group-hover:text-white transition-colors"
            />
            <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-200">
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
