import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// 1. Apple Safari Compass Icon
export const SafariCompassIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="safariBg" x1="32" y1="2" x2="32" y2="62" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1EA7FD" />
        <stop offset="100%" stopColor="#0B56CF" />
      </linearGradient>
      <linearGradient id="needleRed" x1="32" y1="8" x2="48" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FF3B30" />
        <stop offset="100%" stopColor="#D70015" />
      </linearGradient>
      <linearGradient id="needleWhite" x1="16" y1="32" x2="32" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E5E5EA" />
      </linearGradient>
    </defs>
    {/* Base Circle with subtle border */}
    <circle cx="32" cy="32" r="30" fill="url(#safariBg)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
    
    {/* Compass Dial Ticks */}
    <g stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" strokeLinecap="round">
      <line x1="32" y1="5" x2="32" y2="9" />
      <line x1="32" y1="55" x2="32" y2="59" />
      <line x1="5" y1="32" x2="9" y2="32" />
      <line x1="55" y1="32" x2="59" y2="32" />
      <line x1="13" y1="13" x2="16" y2="16" />
      <line x1="48" y1="48" x2="51" y2="51" />
      <line x1="51" y1="13" x2="48" y2="16" />
      <line x1="16" y1="48" x2="13" y2="51" />
    </g>
    
    {/* North Pointer (Red) */}
    <polygon points="32,8 37.5,32 32,32" fill="url(#needleRed)" />
    <polygon points="32,8 26.5,32 32,32" fill="#FF453A" />
    
    {/* South Pointer (White) */}
    <polygon points="32,56 26.5,32 32,32" fill="url(#needleWhite)" />
    <polygon points="32,56 37.5,32 32,32" fill="#D1D1D6" />
    
    {/* Center Pivot Pin */}
    <circle cx="32" cy="32" r="2.5" fill="#FFFFFF" stroke="#0B56CF" strokeWidth="1" />
  </svg>
);

// 2. Official DuckDuckGo Vector Icon
export const DuckDuckGoLogo: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Background Circle */}
    <circle cx="32" cy="32" r="30" fill="#DE5833" />
    
    {/* Duck Head & Neck (White) */}
    <path
      d="M32 10C24 10 19 16 19 22C19 26 21 29 23 31L23 38C23 44 26 50 32 50C38 50 41 44 41 38L41 31C43 29 45 26 45 22C45 16 40 10 32 10Z"
      fill="#FFFFFF"
    />
    
    {/* Duck Bill / Beak (Orange) */}
    <path
      d="M26 23C26 23 20 23 15 25C13.5 25.6 13 27.5 14.5 28.5C18 31 24 30.5 26 30.5"
      fill="#F9A01B"
    />
    
    {/* Eye */}
    <circle cx="28" cy="20" r="2.5" fill="#333333" />
    <circle cx="27.2" cy="19.2" r="0.8" fill="#FFFFFF" />
    
    {/* Bow Tie (Green) */}
    <g fill="#43A047">
      <polygon points="27,45 32,47.5 27,50" />
      <polygon points="37,45 32,47.5 37,50" />
      <circle cx="32" cy="47.5" r="2" fill="#2E7D32" />
    </g>
  </svg>
);

// 3. Official GitHub Octocat Vector Logo
export const GitHubLogo: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
    />
  </svg>
);

// 4. Wikipedia Official Stylized "W" Logo
export const WikipediaLogo: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect width="64" height="64" rx="14" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="2" />
    <path
      d="M13 18H20.5L26 38.5L31.5 20.5H35L40.5 38.5L46 18H53L43 46H38L33.2 29.5L28.5 46H23.5L13 18Z"
      fill="#111827"
    />
  </svg>
);

// 5. Hacker News Official Logo
export const HackerNewsLogo: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect width="64" height="64" rx="14" fill="#FF6600" />
    <polygon points="19,16 29,35 29,48 35,48 35,35 45,16 38.5,16 32,30 25.5,16" fill="#FFFFFF" />
  </svg>
);

// 6. Bharat Dekho Indian Heritage Emblem
export const BharatDekhoLogo: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="bdGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FF9933" />
        <stop offset="100%" stopColor="#138808" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="14" fill="url(#bdGrad)" />
    {/* Architectural Dome & Arches */}
    <path
      d="M32 14C27 19 24 24 24 30H40C40 24 37 19 32 14Z"
      fill="#FFFFFF"
    />
    <path
      d="M18 32H46V48H18V32ZM28 48V38C28 35.8 29.8 34 32 34C34.2 34 36 35.8 36 38V48H28Z"
      fill="#FFFFFF"
    />
    <circle cx="32" cy="24" r="2" fill="#000080" />
  </svg>
);

