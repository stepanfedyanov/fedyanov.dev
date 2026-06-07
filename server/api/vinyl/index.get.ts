import { serverSupabaseClient } from '#supabase/server';
import { toPublicVinylRecord, withCoverUrls } from '../../utils/vinyl';
import type { VinylRecord } from '~/types/vinyl';

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const { data, error } = await client
    .from('vinyl_records')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }

  const records = (await withCoverUrls((data ?? []) as VinylRecord[], client))
    .map((record) => toPublicVinylRecord(record as VinylRecord));

  return {
    records,
    top_albums: [...records]
      .filter((record) => record.rating !== null)
      .sort((first, second) => (second.rating ?? 0) - (first.rating ?? 0))
      .slice(0, 3),
  };
});
