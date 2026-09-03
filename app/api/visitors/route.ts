import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient, getSupabaseClient, getMockStore, isSupabaseConfigured } from '@/lib/supabaseClient';
import { VisitorRecord } from '@/types/os';
import { getClientIp, checkRateLimit, createRateLimitResponse } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`visitors-get:${ip}`, { limit: 60, windowMs: 60000 });
    if (!rateLimit.success) return createRateLimitResponse(rateLimit);

    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '25', 10), 100);

    let visitorsList: VisitorRecord[] = [];
    let totalCount = 0;

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdminClient() || getSupabaseClient();
      if (supabase) {
        const { data, count, error } = await supabase
          .from('visitors')
          .select('*', { count: 'exact' })
          .order('last_active', { ascending: false })
          .limit(limit);

        if (!error && data) {
          visitorsList = data.map((v: any) => ({
            id: v.id,
            name: v.name,
            role: v.role,
            company: v.company,
            contact: v.contact || undefined,
            message: v.message || undefined,
            isGuest: v.is_guest,
            isAdmin: v.is_admin,
            loginTime: v.login_time,
            lastActive: v.last_active,
            device: v.device || 'Desktop',
            os: v.os || 'macOS',
            browser: v.browser || 'Chrome',
            city: v.city || 'Global',
            country: v.country || 'Global',
            pagesVisited: v.pages_visited || [],
            sessionCount: v.session_count || 1,
          }));
          totalCount = count || visitorsList.length;
        }
      }
    }

    if (visitorsList.length === 0) {
      // Use fallback store
      const store = getMockStore();
      visitorsList = store.visitors.slice(0, limit);
      totalCount = store.visitors.length;
    }

    // Compute basic telemetry breakdowns
    const deviceBreakdown = { desktop: 0, mobile: 0, tablet: 0 };
    const osBreakdown: { [os: string]: number } = {};

    visitorsList.forEach((v) => {
      const d = (v.device || 'Desktop').toLowerCase();
      if (d === 'mobile') deviceBreakdown.mobile++;
      else if (d === 'tablet') deviceBreakdown.tablet++;
      else deviceBreakdown.desktop++;

      const os = v.os || 'macOS';
      osBreakdown[os] = (osBreakdown[os] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      provider: isSupabaseConfigured() ? 'supabase' : 'in-memory-fallback',
      totalCount,
      visitors: visitorsList,
      breakdown: {
        devices: deviceBreakdown,
        operatingSystems: osBreakdown,
      },
    });
  } catch (err: any) {
    console.error('Error in GET /api/visitors:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { sessionId, pageVisited } = body;

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Missing sessionId' }, { status: 400 });
    }

    const now = new Date().toISOString();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdminClient() || getSupabaseClient();
      if (supabase) {
        const { data: existing } = await supabase
          .from('visitors')
          .select('pages_visited')
          .eq('id', sessionId)
          .maybeSingle();

        const currentPages: string[] = existing?.pages_visited || [];
        const updatedPages = pageVisited && !currentPages.includes(pageVisited)
          ? [...currentPages, pageVisited]
          : currentPages;

        await supabase
          .from('visitors')
          .update({
            last_active: now,
            pages_visited: updatedPages,
          })
          .eq('id', sessionId);
      }
    } else {
      const store = getMockStore();
      const visitor = store.visitors.find((v) => v.id === sessionId);
      if (visitor) {
        visitor.lastActive = now;
        if (pageVisited && !visitor.pagesVisited.includes(pageVisited)) {
          visitor.pagesVisited.push(pageVisited);
        }
      }
    }

    return NextResponse.json({ success: true, timestamp: now });
  } catch (err: any) {
    console.error('Error in PATCH /api/visitors:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