// 7. PhysX Quantum Simulation Logo
export const PhysXLogo: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="physxGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="14" fill="url(#physxGrad)" />
    {/* Atomic Orbitals */}
    <ellipse cx="32" cy="32" rx="20" ry="7" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.9" />
    <ellipse
      cx="32"
      cy="32"
      rx="20"
      ry="7"
      transform="rotate(60 32 32)"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeOpacity="0.9"
    />
    <ellipse
      cx="32"
      cy="32"
      rx="20"
      ry="7"
      transform="rotate(120 32 32)"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeOpacity="0.9"
    />
    <circle cx="32" cy="32" r="4.5" fill="#FFFFFF" />
  </svg>
);

// 8. MDN Web Docs Logo
export const MDNLogo: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect width="64" height="64" rx="14" fill="#15141A" />
    <path
      d="M14 42V22H21.5L28 35L34.5 22H42V42H36.5V28L30 41H26L19.5 28V42H14Z"
      fill="#FFFFFF"
    />
    <rect x="46" y="38" width="6" height="4" fill="#83BFFF" />
  </svg>
);

// 9. DEV Community Logo
export const DevToLogo: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect width="64" height="64" rx="14" fill="#0A0A0A" />
    <path
      d="M17 22H24C28 22 30 25 30 32C30 39 28 42 24 42H17V22ZM21.5 26V38H24C26 38 26.8 36 26.8 32C26.8 28 26 26 24 26H21.5Z"
      fill="#FFFFFF"
    />
    <path d="M33 22H43V26H37V30H42V34H37V38H43V42H33V22Z" fill="#FFFFFF" />
    <path d="M46 22H50.5L53.5 35L56.5 22H61L56 42H51L46 22Z" fill="#FFFFFF" />
  </svg>
);

// 10. Authentic Apple Safari Reader Icon (4 classic serif lines)
export const SafariReaderIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="2" y="3.5" width="16" height="2" rx="1" />
    <rect x="2" y="7.5" width="16" height="2" rx="1" />
    <rect x="2" y="11.5" width="16" height="2" rx="1" />
    <rect x="2" y="15.5" width="11" height="2" rx="1" />
  </svg>
);

// 11. Authentic Apple Safari Share Icon
export const SafariShareIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M10 2.5V12.5M10 2.5L6.5 6M10 2.5L13.5 6" />
    <path d="M4 8.5V16C4 16.55 4.45 17 5 17H15C15.55 17 16 16.55 16 16V8.5" />
  </svg>
);

// 12. Authentic Apple Safari Sidebar Toggle Icon
export const SafariSidebarIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
    <line x1="7.5" y1="3.5" x2="7.5" y2="16.5" />
  </svg>
);

// Dynamic Brand Icon Dispatcher
export type BrandIconKey =
  | 'safari'
  | 'duckduckgo'
  | 'github'
  | 'wikipedia'
  | 'hackernews'
  | 'bharatdekho'
  | 'physx'
  | 'mdn'
  | 'devto'
  | 'reader'
  | 'web';

export const BrandIcon: React.FC<{ iconKey: BrandIconKey | string; className?: string; size?: number }> = ({
  iconKey,
  className = 'w-3.5 h-3.5',
  size,
}) => {
  switch (iconKey) {
    case 'safari':
      return <SafariCompassIcon className={className} size={size} />;
    case 'duckduckgo':
      return <DuckDuckGoLogo className={className} size={size} />;
    case 'github':
      return <GitHubLogo className={className} size={size} />;
    case 'wikipedia':
      return <WikipediaLogo className={className} size={size} />;
    case 'hackernews':
      return <HackerNewsLogo className={className} size={size} />;
    case 'bharatdekho':
      return <BharatDekhoLogo className={className} size={size} />;
    case 'physx':
      return <PhysXLogo className={className} size={size} />;
    case 'mdn':
      return <MDNLogo className={className} size={size} />;
    case 'devto':
      return <DevToLogo className={className} size={size} />;
    case 'reader':
      return <SafariReaderIcon className={className} size={size} />;
    default:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          style={size ? { width: size, height: size } : undefined}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
  }
};
