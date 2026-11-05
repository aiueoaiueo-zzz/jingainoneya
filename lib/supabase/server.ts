import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase への接続（サーバー専用）。
 * - publicClient：公開キー。RLS（読み取りの決まり）どおり、公開済みコメントと集計だけ読める
 * - adminClient：service role。書き込み用。ブラウザには絶対に渡さない
 */
let publicCache: SupabaseClient | null = null;
let adminCache: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function publicClient(): SupabaseClient {
  if (publicCache) return publicCache;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY が未設定です");
  publicCache = createClient(url, key, { auth: { persistSession: false } });
  return publicCache;
}

export function adminClient(): SupabaseClient {
  if (adminCache) return adminCache;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY が未設定です");
  adminCache = createClient(url, key, { auth: { persistSession: false } });
  return adminCache;
}
