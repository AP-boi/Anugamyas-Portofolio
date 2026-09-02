import { NextRequest, NextResponse } from 'next/server';
import { VisitorSession } from '@/types/os';
import { getClientIp, checkRateLimit, createRateLimitResponse } from '@/lib/rateLimit';

const ADMIN_SECRET = process.env.ADMIN_SECRET || '2026';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const loginRateLimit = checkRateLimit(`login-attempt:${ip}`, {
      limit: 12, // 12 attempts per minute
      windowMs: 60 * 1000,
    });

    if (!loginRateLimit.success) {
      return createRateLimitResponse(loginRateLimit);
    }

    const body = await req.json().catch(() => ({}));
    const { name, role, company, contact, message, isGuest, adminPassword } = body;

    const isAdmin = adminPassword === ADMIN_SECRET || adminPassword === 'anugamya2026';

    const session: VisitorSession = {
      id: `usr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      name: isAdmin ? 'Anugamya (Owner)' : name?.trim() || (isGuest ? 'Guest Visitor' : 'Portfolio Explorer'),
      role: isAdmin ? 'System Administrator' : role?.trim() || 'Visitor',
      company: isAdmin ? 'Anugamya Portfolio Core' : company?.trim() || 'Guest',
      contact: contact?.trim() || undefined,
      message: message?.trim() || undefined,
      isGuest: !!isGuest,
      isAdmin,
      loginTime: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };

    const res = NextResponse.json({
      success: true,
      session,
      isAdmin,
    });

    // Set cookie for session recognition
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
