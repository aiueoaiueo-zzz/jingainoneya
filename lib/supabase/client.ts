import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * サイト用のSupabaseクライアント（公開キー・読み取り専用）。
 * 書き込みは service role（収集関数・管理作業）で行うため、ここでは扱わない。
 */
export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "DATA_SOURCE=supabase には NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY が必要です（.env.local を確認）",
    );
  }
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}
