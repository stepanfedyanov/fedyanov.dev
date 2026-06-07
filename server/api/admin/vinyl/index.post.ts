import { assertAdminMutationRequest, requireAdmin } from '../../../utils/admin';
import { normalizeVinylRecordInput, withCoverUrls } from '../../../utils/vinyl';

export default defineEventHandler(async (event) => {
  assertAdminMutationRequest(event);

  const { adminClient } = await requireAdmin(event);
  const body = await readBody<Record<string, unknown>>(event);
  const payload = normalizeVinylRecordInput(body);

  const { data, error } = await adminClient
    .from('vinyl_records')
    .insert(payload)
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
