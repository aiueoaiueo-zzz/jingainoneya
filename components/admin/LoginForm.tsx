"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Turnstile } from "@/components/forms/Turnstile";
import { adminApi } from "./api";
import { Field, type Notice, NoticeBox, btn, inputClass } from "./ui";

export function LoginForm() {
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [notice, setNotice] = useState<Notice>(null);
  const [resetKey, setResetKey] = useState(0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice({ kind: "wait", text: "確認しています…" });
    const res = await adminApi("/api/admin/login", { method: "POST", json: { password, token } });
    if (res.ok) {
      const next = params.get("next");
      window.location.href = next && next.startsWith("/admin") ? next : "/admin";
      return;
    }
    setNotice({ kind: "ng", text: res.data.message ?? "ログインできませんでした。" });
    setResetKey((k) => k + 1);
  };

  return (
    <form onSubmit={submit} className="mx-auto mt-10 flex max-w-sm flex-col gap-4">
      <h1 className="text-center text-2xl">
        人外ノ閨 <span className="text-base text-text-muted">管理画面</span>
      </h1>
      <Field label="パスワード" htmlFor="admin-password">
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          className={inputClass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>
      <Turnstile onToken={setToken} resetKey={resetKey} />
      <button type="submit" className={btn.primary} disabled={!password || notice?.kind === "wait"}>
        ログイン
      </button>
      <NoticeBox notice={notice} />
    </form>
  );
}
