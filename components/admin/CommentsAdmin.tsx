"use client";

import { useEffect, useState } from "react";
import { adminApi } from "./api";
import { Card, Loading, type Notice, NoticeBox, PageTitle, btn } from "./ui";

type Comment = {
  id: number;
  article_slug: string;
  name: string;
  body: string;
  status: "pending" | "rejected" | "published";
  reject_reason: string | null;
  created_at: string;
};

const TABS = [
  { key: "pending", label: "保留（確認待ち）" },
  { key: "rejected", label: "非表示" },
  { key: "published", label: "表示中" },
] as const;

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));

export function CommentsAdmin() {
  const [status, setStatus] = useState<Comment["status"]>("pending");
  const [list, setList] = useState<Comment[] | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [notice, setNotice] = useState<Notice>(null);

  const [reload, setReload] = useState(0);

  useEffect(() => {
    let cancelled = false;
    adminApi<{ comments: Comment[]; counts: Record<string, number> }>(`/api/admin/comments?status=${status}`).then((res) => {
      if (cancelled) return;
      if (res.ok) {
        setList(res.data.comments);
        setCounts(res.data.counts);
      } else {
        setList([]);
        setNotice({ kind: "ng", text: res.data.message ?? "読み込めませんでした。" });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [status, reload]);

  const act = async (c: Comment, next: Comment["status"] | "delete") => {
    if (next === "delete" && !window.confirm("このコメントを削除します。元に戻せません。")) return;
    const res =
      next === "delete"
        ? await adminApi(`/api/admin/comments?id=${c.id}`, { method: "DELETE" })
        : await adminApi("/api/admin/comments", { method: "PATCH", json: { id: c.id, status: next } });
    setNotice(res.ok ? { kind: "ok", text: next === "delete" ? "削除しました。" : next === "published" ? "表示しました（すぐにサイトに反映されます）。" : "非表示にしました。" } : { kind: "ng", text: res.data.message ?? "うまくいきませんでした。" });
    setReload((r) => r + 1);
  };

  return (
    <div className="flex flex-col gap-4">
      <PageTitle>コメント</PageTitle>
      <div role="tablist" className="flex gap-1.5 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={status === t.key}
            onClick={() => {
              setList(null);
              setStatus(t.key);
            }}
            className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-line-strong px-4 text-sm aria-selected:border-accent aria-selected:bg-accent aria-selected:text-on-accent"
          >
            {t.label}（{counts[t.key] ?? "…"}）
          </button>
        ))}
      </div>
      <NoticeBox notice={notice} />
      {!list && <Loading />}
      {list && list.length === 0 && <p className="py-8 text-center text-text-muted">この状態のコメントはありません。</p>}
      {list?.map((c) => (
        <Card key={c.id} className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-x-3 text-xs text-text-muted">
            <span>{fmt(c.created_at)}</span>
            <a href={`/articles/${c.article_slug}`} target="_blank" rel="noopener" className="underline">
              /articles/{c.article_slug}
            </a>
          </div>
          <b className="text-sm">{c.name}</b>
          <p className="break-words whitespace-pre-wrap text-text-sub">{c.body}</p>
          {c.reject_reason && <p className="text-xs text-danger">理由：{c.reject_reason}</p>}
          <div className="flex flex-wrap gap-2">
            {c.status !== "published" && (
              <button type="button" className={btn.primary} onClick={() => act(c, "published")}>
                表示する
              </button>
            )}
            {c.status !== "rejected" && (
              <button type="button" className={btn.normal} onClick={() => act(c, "rejected")}>
                非表示にする
              </button>
            )}
            <button type="button" className={`${btn.danger} ml-auto`} onClick={() => act(c, "delete")}>
              削除
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}
