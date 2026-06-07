import { assertAdminMutationRequest, requireAdmin } from '../../../utils/admin';
import { normalizeVinylRecordInput, withCoverUrls } from '../../../utils/vinyl';

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

  const body = await readBody<Record<string, unknown>>(event);
  const payload = normalizeVinylRecordInput(body);

  const { data, error } = await adminClient
    .from('vinyl_records')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    });
  }

  return {
    record: (await withCoverUrls([data], adminClient))[0],
  };
});
