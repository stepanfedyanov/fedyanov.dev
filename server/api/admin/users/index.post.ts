import { assertAdminMutationRequest, requireAdmin, requiredString } from '../../../utils/admin';

export default defineEventHandler(async (event) => {
  assertAdminMutationRequest(event);

  const { adminClient } = await requireAdmin(event);
  const body = await readBody<Record<string, unknown>>(event);
  const email = requiredString(body.email, 'email').toLowerCase();
  const password = requiredString(body.password, 'password');

  if (password.length < 8) {
    throw createError({
      statusCode: 422,
      statusMessage: 'password must be at least 8 characters',
    });
  }

  const { data: createdUser, error: createErrorResult } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createErrorResult) {
    throw createError({
      statusCode: 400,
      statusMessage: createErrorResult.message,
    });
  }

  const userId = createdUser.user?.id;

  if (!userId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase did not return created user id',
    });
  }

  const { data: adminUser, error: adminError } = await adminClient
    .from('admin_users')
    .insert({ user_id: userId })
    .select('user_id, created_at')
    .single();

  if (adminError) {
    await adminClient.auth.admin.deleteUser(userId);

    throw createError({
      statusCode: 400,
      statusMessage: adminError.message,
    });
  }

  return {
    user: {
      user_id: userId,
      email,
      created_at: createdUser.user.created_at,
      admin_created_at: adminUser.created_at,
    },
  };
});
