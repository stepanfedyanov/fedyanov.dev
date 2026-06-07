import { serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server';
import { assertAdminMutationRequest, requiredString } from '../../utils/admin';
import { assertRateLimit, clearRateLimit, getClientIp } from '../../utils/rate-limit';

const emailWindow = {
  limit: 5,
  windowMs: 15 * 60 * 1000,
  blockMs: 30 * 60 * 1000,
};

const ipWindow = {
  limit: 30,
  windowMs: 15 * 60 * 1000,
  blockMs: 30 * 60 * 1000,
};

export default defineEventHandler(async (event) => {
  assertAdminMutationRequest(event);

  const body = await readBody<Record<string, unknown>>(event);
  const email = requiredString(body.email, 'email').toLowerCase();
  const password = requiredString(body.password, 'password');
  const ip = getClientIp(event);
  const emailKey = `admin-login:email:${email}`;
  const ipKey = `admin-login:ip:${ip}`;
  const adminClient = serverSupabaseServiceRole(event);

  await assertRateLimit(adminClient, ipKey, ipWindow);
  await assertRateLimit(adminClient, emailKey, emailWindow);

  const client = await serverSupabaseClient(event);
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid email or password',
    });
  }

  const { data: adminUser, error: adminError } = await adminClient
    .from('admin_users')
    .select('user_id')
    .eq('user_id', data.user.id)
    .maybeSingle();

  if (adminError) {
    await client.auth.signOut();

    throw createError({
      statusCode: 500,
      statusMessage: adminError.message,
    });
  }

  if (!adminUser) {
    await client.auth.signOut();

    throw createError({
      statusCode: 403,
      statusMessage: 'Admin access required',
    });
  }

  await clearRateLimit(adminClient, emailKey);

  return {
    ok: true,
  };
});
