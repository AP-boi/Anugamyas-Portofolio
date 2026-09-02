import { NextRequest, NextResponse } from 'next/server';

interface RateLimitOptions {
  /** Maximum number of requests allowed within the window */
  limit?: number;
  /** Sliding window duration in milliseconds (default: 60,000ms = 1 minute) */
  windowMs?: number;
  /** Custom key prefix */
  keyPrefix?: string;
}

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory store for rate limiting tokens
const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired records every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      // Remove timestamps older than 10 minutes
      record.timestamps = record.timestamps.filter((ts) => now - ts < 600000);
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 300000);
}

/**
 * Extract client IP address from various standard proxy/CDN headers
 */
export function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-real-ip') ||
    req.headers.get('x-client-ip') ||
    '127.0.0.1'
  );
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfterSeconds: number;
}

/**
 * Check if the request exceeds rate limit using sliding window algorithm
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const { limit = 20, windowMs = 60000 } = options;
  const now = Date.now();
  const windowStart = now - windowMs;

  let record = rateLimitStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  // Filter out timestamps outside the current window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  const currentCount = record.timestamps.length;
  const isAllowed = currentCount < limit;

  if (isAllowed) {
    record.timestamps.push(now);
  }

  const oldestTimestamp = record.timestamps[0] || now;
  const resetTime = oldestTimestamp + windowMs;
  const retryAfterSeconds = Math.max(1, Math.ceil((resetTime - now) / 1000));
  const remaining = Math.max(0, limit - record.timestamps.length);

  return {
    success: isAllowed,
    limit,
    remaining,
    reset: Math.ceil(resetTime / 1000),
    retryAfterSeconds,
  };
}

/**
 * Helper to generate standard 429 Too Many Requests response
 */
export function createRateLimitResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: 'Too many requests. Please slow down and try again shortly.',
      retryAfter: result.retryAfterSeconds,
    },
    {
      status: 429,
      headers: {
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.reset.toString(),
        'Retry-After': result.retryAfterSeconds.toString(),
      },
    }
  );
}
