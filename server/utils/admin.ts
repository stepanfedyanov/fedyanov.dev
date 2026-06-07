import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server';
import { createError, getHeader, getMethod, getRequestURL, type H3Event } from 'h3';

export type AdminContext = {
  userId: string;
  adminClient: ReturnType<typeof serverSupabaseServiceRole>;
};

const unsafeMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export function assertAdminMutationRequest(event: H3Event) {
  if (!unsafeMethods.has(getMethod(event).toUpperCase())) {
    return;
  }

  if (getHeader(event, 'x-admin-request') !== '1') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Invalid admin request',
    });
  }

  const fetchSite = getHeader(event, 'sec-fetch-site');

  if (fetchSite === 'cross-site') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Cross-site admin requests are not allowed',
    });
  }

  const origin = getHeader(event, 'origin');

  if (!origin) {
    return;
  }

  const requestUrl = getRequestURL(event);
  const forwardedProtocol = getHeader(event, 'x-forwarded-proto')?.split(',')[0]?.trim();
  const requestProtocol = forwardedProtocol ? `${forwardedProtocol}:` : requestUrl.protocol;

  try {
    const originUrl = new URL(origin);

    if (originUrl.host !== requestUrl.host || originUrl.protocol !== requestProtocol) {
      throw new Error('origin mismatch');
    }
  } catch {
    throw createError({
      statusCode: 403,
      statusMessage: 'Cross-origin admin requests are not allowed',
    });
  }
}

export function getUserIdFromClaims(claims: unknown): string | null {
  if (!claims || typeof claims !== 'object') {
    return null;
  }

  const record = claims as { sub?: unknown; id?: unknown };

  if (typeof record.sub === 'string') {
    return record.sub;
  }

  if (typeof record.id === 'string') {
    return record.id;
  }

  return null;
}

export async function requireAdmin(event: H3Event): Promise<AdminContext> {
  let claims: unknown = null;

  try {
    claims = await serverSupabaseUser(event);
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required',
    });
  }

  const userId = getUserIdFromClaims(claims);

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required',
    });
  }

  const adminClient = serverSupabaseServiceRole(event);
  const { data, error } = await adminClient
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }

  if (!data) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Admin access required',
    });
  }

  return {
    userId,
    adminClient,
  };
}

export function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split('\n')
      .flatMap((line) => line.split(','))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export function nullableString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function nullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function requiredString(value: unknown, field: string): string {
  const trimmed = nullableString(value);

  if (!trimmed) {
    throw createError({
      statusCode: 422,
      statusMessage: `${field} is required`,
    });
  }

  return trimmed;
}

export function requiredNumber(value: unknown, field: string): number {
  const parsed = nullableNumber(value);

  if (parsed === null) {
    throw createError({
      statusCode: 422,
      statusMessage: `${field} is required`,
    });
  }

  return parsed;
}
