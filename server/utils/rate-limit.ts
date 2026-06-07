import { createError, getHeader, type H3Event } from 'h3';

type RateLimitOptions = {
  limit: number;
  windowMs: number;
  blockMs: number;
};

type RateLimitClient = {
  rpc: (functionName: string, args: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
};

export function getClientIp(event: H3Event) {
  const remoteAddress = event.node.req.socket.remoteAddress;

  if (remoteAddress) {
    return remoteAddress;
  }

  const realIp = getHeader(event, 'x-real-ip');

  if (realIp) {
    return realIp;
  }

  const forwardedFor = getHeader(event, 'x-forwarded-for');

  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return getHeader(event, 'x-real-ip') || 'unknown';
}

export async function assertRateLimit(client: RateLimitClient, key: string, options: RateLimitOptions) {
  const { error } = await client.rpc('assert_admin_rate_limit', {
    p_key: key,
    p_limit: options.limit,
    p_window_seconds: Math.ceil(options.windowMs / 1000),
    p_block_seconds: Math.ceil(options.blockMs / 1000),
  });

  if (!error) {
    return;
  }

  if (error.message.includes('rate_limited')) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many login attempts. Try again later.',
    });
  }

  throw createError({
    statusCode: 500,
    statusMessage: error.message,
  });
}

export async function clearRateLimit(client: RateLimitClient, key: string) {
  const { error } = await client.rpc('clear_admin_rate_limit', {
    p_key: key,
  });

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
}
