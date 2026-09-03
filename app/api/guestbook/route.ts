import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient, getSupabaseClient, getMockStore, isSupabaseConfigured } from '@/lib/supabaseClient';
import { GuestbookEntry } from '@/types/os';
import { getClientIp, checkRateLimit, createRateLimitResponse } from '@/lib/rateLimit';

function sanitizeText(str: string): string {
  return str
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 300);
}

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`guestbook-get:${ip}`, { limit: 60, windowMs: 60000 });
    if (!rateLimit.success) return createRateLimitResponse(rateLimit);

    let entries: GuestbookEntry[] = [];

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdminClient() || getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('guestbook')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(50);

        if (!error && data) {
          entries = data.map((item: any) => ({
            id: item.id,
            author: item.author,
            role: item.role || undefined,
            company: item.company || undefined,
            message: item.message,
            timestamp: item.timestamp,
            verified: item.verified ?? true,
          }));
        }
      }
    }

    if (entries.length === 0) {
      const store = getMockStore();
      entries = [...store.guestbook];
    }

    return NextResponse.json({
      success: true,
      provider: isSupabaseConfigured() ? 'supabase' : 'in-memory-fallback',
      entries,
    });
  } catch (err: any) {
    console.error('Error in GET /api/guestbook:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`guestbook-post:${ip}`, {
      limit: 6,
      windowMs: 60000 * 5, // 6 posts per 5 minutes
    });

    if (!rateLimit.success) return createRateLimitResponse(rateLimit);

    const body = await req.json().catch(() => ({}));
    const { author, role, company, message } = body;

    const cleanAuthor = sanitizeText(author || 'Anonymous Explorer');
    const cleanMessage = sanitizeText(message || '');
    const cleanRole = role ? sanitizeText(role) : 'Visitor';
    const cleanCompany = company ? sanitizeText(company) : 'Guest';

    if (!cleanMessage || cleanMessage.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Message must be at least 2 characters' },
        { status: 400 }
      );
    }

    const newEntry: GuestbookEntry = {
      id: `gb-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      author: cleanAuthor,
      role: cleanRole,
      company: cleanCompany,
      message: cleanMessage,
      timestamp: new Date().toISOString(),
      verified: true,
    };

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdminClient() || getSupabaseClient();
      if (supabase) {
        const { error } = await supabase.from('guestbook').insert({
          id: newEntry.id,
          author: newEntry.author,
          role: newEntry.role,
          company: newEntry.company,
          message: newEntry.message,
          timestamp: newEntry.timestamp,
          verified: newEntry.verified,
        });

        if (error) {
          throw error;
        }
      }
    } else {
      const store = getMockStore();
      store.guestbook.unshift(newEntry);
    }

    return NextResponse.json({
      success: true,
      entry: newEntry,
      provider: isSupabaseConfigured() ? 'supabase' : 'in-memory-fallback',
    });
  } catch (err: any) {
    console.error('Error in POST /api/guestbook:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to submit signature' },
      { status: 500 }
    );
  }
}
