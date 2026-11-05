"use client";

import { useState } from "react";
import { StatusBox, honeypotClass, inputClass, labelClass, submitClass } from "@/components/forms/styles";
import { Turnstile } from "@/components/forms/Turnstile";
import { COMMENT_DEFAULT_NAME, validateComment } from "@/lib/validation";
import type { CommentItem } from "./CommentList";

type Status = { kind: "ok" | "ng" | "wait"; text: string } | null;

/** コメントの投稿フォーム */
export function CommentForm({ slug, onPublished }: { slug: string; onPublished: (c: CommentItem) => void }) {
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<Status>(null);
  const [resetKey, setResetKey] = useState(0);
  const sending = status?.kind === "wait";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateComment({ name, body });
    setError(err ?? "");
    if (err) return;
    setStatus({ kind: "wait", text: "内容を確認しています…" });
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name, body, website, token }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        status?: string;
        reason?: string;
        message?: string;
        comment?: CommentItem;
      };
      if (!res.ok) {
        setStatus({ kind: "ng", text: json.message ?? "投稿できませんでした。時間をおいてもう一度お試しください。" });
      } else if (json.status === "published" && json.comment) {
        onPublished(json.comment);
        setBody("");
        setStatus({ kind: "ok", text: "確認が終わり、コメントを表示しました。ありがとうございます。" });
      } else if (json.status === "rejected") {
        setStatus({ kind: "ng", text: `このコメントは表示できません：${json.reason ?? ""}` });
      } else if (json.status === "pending") {
        setBody("");
        setStatus({
          kind: "ok",
          text: "受け付けました。自動の確認ができなかったため、管理人が内容を確認してから表示します。",
        });
      } else {
        setBody("");
        setStatus({ kind: "ok", text: "受け付けました。" });
      }
    } catch {
      setStatus({ kind: "ng", text: "投稿できませんでした。通信状態を確認して、もう一度お試しください。" });
    } finally {
      setResetKey((k) => k + 1);
    }
  };

  return (
    <form className="relative mt-4.5 flex flex-col gap-2.5" onSubmit={submit} noValidate>
      <label htmlFor="c-name" className={labelClass}>
        名前（空欄なら「{COMMENT_DEFAULT_NAME}」）
      </label>
      <input id="c-name" className={inputClass} maxLength={20} autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} />
      <label htmlFor="c-text" className={labelClass}>
        コメント（400字まで）
      </label>
      <textarea
        id="c-text"
        className={`${inputClass} min-h-[110px] resize-y`}
        maxLength={400}
        placeholder="好きな人外や、記事の感想をどうぞ"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className={honeypotClass} aria-hidden="true">
        <label htmlFor="c-web">ウェブサイト（入力しないでください）</label>
        <input id="c-web" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      <Turnstile onToken={setToken} resetKey={resetKey} />
      <span role="alert" className="min-h-[1.2em] text-[13px] text-danger">
        {error}
      </span>
      <button type="submit" className={submitClass} disabled={sending}>
        コメントを送る
      </button>
      <p className="text-xs text-text-muted">
        送信されたコメントは、表示の前にAIが内容を確認します。誹謗中傷・個人情報・URL・未成年を思わせる内容などは表示されません。
      </p>
      {status && <StatusBox kind={status.kind}>{status.text}</StatusBox>}
    </form>
  );
}
