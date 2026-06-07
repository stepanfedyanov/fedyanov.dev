export type VinylRecordSpeed = '33_1_3' | '45';

export type VinylRecord = {
  id: string;
  artist: string;
  album: string;
  album_release_year: number;
  edition_release_year: number | null;
  genres: string[];
  cover_image_path: string | null;
  cover_image_url?: string | null;
  label: string | null;
  country: string | null;
  vinyl_color: string | null;
  disc_count: number;
  speed: VinylRecordSpeed | null;
  limited_edition: boolean;
  copy_number: string | null;
  discogs_url: string | null;
  rating: number | null;
  favorite_tracks: string[];
  purchased_at: string | null;
  purchased_from: string | null;
  collection_reason: string | null;
  comment: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type VinylRecordInput = Omit<VinylRecord, 'id' | 'created_at' | 'updated_at' | 'cover_image_url'>;

export type AdminUser = {
  user_id: string;
  email: string | null;
  created_at: string | null;
  admin_created_at: string;
};
