import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, checkRateLimit, createRateLimitResponse } from '@/lib/rateLimit';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Apply rate limiting specifically to all backend API endpoints
  if (pathname.startsWith('/api')) {
    const ip = getClientIp(req);
    const rateLimitKey = `global-api:${ip}`;

    // 60 requests per minute per IP for general API traffic
    const limitResult = checkRateLimit(rateLimitKey, {
      limit: 60,
      windowMs: 60 * 1000,
    });

    if (!limitResult.success) {
      return createRateLimitResponse(limitResult);
    }

    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', limitResult.limit.toString());
    response.headers.set('X-RateLimit-Remaining', limitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', limitResult.reset.toString());
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
