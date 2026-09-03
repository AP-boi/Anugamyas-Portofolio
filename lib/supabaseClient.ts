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
  visitors: [],
  guestbook: [],
  dailyAnalytics: {},
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
