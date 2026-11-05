import { connection } from "next/server";
import { isAdminConfigured, isLoggedIn } from "@/lib/admin/auth";
import { isGitHubConfigured } from "@/lib/admin/github";
import { ok } from "@/lib/admin/respond";
import { isSupabaseConfigured } from "@/lib/supabase/server";

/** ログインしているか、各設定が済んでいるか */
export async function GET() {
  // 毎回その場で確かめる（ページを作るときに答えを固定しない）
  await connection();
  const loggedIn = await isLoggedIn();
  return ok({
    loggedIn,
    configured: {
      admin: isAdminConfigured(),
      github: loggedIn ? isGitHubConfigured() : undefined,
      supabase: loggedIn ? isSupabaseConfigured() : undefined,
    },
  });
}
