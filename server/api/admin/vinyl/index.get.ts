import { requireAdmin } from '../../../utils/admin';
import { withCoverUrls } from '../../../utils/vinyl';

export default defineEventHandler(async (event) => {
  const { adminClient } = await requireAdmin(event);
  const { data, error } = await adminClient
    .from('vinyl_records')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }

  return {
    records: await withCoverUrls(data ?? [], adminClient),
  };
});
