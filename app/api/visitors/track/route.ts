import { NextRequest, NextResponse } from 'next/server';
import { visitorStorage } from '@/lib/visitorStorage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { sessionId, appOpened, action } = body;
    const userAgent = req.headers.get('user-agent') || '';

    if (action === 'visit') {
      const stats = visitorStorage.recordVisit(userAgent);
      return NextResponse.json({ success: true, stats });
    }

    visitorStorage.recordHeartbeat(sessionId, appOpened);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error in /api/visitors/track:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
