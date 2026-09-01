export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  durationStr: string;
  cover: string;
  coverColor: string;
  gradient: string;
  audioPreviewUrl?: string;
}

export const PLAYLIST: Track[] = [
  {
    id: 't-1',
    title: 'Neon Horizon',
    artist: 'Anugamya Synthesizer',
    album: 'Liquid Glass (2026)',
    duration: 225,
    durationStr: '3:45',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80',
    coverColor: 'from-blue-600 via-indigo-600 to-purple-800',
    gradient: 'from-blue-600 via-indigo-600 to-purple-800',
  },
  {
    id: 't-2',
    title: 'Midnight Coding Symphony',
    artist: 'AP Lo-Fi Beats',
    album: 'Zero Latency',
    duration: 252,
    durationStr: '4:12',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80',
    coverColor: 'from-emerald-600 via-teal-600 to-cyan-800',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-800',
  },
  {
    id: 't-3',
    title: 'Quantum Fluid Waves',
    artist: 'Anugamya Labs',
    album: 'macOS Sonoma Redux',
    duration: 198,
    durationStr: '3:18',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80',
    coverColor: 'from-purple-600 via-pink-600 to-rose-800',
    gradient: 'from-purple-600 via-pink-600 to-rose-800',
  },
  {
    id: 't-4',
    title: 'Silicon Valley Sunrise',
    artist: 'DeepMind Ambient',
    album: 'AI Odyssey',
    duration: 302,
    durationStr: '5:02',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=300&q=80',
    coverColor: 'from-amber-500 via-orange-600 to-red-800',
    gradient: 'from-amber-500 via-orange-600 to-red-800',
  },
];
