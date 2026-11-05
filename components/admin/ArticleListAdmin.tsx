"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, findCategory, findGenre } from "@/lib/site";
import { adminApi } from "./api";
import { Loading, PageTitle, btn, inputClass } from "./ui";

type Row = { slug: string; title: string; category: string; genres: string[]; publishAt: string; eyecatch: string };

function todayJst(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(new Date());
}

/** 記事の一覧（予約中も含む） */
export function ArticleListAdmin() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  // 「今日」は表示するときに決める（ページを事前に作るときには決めない）
  const [today, setToday] = useState("");

  useEffect(() => {
    adminApi<{ articles: Row[] }>("/api/admin/articles").then((res) => {
      setToday(todayJst());
      if (res.ok) setRows(res.data.articles);
      else setError(res.data.message ?? "読み込めませんでした。");
    });
  }, []);

  const shown = useMemo(
    () =>
      (rows ?? []).filter(
        (r) => (!cat || r.category === cat) && (!q || r.title.includes(q) || r.slug.includes(q)),
      ),
    [rows, q, cat],
  );

  return (
    <div>
      <PageTitle
        action={
          <Link href="/admin/articles/edit?new=1" className={btn.primary}>
            ＋ 新しい記事
          </Link>
        }
      >
        記事
      </PageTitle>
      {error && <p className="text-danger">{error}</p>}
      {!rows && !error && <Loading />}
      {rows && (
        <>
          <div className="mb-3 flex flex-wrap gap-2">
            <input
              className={`${inputClass} flex-[1_1_200px]`}
              placeholder="タイトルやURL名で探す"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="記事を探す"
            />
            <select className={`${inputClass} w-auto`} value={cat} onChange={(e) => setCat(e.target.value)} aria-label="記事の種類">
              <option value="">すべての種類</option>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <p className="mb-2 text-xs text-text-muted">
            {shown.length}件（全{rows.length}件）・新しい公開日の順
          </p>
          <ul className="flex flex-col">
            {shown.map((r) => {
              const scheduled = r.publishAt > today;
              return (
                <li key={r.slug} className="border-b border-line">
                  <Link href={`/admin/articles/edit?slug=${r.slug}`} className="flex flex-col gap-1 py-3 no-underline hover:text-accent">
                    <span className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-accent">{findCategory(r.category)?.name ?? r.category}</span>
                      <span className={scheduled ? "rounded-full bg-[#3a5a6e] px-2 font-bold text-text" : "text-text-muted"}>
                        {scheduled ? `予約：${r.publishAt}` : `公開：${r.publishAt}`}
                      </span>
                      {r.category !== "guide" && (
                        <span className="text-text-muted">{r.genres.map((g) => findGenre(g)?.name ?? g).join("・")}</span>
                      )}
                    </span>
                    <b className="leading-normal">{r.title}</b>
                    <span className="text-xs text-text-muted">/articles/{r.slug}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
