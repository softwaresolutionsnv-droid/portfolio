import { supabase, STORAGE_BUCKET } from './supabase';
import type {
  AdminSettingsRow,
  ProjectDraft,
  ProjectRow,
  SiteSettingsRow,
} from './types';

function client() {
  if (!supabase) throw new Error('Supabase is niet geconfigureerd.');
  return supabase;
}

/* ---------------------------------- projects ---------------------------------- */

export async function getProjects(): Promise<ProjectRow[]> {
  const { data, error } = await client()
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []) as ProjectRow[];
}

export async function getProject(id: string): Promise<ProjectRow | null> {
  const { data, error } = await client()
    .from('projects')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data as ProjectRow | null;
}

export async function createProject(draft: ProjectDraft): Promise<ProjectRow> {
  const { data, error } = await client()
    .from('projects')
    .insert(draft)
    .select('*')
    .single();
  if (error) throw error;
  return data as ProjectRow;
}

export async function updateProject(
  id: string,
  draft: Partial<ProjectDraft>
): Promise<ProjectRow> {
  const { data, error } = await client()
    .from('projects')
    .update(draft)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as ProjectRow;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await client().from('projects').delete().eq('id', id);
  if (error) throw error;
}

/** Persist a new manual ordering: sort_order = index in `ids`. */
export async function saveProjectOrder(ids: string[]): Promise<void> {
  const results = await Promise.all(
    ids.map((id, index) =>
      client().from('projects').update({ sort_order: index }).eq('id', id)
    )
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) throw failed.error;
}

/* ---------------------------------- settings ---------------------------------- */

export async function getSiteSettings(): Promise<SiteSettingsRow | null> {
  const { data, error } = await client()
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();
  if (error) throw error;
  return data as SiteSettingsRow | null;
}

export async function saveSiteSettings(
  patch: Partial<Omit<SiteSettingsRow, 'id' | 'updated_at'>>
): Promise<void> {
  const { error } = await client()
    .from('site_settings')
    .upsert({ id: 1, ...patch }, { onConflict: 'id' });
  if (error) throw error;
}

export async function getAdminSettings(): Promise<AdminSettingsRow | null> {
  const { data, error } = await client()
    .from('admin_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();
  if (error) throw error;
  return data as AdminSettingsRow | null;
}

export async function saveAdminSettings(
  patch: Partial<Omit<AdminSettingsRow, 'id'>>
): Promise<void> {
  const { error } = await client()
    .from('admin_settings')
    .upsert({ id: 1, ...patch }, { onConflict: 'id' });
  if (error) throw error;
}

/* ---------------------------------- publish ---------------------------------- */

/**
 * Trigger the Vercel deploy hook. The hook URL accepts an unauthenticated
 * POST; `no-cors` because api.vercel.com sends no CORS headers — the
 * request fires, the response is opaque. We optimistically record the
 * publish time.
 */
export async function publishSite(): Promise<void> {
  const settings = await getAdminSettings();
  const hook = settings?.deploy_hook_url?.trim();
  if (!hook) {
    throw new Error(
      'Geen deploy hook ingesteld. Voeg de Vercel deploy hook toe bij Site & teksten → Publicatie.'
    );
  }
  await fetch(hook, { method: 'POST', mode: 'no-cors' });
  await saveAdminSettings({ last_published_at: new Date().toISOString() });
}

/* ---------------------------------- storage ---------------------------------- */

const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;

export async function uploadImage(file: File, slugHint: string): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Alleen afbeeldingen zijn toegestaan.');
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('Bestand is groter dan 12 MB. Verklein het beeld eerst.');
  }
  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const folder = slugHint.trim() || 'project';
  const key = `${folder}/${Date.now()}-${safeName}`;
  const { error } = await client()
    .storage.from(STORAGE_BUCKET)
    .upload(key, file, { cacheControl: '3600', upsert: false });
  if (error) throw error;
  return key;
}
