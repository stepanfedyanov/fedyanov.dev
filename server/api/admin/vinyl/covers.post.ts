import { assertAdminMutationRequest, requireAdmin } from '../../../utils/admin';
import { randomUUID } from 'node:crypto';

const maxCoverBytes = 5 * 1024 * 1024;

const allowedImages = {
  avif: 'image/avif',
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
} as const;

type AllowedImageExtension = keyof typeof allowedImages;

function detectImageExtension(data: Uint8Array): AllowedImageExtension | null {
  if (data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) {
    return 'jpg';
  }

  if (
    data.length >= 8 &&
    data[0] === 0x89 &&
    data[1] === 0x50 &&
    data[2] === 0x4e &&
    data[3] === 0x47 &&
    data[4] === 0x0d &&
    data[5] === 0x0a &&
    data[6] === 0x1a &&
    data[7] === 0x0a
  ) {
    return 'png';
  }

  if (
    data.length >= 12 &&
    data[0] === 0x52 &&
    data[1] === 0x49 &&
    data[2] === 0x46 &&
    data[3] === 0x46 &&
    data[8] === 0x57 &&
    data[9] === 0x45 &&
    data[10] === 0x42 &&
    data[11] === 0x50
  ) {
    return 'webp';
  }

  if (data.length >= 16 && Buffer.from(data.subarray(4, 8)).toString('ascii') === 'ftyp') {
    const brandData = Buffer.from(data.subarray(8, Math.min(data.length, 40))).toString('ascii');

    if (brandData.includes('avif') || brandData.includes('avis')) {
      return 'avif';
    }
  }

  return null;
}

export default defineEventHandler(async (event) => {
  assertAdminMutationRequest(event);

  const { adminClient } = await requireAdmin(event);
  const form = await readMultipartFormData(event);
  const file = form?.find((item) => item.name === 'file' && item.filename);

  if (!file?.data || !file.filename) {
    throw createError({
      statusCode: 422,
      statusMessage: 'file is required',
    });
  }

  if (file.data.byteLength > maxCoverBytes) {
    throw createError({
      statusCode: 413,
      statusMessage: 'file must be 5 MB or smaller',
    });
  }

  const extension = detectImageExtension(file.data);

  if (!extension) {
    throw createError({
      statusCode: 415,
      statusMessage: 'file must be a JPEG, PNG, WebP, or AVIF image',
    });
  }

  const path = `${randomUUID()}.${extension}`;

  const bucket = adminClient.storage.from('vinyl-covers');
  const { error } = await bucket
    .upload(path, file.data, {
      contentType: allowedImages[extension],
      upsert: false,
    });

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    });
  }

  const { data: signedUrl } = await bucket.createSignedUrl(path, 60 * 60);

  return {
    path,
    public_url: signedUrl?.signedUrl ?? null,
  };
});
