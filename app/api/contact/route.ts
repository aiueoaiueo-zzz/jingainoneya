import { notifyContact } from "@/lib/notify";
import { clientIp, json, verifyTurnstile } from "@/lib/security";
import { adminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { validateContact } from "@/lib/validation";

type Body = {
  name?: string;
  email?: string;
  type?: string;
  body?: string;
  agree?: boolean;
  website?: string;
  token?: string;
};

/** お問い合わせ：ボット対策 → 見えない入力欄 → 入力チェック → 保存 → 管理人にメール */
export async function POST(request: Request) {
  const input = (await request.json().catch(() => ({}))) as Body;
  const message = {
    name: String(input.name ?? "").trim(),
    email: String(input.email ?? "").trim(),
    type: String(input.type ?? ""),
    body: String(input.body ?? "").trim(),
  };

  if (!isSupabaseConfigured()) {
    return json({ message: "お問い合わせの保存先の設定が終わっていないため、いまは送信できません。" }, 503);
  }
  const turnstile = await verifyTurnstile(String(input.token ?? ""), clientIp(request));
  if (!turnstile.ok) return json({ message: turnstile.message }, 400);
  if (input.website) return json({ ok: true });

  const invalid = validateContact({ ...message, agree: input.agree === true });
  if (invalid) return json({ message: invalid }, 400);

  const { error } = await adminClient().from("contact_messages").insert(message);
  if (error) {
    console.error("お問い合わせの保存に失敗:", error.message);
    return json({ message: "送信できませんでした。時間をおいてもう一度お試しください。" }, 500);
  }
  await notifyContact(message);
  return json({ ok: true });
}
