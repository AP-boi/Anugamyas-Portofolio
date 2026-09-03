import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { VisitorRecord, GuestbookEntry } from '@/types/os';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey || '';

let supabaseInstance: SupabaseClient | null = null;
let supabaseAdminInstance: SupabaseClient | null = null;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-id')
  );
};

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return supabaseInstance;
};

export const getSupabaseAdminClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return supabaseAdminInstance;
};

// ================= IN-MEMORY RESILIENT STORE FALLBACK =================
// Active when Supabase credentials are not yet configured in .env.local
interface MockDatabaseStore {
  visitors: VisitorRecord[];
  guestbook: GuestbookEntry[];
  dailyAnalytics: { [dateKey: string]: { visits: number; logins: number } };
}

const globalStore: MockDatabaseStore = {
  visitors: [
    {
      id: 'v-101',
      name: 'Sundar Pichai',
      role: 'CEO',
      company: 'Alphabet & Google',
      contact: 'sundar@google.com',
      message: 'Remarkable WebGL engineering on the portfolio OS!',
      isGuest: false,
      isAdmin: false,
      loginTime: new Date(Date.now() - 3600000 * 2).toISOString(),
      lastActive: new Date(Date.now() - 3600000 * 1).toISOString(),
      device: 'Desktop',
      os: 'macOS',
      browser: 'Chrome',
      city: 'Mountain View',
      country: 'United States',
      pagesVisited: ['projects', 'github', 'achievements', 'terminal'],
      sessionCount: 3,
    },
    {
      id: 'v-102',
      name: 'Tech Recruiter',
      role: 'Staff Technical Recruiter',
      company: 'Microsoft AI',
      contact: 'recruiter@microsoft.com',
      message: 'Impressed by the Bharat Dekho Gemini AI integration.',
      isGuest: false,
      isAdmin: false,
      loginTime: new Date(Date.now() - 3600000 * 5).toISOString(),
      lastActive: new Date(Date.now() - 3600000 * 4).toISOString(),
      device: 'Desktop',
      os: 'Windows',
      browser: 'Edge',
      city: 'Seattle',
      country: 'United States',
      pagesVisited: ['projects', 'achievements', 'ai-assistant'],
      sessionCount: 2,
    },
    {
      id: 'v-103',
      name: 'Open Source Contributor',
      role: 'Full Stack Engineer',
      company: 'Vercel Ecosystem',
      contact: 'github.com/developer',
      message: 'Smooth 60 FPS liquid glass physics. Loved the Tetris AI!',
      isGuest: true,
      isAdmin: false,
      loginTime: new Date(Date.now() - 3600000 * 12).toISOString(),
      lastActive: new Date(Date.now() - 3600000 * 11).toISOString(),
      device: 'Mobile',
      os: 'iOS',
      browser: 'Safari',
      city: 'San Francisco',
      country: 'United States',
      pagesVisited: ['github', 'tetris', 'camera'],
      sessionCount: 1,
    },
  ],
  guestbook: [
    {
      id: 'gb-1',
      author: 'Sundar Pichai',
      role: 'CEO',
      company: 'Alphabet',
      message: 'Love the creativity and clean Next.js architecture. Great work Anugamya!',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      verified: true,
    },
    {
      id: 'gb-2',
      author: 'Tech Recruiter',
      role: 'Staff Recruiter',
      company: 'Microsoft AI',
      message: 'Great portfolio! Excited to discuss potential AI software engineering opportunities.',
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      verified: true,
    },
    {
      id: 'gb-3',
      author: 'Guillermo Rauch',
      role: 'CEO',
      company: 'Vercel',
      message: 'Incredible desktop simulator crafted on Next.js 14 and edge rendering.',
      timestamp: new Date(Date.now() - 3600000 * 16).toISOString(),
      verified: true,
    },
  ],
  dailyAnalytics: {
    [new Date().toISOString().split('T')[0]]: { visits: 48, logins: 14 },
  },
};

export const getMockStore = () => globalStore;

/**
 * Health check that tests Supabase connectivity or reports offline fallback state
 */
export async function checkSupabaseHealth(): Promise<{
  connected: boolean;
  provider: 'supabase' | 'in-memory-fallback';
  latencyMs: number;
  tables: string[];
}> {
  const startTime = Date.now();
  const client = getSupabaseClient();

  if (!client) {
    return {
      connected: true,
      provider: 'in-memory-fallback',
      latencyMs: 1,
      tables: ['visitors', 'guestbook', 'daily_analytics'],
    };
  }

  try {
    const { error } = await client.from('visitors').select('id').limit(1);
    const latencyMs = Date.now() - startTime;
    if (error) {
      return {
        connected: false,
        provider: 'supabase',
        latencyMs,
        tables: ['visitors', 'guestbook', 'daily_analytics'],
      };
    }

    return {
      connected: true,
      provider: 'supabase',
      latencyMs,
      tables: ['visitors', 'guestbook', 'daily_analytics'],
    };
  } catch {
    return {
      connected: false,
      provider: 'in-memory-fallback',
      latencyMs: Date.now() - startTime,
      tables: ['visitors', 'guestbook', 'daily_analytics'],
    };
  }
}
