"use client";

import { useEffect, useState } from "react";
import { REBUILD_NOTE, adminApi } from "./api";
import { Card, Field, Loading, type Notice, NoticeBox, PageTitle, btn, inputClass } from "./ui";

type Slide = { article: string; label: string; text: string };
type Site = { heroText: string; authorIntro: string; popular: string[]; xUrl: string };
type ArticleRow = { slug: string; title: string };

export function SettingsAdmin() {
  const [site, setSite] = useState<Site | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [notice, setNotice] = useState<Notice>(null);

  useEffect(() => {
    Promise.all([
      adminApi<{ site: Site; slides: Slide[] }>("/api/admin/settings"),
      adminApi<{ articles: ArticleRow[] }>("/api/admin/articles"),
    ]).then(([s, a]) => {
      if (s.ok) {
        setSite({ ...s.data.site, popular: [...s.data.site.popular, "", "", "", "", ""].slice(0, 5) });
        setSlides(s.data.slides);
      } else setNotice({ kind: "ng", text: s.data.message ?? "読み込めませんでした。" });
      if (a.ok) setArticles(a.data.articles);
    });
  }, []);

  if (!site) return notice ? <NoticeBox notice={notice} /> : <Loading />;

  const save = async () => {
    setNotice({ kind: "wait", text: "保存しています…" });
    const res = await adminApi("/api/admin/settings", { method: "PUT", json: { site, slides } });
    setNotice(res.ok ? { kind: "ok", text: REBUILD_NOTE } : { kind: "ng", text: res.data.message ?? "保存できませんでした。" });
  };

  const moveSlide = (i: number, d: -1 | 1) => {
    const next = [...slides];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setSlides(next);
  };

  return (
    <div className="flex flex-col gap-5">
      <PageTitle>サイト設定</PageTitle>
      <Card className="flex flex-col gap-4">
        <Field label="トップの紹介文" htmlFor="s-hero">
          <textarea id="s-hero" className={`${inputClass} min-h-20`} value={site.heroText} onChange={(e) => setSite({ ...site, heroText: e.target.value })} />
        </Field>
        <Field label="自己紹介（書いている人）" htmlFor="s-intro" hint="サイドバー・記事の下・運営者情報に出ます">
          <textarea id="s-intro" className={`${inputClass} min-h-28`} value={site.authorIntro} onChange={(e) => setSite({ ...site, authorIntro: e.target.value })} />
        </Field>
        <Field label="XのアカウントのURL" htmlFor="s-x" hint="例：https://x.com/アカウント名（まだなら空でOK）">
          <input id="s-x" className={inputClass} value={site.xUrl} onChange={(e) => setSite({ ...site, xUrl: e.target.value })} />
        </Field>
      </Card>

      <Card className="flex flex-col gap-3">
        <b>人気の記事（サイドバー・上から順に5本）</b>
        {site.popular.map((slug, i) => (
          <ArticleSelect
            articles={articles}
            key={i}
            label={`人気の記事 ${i + 1}位`}
            value={slug}
            onChange={(v) => setSite({ ...site, popular: site.popular.map((p, j) => (j === i ? v : p)) })}
          />
        ))}
        <p className="text-xs text-text-muted">公開日前の記事を選んでも、公開日までは表示されません。</p>
      </Card>

      <Card className="flex flex-col gap-3">
        <b>トップの「はじめての方へ・特集」のスライド</b>
        {slides.map((s, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-sm border border-line p-3">
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-accent">{i + 1}枚目</span>
              <div className="ml-auto flex gap-1">
                <button type="button" className={btn.small} onClick={() => moveSlide(i, -1)} disabled={i === 0} aria-label="前へ">
                  ↑
                </button>
                <button type="button" className={btn.small} onClick={() => moveSlide(i, 1)} disabled={i === slides.length - 1} aria-label="後ろへ">
                  ↓
                </button>
                <button type="button" className={btn.small} onClick={() => setSlides(slides.filter((_, j) => j !== i))}>
                  削除
                </button>
              </div>
            </div>
            <ArticleSelect articles={articles} label={`${i + 1}枚目の記事`} value={s.article} onChange={(v) => setSlides(slides.map((x, j) => (j === i ? { ...x, article: v } : x)))} />
            <input
              className={inputClass}
              placeholder="小さな見出し（例：特集：獣人）"
              aria-label={`${i + 1}枚目の小さな見出し`}
              value={s.label}
              onChange={(e) => setSlides(slides.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
            />
            <input
              className={inputClass}
              placeholder="一言"
              aria-label={`${i + 1}枚目の一言`}
              value={s.text}
              onChange={(e) => setSlides(slides.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))}
            />
          </div>
        ))}
        <button type="button" className={btn.normal} onClick={() => setSlides([...slides, { article: "", label: "", text: "" }])}>
          ＋ スライドを追加
        </button>
      </Card>

      <div className="sticky bottom-0 -mx-4 flex flex-col gap-2 border-t border-line bg-bg/95 px-4 py-3 backdrop-blur">
        <NoticeBox notice={notice} />
        <button type="button" className={`${btn.primary} self-start`} onClick={save} disabled={notice?.kind === "wait"}>
          保存する
        </button>
      </div>
    </div>
  );
}

function ArticleSelect({
  value,
  onChange,
  label,
  articles,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  articles: ArticleRow[];
}) {
  return (
    <select className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
      <option value="">（選ばない）</option>
      {articles.map((a) => (
        <option key={a.slug} value={a.slug}>
          {a.title}
        </option>
      ))}
    </select>
  );
}
