"use client";

import { useEffect, useState } from "react";
import { adminApi } from "./api";
import { Card, Loading, type Notice, NoticeBox, PageTitle, btn } from "./ui";

type Contact = { id: number; name: string; email: string; type: string; body: string; created_at: string; handled: boolean };

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));

export function ContactsAdmin() {
  const [list, setList] = useState<Contact[] | null>(null);
  const [showHandled, setShowHandled] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const [reload, setReload] = useState(0);

  useEffect(() => {
    let cancelled = false;
    adminApi<{ contacts: Contact[] }>("/api/admin/contacts").then((res) => {
      if (cancelled) return;
      if (res.ok) setList(res.data.contacts);
      else {
        setList([]);
        setNotice({ kind: "ng", text: res.data.message ?? "読み込めませんでした。" });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [reload]);

  const toggle = async (c: Contact) => {
    const res = await adminApi("/api/admin/contacts", { method: "PATCH", json: { id: c.id, handled: !c.handled } });
    if (!res.ok) setNotice({ kind: "ng", text: res.data.message ?? "更新できませんでした。" });
    setReload((r) => r + 1);
  };

  const shown = (list ?? []).filter((c) => showHandled || !c.handled);
  const unhandled = (list ?? []).filter((c) => !c.handled).length;

  return (
    <div className="flex flex-col gap-4">
      <PageTitle>お問い合わせ</PageTitle>
      <label className="flex min-h-11 items-center gap-2 text-sm text-text-sub">
        <input type="checkbox" className="size-[18px] accent-accent" checked={showHandled} onChange={(e) => setShowHandled(e.target.checked)} />
        対応済みも表示する（未対応：{unhandled}件）
      </label>
      <NoticeBox notice={notice} />
      {!list && <Loading />}
      {list && shown.length === 0 && <p className="py-8 text-center text-text-muted">未対応のお問い合わせはありません。</p>}
      {shown.map((c) => (
        <Card key={c.id} className={`flex flex-col gap-2 ${c.handled ? "opacity-60" : ""}`}>
          <div className="flex flex-wrap items-center gap-x-3 text-xs text-text-muted">
            <span>{fmt(c.created_at)}</span>
            <span className="font-bold text-accent">{c.type}</span>
            {c.handled && <span>対応済み</span>}
          </div>
          <p className="text-sm">
            {c.name || "（名前なし）"}
            {c.email && (
              <>
                ・
                <a href={`mailto:${c.email}`} className="underline">
                  {c.email}
                </a>
              </>
            )}
          </p>
          <p className="break-words whitespace-pre-wrap text-text-sub">{c.body}</p>
          <div>
            <button type="button" className={c.handled ? btn.normal : btn.primary} onClick={() => toggle(c)}>
              {c.handled ? "未対応に戻す" : "対応済みにする"}
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}
