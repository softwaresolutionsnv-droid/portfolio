import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
// Supabase's nieuwe "publishable key" en de legacy "anon key" zijn beide
// prima — accepteer beide variabelenamen.
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) as string | undefined;

/** Null when the CMS env vars are missing — AdminApp shows setup help. */
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const STORAGE_BUCKET = 'project-images';

/**
 * Resolve an image reference to a viewable URL. References are either a
 * site-absolute path ('/projects/foo.jpg' — legacy assets shipped in the
 * repo) or a storage object key ('slug/123-foo.jpg').
 */
export function imagePreviewUrl(image: string | null | undefined): string | null {
  if (!image) return null;
  if (image.startsWith('/')) return image;
  if (!supabase) return null;
  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(image).data.publicUrl;
}
