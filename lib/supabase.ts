import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Only two values are ever read, and both are public browser values:
//   NEXT_PUBLIC_SUPABASE_URL
//   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
// No secret/service key is read, requested or stored anywhere in this app.
//
// .trim() and the trailing-slash strip guard against a stray space or newline
// pasted into a host's environment-variable field, which otherwise produces a
// "fetch failed" that is hard to see.
export const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '')
  .trim()
  .replace(/\/+$/, '');
export const SUPABASE_PUBLISHABLE_KEY = (
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ''
).trim();

const SETTING_NAMES = {
  url: 'NEXT_PUBLIC_SUPABASE_URL',
  key: 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
} as const;

/** Which required setting names are missing or blank. Empty means none. */
export function missingSupabaseSettings(): string[] {
  const missing: string[] = [];
  if (!SUPABASE_URL.trim()) missing.push(SETTING_NAMES.url);
  if (!SUPABASE_PUBLISHABLE_KEY.trim()) missing.push(SETTING_NAMES.key);
  return missing;
}

/** A browser/edge client, or null when a required setting is missing. */
export function getSupabase(): SupabaseClient | null {
  if (missingSupabaseSettings().length > 0) return null;
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false },
  });
}

export type Item = {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  category: string | null;
};
