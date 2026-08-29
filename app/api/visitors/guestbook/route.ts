import { NextRequest, NextResponse } from 'next/server';
import { visitorStorage } from '@/lib/visitorStorage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { author, role, company, message } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Message cannot be empty' }, { status: 400 });
    }

    const entry = visitorStorage.addGuestbook({
      author: author || 'Visitor',
      role,
      company,
      message,
    });

    return NextResponse.json({ success: true, entry });
  } catch (err: any) {
    console.error('Error in POST /api/visitors/guestbook:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
