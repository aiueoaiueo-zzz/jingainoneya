import { adminHandler, bad, ok } from "@/lib/admin/respond";
import { adminClient, isSupabaseConfigured } from "@/lib/supabase/server";

const STATUSES = ["pending", "rejected", "published"] as const;

/** コメントの一覧（状態ごと） */
export async function GET(request: Request) {
  return adminHandler(async () => {
    if (!isSupabaseConfigured()) return bad("Supabase の設定が終わっていません。", 503);
    const status = new URL(request.url).searchParams.get("status") ?? "pending";
    if (!(STATUSES as readonly string[]).includes(status)) return bad("状態が正しくありません。");
    const { data, error } = await adminClient()
      .from("comments")
      .select("id, article_slug, name, body, status, reject_reason, created_at")
      .eq("status", status)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) return bad(`コメントを読み込めませんでした（${error.message}）`, 500);
    const counts: Record<string, number> = {};
    for (const s of STATUSES) {
      const { count } = await adminClient().from("comments").select("id", { count: "exact", head: true }).eq("status", s);
      counts[s] = count ?? 0;
    }
    return ok({ comments: data ?? [], counts });
  });
}

/** コメントの表示・非表示を切り替える */
export async function PATCH(request: Request) {
  return adminHandler(async () => {
    if (!isSupabaseConfigured()) return bad("Supabase の設定が終わっていません。", 503);
    const input = (await request.json().catch(() => ({}))) as { id?: number; status?: string };
    if (!input.id || !(STATUSES as readonly string[]).includes(String(input.status))) return bad("内容が正しくありません。");
    const { error } = await adminClient()
      .from("comments")
      .update({
        status: input.status,
        reject_reason: input.status === "rejected" ? "管理人が非表示にしました" : null,
      })
      .eq("id", input.id);
    if (error) return bad(`更新できませんでした（${error.message}）`, 500);
    return ok({ ok: true });
  });
}

/** コメントを削除する */
export async function DELETE(request: Request) {
  return adminHandler(async () => {
    if (!isSupabaseConfigured()) return bad("Supabase の設定が終わっていません。", 503);
    const id = Number(new URL(request.url).searchParams.get("id"));
    if (!id) return bad("内容が正しくありません。");
    const { error } = await adminClient().from("comments").delete().eq("id", id);
    if (error) return bad(`削除できませんでした（${error.message}）`, 500);
    return ok({ ok: true });
  });
}
