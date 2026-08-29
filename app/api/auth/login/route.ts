import { NextRequest, NextResponse } from 'next/server';
import { visitorStorage } from '@/lib/visitorStorage';

const ADMIN_SECRET = process.env.ADMIN_SECRET || '2026';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, role, company, contact, message, isGuest, adminPassword } = body;

    const userAgent = req.headers.get('user-agent') || '';
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '127.0.0.1';

    const isAdmin = adminPassword === ADMIN_SECRET || adminPassword === 'anugamya2026';

    const { session, totalLogins } = visitorStorage.recordLogin({
      name: isAdmin ? 'Anugamya (Owner)' : name || (isGuest ? 'Guest Visitor' : 'Portfolio Explorer'),
      role: isAdmin ? 'System Administrator' : role,
      company: isAdmin ? 'Anugamya Portfolio Core' : company,
      contact,
      message,
      isGuest: !!isGuest,
      isAdmin,
      userAgent,
      ip,
    });

    const res = NextResponse.json({
      success: true,
      session,
      totalLogins,
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
