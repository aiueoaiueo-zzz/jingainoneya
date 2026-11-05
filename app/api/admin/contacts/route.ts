import { adminHandler, bad, ok } from "@/lib/admin/respond";
import { adminClient, isSupabaseConfigured } from "@/lib/supabase/server";

/** お問い合わせの一覧（新しい順） */
export async function GET() {
  return adminHandler(async () => {
    if (!isSupabaseConfigured()) return bad("Supabase の設定が終わっていません。", 503);
    const { data, error } = await adminClient()
      .from("contact_messages")
      .select("id, name, email, type, body, created_at, handled")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) return bad(`お問い合わせを読み込めませんでした（${error.message}）`, 500);
    return ok({ contacts: data ?? [] });
  });
}

/** 対応済みにする・戻す */
export async function PATCH(request: Request) {
  return adminHandler(async () => {
    if (!isSupabaseConfigured()) return bad("Supabase の設定が終わっていません。", 503);
    const input = (await request.json().catch(() => ({}))) as { id?: number; handled?: boolean };
    if (!input.id) return bad("内容が正しくありません。");
    const { error } = await adminClient().from("contact_messages").update({ handled: input.handled === true }).eq("id", input.id);
    if (error) return bad(`更新できませんでした（${error.message}）`, 500);
    return ok({ ok: true });
  });
}
