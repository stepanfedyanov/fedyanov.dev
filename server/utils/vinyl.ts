import {
  nullableNumber,
  nullableString,
  requiredNumber,
  requiredString,
  toStringArray,
} from './admin';
import { createError } from 'h3';
import type { VinylRecordInput, VinylRecordSpeed } from '~/types/vinyl';

const speeds = new Set<VinylRecordSpeed>(['33_1_3', '45']);

export function normalizeVinylRecordInput(body: Record<string, unknown>): VinylRecordInput {
  const speed = nullableString(body.speed);

  if (speed && !speeds.has(speed as VinylRecordSpeed)) {
    throw createError({
      statusCode: 422,
      statusMessage: 'speed must be 33_1_3 or 45',
    });
  }

  const rating = nullableNumber(body.rating);

  if (rating !== null && (rating < 1 || rating > 10)) {
    throw createError({
      statusCode: 422,
      statusMessage: 'rating must be between 1 and 10',
    });
  }

  return {
    artist: requiredString(body.artist, 'artist'),
    album: requiredString(body.album, 'album'),
    album_release_year: requiredNumber(body.album_release_year, 'album_release_year'),
    edition_release_year: nullableNumber(body.edition_release_year),
    genres: toStringArray(body.genres),
    cover_image_path: nullableString(body.cover_image_path),
    label: nullableString(body.label),
    country: nullableString(body.country),
    vinyl_color: nullableString(body.vinyl_color),
    disc_count: nullableNumber(body.disc_count) ?? 1,
    speed: speed as VinylRecordSpeed | null,
    limited_edition: Boolean(body.limited_edition),
    copy_number: nullableString(body.copy_number),
    discogs_url: nullableString(body.discogs_url),
    rating,
    favorite_tracks: toStringArray(body.favorite_tracks),
    purchased_at: nullableString(body.purchased_at),
    purchased_from: nullableString(body.purchased_from),
    collection_reason: nullableString(body.collection_reason),
    comment: nullableString(body.comment),
    is_published: Boolean(body.is_published),
    sort_order: nullableNumber(body.sort_order) ?? 0,
  };
}

export function withCoverUrls<T extends { cover_image_path: string | null }>(
  records: T[],
  adminClient: {
    storage: {
      from: (bucket: string) => {
        createSignedUrl: (path: string, expiresIn: number) => Promise<{
          data: { signedUrl: string } | null;
          error: unknown;
        }>;
      };
    };
  },
) {
  const bucket = adminClient.storage.from('vinyl-covers');

  return Promise.all(
    records.map(async (record) => {
      if (!record.cover_image_path) {
        return {
          ...record,
          cover_image_url: null,
        };
      }

      const { data, error } = await bucket.createSignedUrl(record.cover_image_path, 60 * 60);

      return {
        ...record,
        cover_image_url: error ? null : data?.signedUrl ?? null,
      };
    }),
  );
}
