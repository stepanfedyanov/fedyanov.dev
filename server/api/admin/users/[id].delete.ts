import { assertAdminMutationRequest, requireAdmin } from '../../../utils/admin';

export default defineEventHandler(async (event) => {
  assertAdminMutationRequest(event);

  const { userId, adminClient } = await requireAdmin(event);
  const id = getRouterParam(event, 'id');
  const query = getQuery(event);
  const deleteAuthUser = query.deleteAuthUser === 'true';

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'id is required',
    });
  }

  if (id === userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'You cannot remove your own admin access',
    });
  }

  const { data: deletedAdmin, error } = await adminClient
    .from('admin_users')
    .delete()
    .eq('user_id', id)
    .select('user_id')
    .maybeSingle();

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    });
  }

  if (!deletedAdmin) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Admin user not found',
    });
  }

  if (deleteAuthUser) {
    const { error: authError } = await adminClient.auth.admin.deleteUser(id);

    if (authError) {
      throw createError({
        statusCode: 400,
        statusMessage: authError.message,
      });
    }
  }

  return {
    ok: true,
  };
});
