import { NextRequest, NextResponse } from 'next/server';
import { visitorStorage } from '@/lib/visitorStorage';

export async function GET(req: NextRequest) {
  try {
    const summary = visitorStorage.getAnalyticsSummary();
    return NextResponse.json({ success: true, summary });
  } catch (err: any) {
    console.error('Error in GET /api/admin/visitors:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    visitorStorage.clearLogs();
    return NextResponse.json({ success: true, message: 'Logs reset successfully' });
  } catch (err: any) {
    console.error('Error in DELETE /api/admin/visitors:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
