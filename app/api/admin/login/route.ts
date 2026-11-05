import { connection } from "next/server";
import { checkPassword, isAdminConfigured, startSession } from "@/lib/admin/auth";
import { bad, ok } from "@/lib/admin/respond";
import { clientIp, verifyTurnstile } from "@/lib/security";

/** ログイン：ボット対策 → パスワードの確認 → 7日間有効な合言葉を渡す */
export async function POST(request: Request) {
  await connection();
  if (!isAdminConfigured()) {
    return bad("管理画面のパスワード（ADMIN_PASSWORD、12文字以上）が設定されていません。", 503);
  }
  const input = (await request.json().catch(() => ({}))) as { password?: string; token?: string };
  const turnstile = await verifyTurnstile(String(input.token ?? ""), clientIp(request));
  if (!turnstile.ok) return bad(turnstile.message ?? "ボット対策の確認に失敗しました。");
  if (!checkPassword(String(input.password ?? ""))) {
    // 総当たりを遅らせる
    await new Promise((r) => setTimeout(r, 1500));
    return bad("パスワードが違います。", 401);
  }
  await startSession();
  return ok({ ok: true });
}
