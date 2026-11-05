import "server-only";
import { createHash } from "node:crypto";

/** 送ってきた人のIPアドレス（ホスティングごとにヘッダーの名前が違う） */
export function clientIp(request: Request): string {
  const h = request.headers;
  return (
    h.get("x-nf-client-connection-ip") ??
    h.get("cf-connecting-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown"
  );
}

/** 元に戻せない形（ハッシュ）にする。IPアドレスなどそのものは保存しない */
export function hashValue(value: string): string {
  const salt = process.env.HASH_SALT ?? "";
  return createHash("sha256").update(`${salt}:${value}`).digest("hex");
}

/**
 * ボット対策（Cloudflare Turnstile）の確認。
 * 秘密キーが未設定のときは、開発中だけ確認を省く（本番では必ず設定する）。
 */
export async function verifyTurnstile(token: string, ip: string): Promise<{ ok: boolean; message?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === "production" && process.env.ALLOW_NO_TURNSTILE !== "1") {
      return { ok: false, message: "ボット対策の設定が終わっていないため、いまは送信できません。" };
    }
    return { ok: true };
  }
  if (!token) return { ok: false, message: "ボット対策の確認が済んでいません。確認欄が表示されるまでお待ちください。" };
  try {
    const body = new URLSearchParams({ secret, response: token, remoteip: ip });
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(8000),
    });
    const json = (await res.json()) as { success?: boolean };
    return json.success
      ? { ok: true }
      : { ok: false, message: "ボット対策の確認に失敗しました。ページを再読み込みして、もう一度お試しください。" };
  } catch {
    return { ok: false, message: "ボット対策の確認ができませんでした。時間をおいてもう一度お試しください。" };
  }
}

export function json(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
