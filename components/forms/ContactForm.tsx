"use client";

import Link from "next/link";
import { useState } from "react";
import { CONTACT_TYPES, validateContact } from "@/lib/validation";
import { StatusBox, honeypotClass, inputClass, labelClass, submitClass } from "./styles";
import { Turnstile } from "./Turnstile";

type Status = { kind: "ok" | "ng" | "wait"; text: string } | null;

/** お問い合わせフォーム */
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<string>(CONTACT_TYPES[0]);
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState("");
  const [agree, setAgree] = useState(false);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<Status>(null);
  const [resetKey, setResetKey] = useState(0);
  const sending = status?.kind === "wait";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateContact({ name, email, type, body, agree });
    setError(err ?? "");
    if (err) return;
    setStatus({ kind: "wait", text: "送信しています…" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, type, body, agree, website, token }),
      });
      const json = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        setStatus({ kind: "ng", text: json.message ?? "送信できませんでした。時間をおいてもう一度お試しください。" });
      } else {
        setStatus({ kind: "ok", text: "送信しました。お問い合わせありがとうございます。" });
        setBody("");
        setAgree(false);
      }
    } catch {
      setStatus({ kind: "ng", text: "送信できませんでした。通信状態を確認して、もう一度お試しください。" });
    } finally {
      setResetKey((k) => k + 1);
    }
  };

  return (
    <form className="relative mt-4.5 flex flex-col gap-2.5" onSubmit={submit} noValidate>
      <label htmlFor="ct-name" className={labelClass}>
        お名前（ニックネーム可）
      </label>
      <input id="ct-name" className={inputClass} maxLength={40} autoComplete="nickname" value={name} onChange={(e) => setName(e.target.value)} />
      <label htmlFor="ct-mail" className={labelClass}>
        メールアドレス（返信が必要な場合）
      </label>
      <input id="ct-mail" type="email" className={inputClass} maxLength={120} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label htmlFor="ct-type" className={labelClass}>
        お問い合わせの種類
      </label>
      <select id="ct-type" className={`${inputClass} h-11 py-0`} value={type} onChange={(e) => setType(e.target.value)}>
        {CONTACT_TYPES.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>
      <label htmlFor="ct-body" className={labelClass}>
        内容（必須・2000字まで）
      </label>
      <textarea id="ct-body" className={`${inputClass} min-h-[150px] resize-y`} maxLength={2000} value={body} onChange={(e) => setBody(e.target.value)} />
      <div className={honeypotClass} aria-hidden="true">
        <label htmlFor="ct-web">ウェブサイト（入力しないでください）</label>
        <input id="ct-web" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      <Turnstile onToken={setToken} resetKey={resetKey} />
      <label className="flex min-h-11 items-center gap-2 text-sm text-text-sub">
        <input type="checkbox" className="size-[18px] accent-accent" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        <span>
          <Link href="/privacy" className="underline">
            プライバシーポリシー
          </Link>
          に同意します
        </span>
      </label>
      <span role="alert" className="min-h-[1.2em] text-[13px] text-danger">
        {error}
      </span>
      <button type="submit" className={submitClass} disabled={sending}>
        送信する
      </button>
      {status && <StatusBox kind={status.kind}>{status.text}</StatusBox>}
    </form>
  );
}
