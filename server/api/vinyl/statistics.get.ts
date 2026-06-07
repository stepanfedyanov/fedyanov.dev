import { serverSupabaseClient } from '#supabase/server';
import { calculateVinylStatistics } from '../../utils/vinyl';
import type { VinylRecord } from '~/types/vinyl';

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const { data, error } = await client
    .from('vinyl_records')
    .select('disc_count, rating')
    .eq('is_published', true);

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }

  return {
    statistics: calculateVinylStatistics((data ?? []) as Pick<VinylRecord, 'disc_count' | 'rating'>[]),
  };
});
