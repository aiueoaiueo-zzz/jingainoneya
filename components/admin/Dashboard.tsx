"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminApi } from "./api";
import { Card, Loading, PageTitle } from "./ui";

type Me = { loggedIn: boolean; configured: { admin: boolean; github?: boolean; supabase?: boolean } };

/** 管理画面のホーム：やること（保留コメント・未対応のお問い合わせ）と、設定の状態 */
export function Dashboard() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [pending, setPending] = useState<number | null>(null);
  const [unhandled, setUnhandled] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const res = await adminApi<Me>("/api/admin/me");
      if (!res.data.loggedIn) {
        router.replace("/admin/login");
        return;
      }
      setMe(res.data);
      if (res.data.configured.supabase) {
        const [c, q] = await Promise.all([
          adminApi<{ counts: Record<string, number> }>("/api/admin/comments?status=pending"),
          adminApi<{ contacts: { handled: boolean }[] }>("/api/admin/contacts"),
        ]);
        if (c.ok) setPending(c.data.counts.pending ?? 0);
        if (q.ok) setUnhandled(q.data.contacts.filter((x) => !x.handled).length);
      }
    })();
  }, [router]);

  if (!me) return <Loading />;

  const tiles = [
    { href: "/admin/articles", title: "記事", text: "記事を書く・直す・公開日を決める" },
    { href: "/admin/diagnoses", title: "診断", text: "質問文や点数を直す" },
    { href: "/admin/images", title: "画像", text: "アイキャッチや記事の画像を追加する" },
    {
      href: "/admin/comments",
      title: "コメント",
      text: pending === null ? "表示・非表示を切り替える" : `確認待ち（保留）：${pending}件`,
      alert: (pending ?? 0) > 0,
    },
    {
      href: "/admin/contacts",
      title: "お問い合わせ",
      text: unhandled === null ? "届いたお問い合わせを見る" : `未対応：${unhandled}件`,
      alert: (unhandled ?? 0) > 0,
    },
    { href: "/admin/settings", title: "サイト設定", text: "自己紹介・人気の記事・トップのスライド" },
  ];

  const missing = [
    !me.configured.github && "GitHub（GITHUB_TOKEN・GITHUB_REPO・GITHUB_BRANCH）：記事・診断・画像・設定の保存に必要",
    !me.configured.supabase && "Supabase：コメントとお問い合わせの確認に必要",
  ].filter(Boolean) as string[];

  return (
    <div>
      <PageTitle>ホーム</PageTitle>
      {missing.length > 0 && (
        <Card className="mb-4 border-danger/50">
          <b className="text-danger">設定が終わっていない項目があります</b>
          <ul className="mt-2 list-disc pl-5 text-sm text-text-sub">
            {missing.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-text-muted">公開先（Netlify）の環境変数に入れて、サイトを作り直すと使えるようになります。</p>
        </Card>
      )}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
        {tiles.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`flex min-h-24 flex-col gap-1 rounded-card border bg-surface p-4 no-underline hover:border-accent ${t.alert ? "border-accent" : "border-line"}`}
          >
            <b className="text-lg">{t.title}</b>
            <span className={`text-sm ${t.alert ? "font-bold text-accent" : "text-text-muted"}`}>{t.text}</span>
          </Link>
        ))}
      </div>
      <Card className="mt-6">
        <b>保存したあとの流れ</b>
        <p className="mt-1 text-sm text-text-sub">
          記事・診断・画像・サイト設定を保存すると、GitHub に記録され、公開先が自動でサイトを作り直します。サイトに反映されるまで数分かかります。コメントとお問い合わせの操作は、すぐに反映されます。
        </p>
      </Card>
    </div>
  );
}
