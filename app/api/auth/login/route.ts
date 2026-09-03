import { NextRequest, NextResponse } from 'next/server';
import { VisitorSession, VisitorRecord } from '@/types/os';
import { getClientIp, checkRateLimit, createRateLimitResponse } from '@/lib/rateLimit';
import { getSupabaseAdminClient, getSupabaseClient, getMockStore, isSupabaseConfigured } from '@/lib/supabaseClient';

const ADMIN_SECRET = process.env.ADMIN_SECRET || '175039';

export const dynamic = 'force-dynamic';

function parseUserAgent(userAgent: string | null) {
  const ua = userAgent || '';
  let device = 'Desktop';
  let os = 'macOS';
  let browser = 'Chrome';

  if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
    device = /ipad|tablet/i.test(ua) ? 'Tablet' : 'Mobile';
  }

  if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/windows|win32/i.test(ua)) os = 'Windows';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/linux/i.test(ua)) os = 'Linux';

  if (/edg/i.test(ua)) browser = 'Edge';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua)) browser = 'Safari';

  return { device, os, browser };
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const loginRateLimit = checkRateLimit(`login-attempt:${ip}`, {
      limit: 15,
      windowMs: 60 * 1000,
    });

    if (!loginRateLimit.success) {
      return createRateLimitResponse(loginRateLimit);
    }

    const body = await req.json().catch(() => ({}));
    const { name, role, company, contact, message, isGuest, adminPassword, pagesVisited } = body;

    const isAdmin = adminPassword === ADMIN_SECRET;

    if (adminPassword && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Invalid administrator credentials' },
        { status: 401 }
      );
    }

    const { device, os, browser } = parseUserAgent(req.headers.get('user-agent'));
    const city = req.headers.get('x-vercel-ip-city') || 'New Delhi';
    const country = req.headers.get('x-vercel-ip-country') || 'India';

    const sessionId = `usr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const sessionName = isAdmin
      ? 'Anugamya (Owner)'
      : name?.trim() || (isGuest ? 'Guest Explorer' : 'Portfolio Explorer');
    const sessionRole = isAdmin ? 'System Administrator' : role?.trim() || 'Visitor';
    const sessionCompany = isAdmin ? 'Anugamya Portfolio Core' : company?.trim() || 'Independent';

    const session: VisitorSession = {
      id: sessionId,
      name: sessionName,
      role: sessionRole,
      company: sessionCompany,
      contact: contact?.trim() || undefined,
      message: message?.trim() || undefined,
      isGuest: !!isGuest,
      isAdmin,
      loginTime: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };

    const visitorRecord: VisitorRecord = {
      id: sessionId,
      name: sessionName,
      role: sessionRole,
      company: sessionCompany,
      contact: contact?.trim() || undefined,
      message: message?.trim() || undefined,
      isGuest: !!isGuest,
      isAdmin,
      loginTime: session.loginTime,
      lastActive: session.lastActive,
      device,
      os,
      browser,
      city,
      country,
      pagesVisited: Array.isArray(pagesVisited) ? pagesVisited : ['desktop'],
      sessionCount: 1,
    };

    // Write to Supabase or resilient fallback store
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdminClient() || getSupabaseClient();
      if (supabase) {
        // Upsert visitor into public.visitors
        await supabase.from('visitors').upsert({
          id: visitorRecord.id,
          name: visitorRecord.name,
          role: visitorRecord.role,
          company: visitorRecord.company,
          contact: visitorRecord.contact || '',
          message: visitorRecord.message || '',
          is_guest: visitorRecord.isGuest,
          is_admin: visitorRecord.isAdmin,
          login_time: visitorRecord.loginTime,
          last_active: visitorRecord.lastActive,
          device: visitorRecord.device,
          os: visitorRecord.os,
          browser: visitorRecord.browser,
          city: visitorRecord.city,
          country: visitorRecord.country,
          pages_visited: visitorRecord.pagesVisited,
          session_count: 1,
        });

        // Increment daily analytics
        const todayKey = new Date().toISOString().split('T')[0];
        const { data: existingDaily } = await supabase
          .from('daily_analytics')
          .select('visits, logins')
          .eq('date_key', todayKey)
          .maybeSingle();

        await supabase.from('daily_analytics').upsert({
          date_key: todayKey,
          visits: (existingDaily?.visits || 0) + 1,
          logins: (existingDaily?.logins || 0) + 1,
          updated_at: new Date().toISOString(),
        });
      }
    } else {
      // In-Memory Fallback
      const store = getMockStore();
      store.visitors.unshift(visitorRecord);
      const todayKey = new Date().toISOString().split('T')[0];
      if (!store.dailyAnalytics[todayKey]) {
        store.dailyAnalytics[todayKey] = { visits: 1, logins: 1 };
      } else {
        store.dailyAnalytics[todayKey].visits += 1;
        store.dailyAnalytics[todayKey].logins += 1;
      }
    }

    const res = NextResponse.json({
      success: true,
      session,
      isAdmin,
      provider: isSupabaseConfigured() ? 'supabase' : 'in-memory-fallback',
    });

    res.cookies.set('visitor_session_id', session.id, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false,
      sameSite: 'lax',
    });

    return res;
  } catch (err: any) {
    console.error('Error in /api/auth/login:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
