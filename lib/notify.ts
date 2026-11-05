import "server-only";

/**
 * 管理人へのメール通知（お問い合わせが届いたとき）。
 * メール送信サービス Resend を使う。キーが未設定なら通知は省く（保存はされる）。
 */
export async function notifyContact(message: {
  name: string;
  email: string;
  type: string;
  body: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFY_TO;
  const from = process.env.CONTACT_NOTIFY_FROM;
  if (!key || !to || !from) return false;
  const text = [
    "人外ノ閨にお問い合わせが届きました。",
    "",
    `種類：${message.type}`,
    `お名前：${message.name || "（なし）"}`,
    `メール：${message.email || "（なし）"}`,
    "",
    message.body,
    "",
    "Supabase の contact_messages で確認し、対応したら handled を true にしてください。",
  ].join("\n");
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        subject: `【人外ノ閨】お問い合わせ：${message.type}`,
        text,
        ...(message.email ? { reply_to: message.email } : {}),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("お問い合わせの通知メールに失敗:", res.status, await res.text());
    return res.ok;
  } catch (error) {
    console.error("お問い合わせの通知メールに失敗:", error);
    return false;
  }
}
