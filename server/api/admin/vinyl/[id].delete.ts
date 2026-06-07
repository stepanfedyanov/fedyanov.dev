import { assertAdminMutationRequest, requireAdmin } from '../../../utils/admin';

export default defineEventHandler(async (event) => {
  assertAdminMutationRequest(event);

  const { adminClient } = await requireAdmin(event);
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'id is required',
    });
  }

  const { error } = await adminClient
    .from('vinyl_records')
    .delete()
    .eq('id', id);

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    });
  }

  return {
    ok: true,
  };
});
