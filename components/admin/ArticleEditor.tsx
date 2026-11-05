"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Illustration } from "@/components/article/Illustration";
import { CATEGORIES, GENRE_GROUPS } from "@/lib/site";
import { REBUILD_NOTE, adminApi } from "./api";
import { ImageUploader } from "./ImageUploader";
import { adminImageUrl } from "./imageTools";
import { MdxPreview } from "./MdxPreview";
import { Card, Field, Loading, type Notice, NoticeBox, PageTitle, btn, inputClass } from "./ui";

type Draft = {
  slug: string;
  title: string;
  category: string;
  genres: string[];
  publishAt: string;
  description: string;
  eyecatch: string;
  authorNote: string;
  sponsored: boolean;
  body: string;
};

const todayJst = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(new Date());

const EMPTY: Draft = {
  slug: "",
  title: "",
  category: "review",
  genres: [],
  publishAt: "",
  description: "",
  eyecatch: "",
  authorNote: "",
  sponsored: false,
  body: "[導入文：この記事でどんな人に、どんな作品を紹介するか]\n\n## 見出し\n\n本文\n\n## まとめ\n\n[まとめと、次に読んでほしい記事への案内]\n",
};

/** 本文に差し込める部品 */
const SNIPPETS: { label: string; text: string }[] = [
  { label: "見出し", text: "\n## 見出し\n\n" },
  { label: "小見出し", text: "\n### 小見出し\n\n" },
  { label: "太字", text: "<b>太字</b>" },
  { label: "リンク", text: "[リンクの文字](/articles/URL名)" },
  { label: "箇条書き", text: "\n- 項目\n- 項目\n\n" },
  { label: "作品の枠", text: '\n<WorkBox title="作品名" circle="サークル名" format="同人誌" genre="kemono" url="https://公式ページのURL" />\n\n' },
  { label: "診断", text: '\n<Diagnosis id="g_kaii" />\n\n' },
  { label: "図（仮イラスト）", text: '\n<Figure art="kaii" caption="イメージ：説明" />\n\n' },
  { label: "図（画像）", text: '\n<Figure src="/images/画像の名前.webp" alt="画像の説明" caption="図の説明" />\n\n' },
  { label: "囲み", text: "\n<Callout>ここに文章</Callout>\n\n" },
  { label: "項目の並び", text: "\n<ItemList>\n\n- **見出し** 説明\n- **見出し** 説明\n\n</ItemList>\n\n" },
  { label: "小さな補足", text: "\n<Note>補足の文章</Note>\n\n" },
];

export function ArticleEditor() {
  const params = useSearchParams();
  const router = useRouter();
  const isNew = params.get("new") === "1";
  const slugParam = params.get("slug") ?? "";

  const [draft, setDraft] = useState<Draft | null>(null);
  const [sha, setSha] = useState<string | undefined>();
  const [dirty, setDirty] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [eyecatches, setEyecatches] = useState<{ name: string; src: string }[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isNew) {
      // 新しい記事の公開日は、今日（日本時間）にしておく
      void Promise.resolve().then(() => setDraft({ ...EMPTY, publishAt: todayJst() }));
      return;
    }
    adminApi<{ draft: Draft; sha: string }>(`/api/admin/article?slug=${encodeURIComponent(slugParam)}`).then((res) => {
      if (res.ok) {
        setDraft(res.data.draft);
        setSha(res.data.sha);
      } else setNotice({ kind: "ng", text: res.data.message ?? "読み込めませんでした。" });
    });
  }, [isNew, slugParam]);

  const loadImages = useCallback(() => {
    adminApi<{ eyecatch: { name: string; src: string }[] }>("/api/admin/images").then((res) => {
      if (res.ok) setEyecatches(res.data.eyecatch);
    });
  }, []);
  useEffect(loadImages, [loadImages]);

  // 保存していない変更があるときは、ページを離れる前に確認する
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  if (!draft) return notice ? <NoticeBox notice={notice} /> : <Loading />;

  const update = (patch: Partial<Draft>) => {
    setDraft({ ...draft, ...patch });
    setDirty(true);
  };

  const insert = (text: string) => {
    const el = bodyRef.current;
    const start = el?.selectionStart ?? draft.body.length;
    const end = el?.selectionEnd ?? draft.body.length;
    const next = draft.body.slice(0, start) + text + draft.body.slice(end);
    update({ body: next });
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + text.length, start + text.length);
    });
  };

  const save = async () => {
    setNotice({ kind: "wait", text: "確認して保存しています…" });
    const res = await adminApi<{ sha: string }>("/api/admin/article", {
      method: "PUT",
      json: { draft, sha, isNew },
    });
    if (!res.ok) {
      setNotice({ kind: "ng", text: res.data.message ?? "保存できませんでした。" });
      return;
    }
    setSha(res.data.sha);
    setDirty(false);
    const scheduled = draft.publishAt > todayJst();
    setNotice({
      kind: "ok",
      text: `${REBUILD_NOTE}${scheduled ? `\n公開日（${draft.publishAt}）の0時に、自動で公開されます。` : ""}`,
    });
    if (isNew) router.replace(`/admin/articles/edit?slug=${draft.slug}`);
  };

  const remove = async () => {
    if (!window.confirm(`「${draft.title}」を削除します。元に戻せません。よろしいですか？`)) return;
    setNotice({ kind: "wait", text: "削除しています…" });
    const res = await adminApi(`/api/admin/article?slug=${encodeURIComponent(draft.slug)}`, { method: "DELETE" });
    if (!res.ok) {
      setNotice({ kind: "ng", text: res.data.message ?? "削除できませんでした。" });
      return;
    }
    setDirty(false);
    router.replace("/admin/articles");
  };

  const toggleGenre = (slug: string) =>
    update({ genres: draft.genres.includes(slug) ? draft.genres.filter((g) => g !== slug) : [...draft.genres, slug] });

  return (
    <div className="flex flex-col gap-5">
      <PageTitle>
        <Link href="/admin/articles" className="mr-2 text-base text-text-muted no-underline">
          ‹ 記事
        </Link>
        {isNew ? "新しい記事" : "記事の編集"}
      </PageTitle>

      <Card className="flex flex-col gap-4">
        <Field
          label="URL名"
          htmlFor="a-slug"
          hint={isNew ? "半角の英小文字・数字・ハイフン（-）。あとから変えられません（例：review-kitsune）" : "公開後のURLは変えられません"}
        >
          <div className="flex items-center gap-1 text-sm text-text-muted">
            /articles/
            <input
              id="a-slug"
              className={inputClass}
              value={draft.slug}
              disabled={!isNew}
              onChange={(e) => update({ slug: e.target.value.toLowerCase().trim() })}
            />
          </div>
        </Field>
        <Field label="タイトル" htmlFor="a-title" hint="検索される言葉（「人外 おすすめ」「獣人 同人」など）を自然に入れる">
          <input id="a-title" className={inputClass} value={draft.title} onChange={(e) => update({ title: e.target.value })} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="記事の種類" htmlFor="a-cat">
            <select id="a-cat" className={inputClass} value={draft.category} onChange={(e) => update({ category: e.target.value })}>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="公開日" htmlFor="a-date" hint="この日の0時（日本時間）に自動で公開されます">
            <input id="a-date" type="date" className={inputClass} value={draft.publishAt} onChange={(e) => update({ publishAt: e.target.value })} />
          </Field>
        </div>
        {draft.category === "guide" ? (
          <p className="text-sm text-text-muted">入門ガイドは、すべてのジャンルに関連する記事として扱われます。</p>
        ) : (
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1 text-[13px] font-bold text-text-sub">ジャンル（1つ以上）</legend>
            {GENRE_GROUPS.map((g) => (
              <div key={g.slug}>
                <span className="text-xs text-text-muted">{g.name}</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {g.genres.map((genre) => (
                    <button
                      key={genre.slug}
                      type="button"
                      aria-pressed={draft.genres.includes(genre.slug)}
                      onClick={() => toggleGenre(genre.slug)}
                      className="inline-flex min-h-11 items-center rounded-full border border-[#33363f] bg-[#1f2027] px-3 text-sm aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-on-accent"
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </fieldset>
        )}
        <Field label={`説明（${draft.description.length}字）`} htmlFor="a-desc" hint="一覧・検索結果・Xでシェアされたときに出ます。60〜120字くらいが目安">
          <textarea id="a-desc" className={`${inputClass} min-h-20`} value={draft.description} onChange={(e) => update({ description: e.target.value })} />
        </Field>
        <Field label="アイキャッチ" hint="選ばなければ、ジャンルの仮イラストが出ます">
          <div className="flex flex-wrap items-start gap-3">
            <div className="w-40 overflow-hidden rounded-sm border border-line">
              {draft.eyecatch ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={adminImageUrl(draft.eyecatch)} alt="アイキャッチ" className="aspect-video w-full object-cover" />
              ) : (
                <Illustration kind={draft.category === "guide" ? "guide" : (draft.genres[0] ?? "moon")} label="仮イラスト" />
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <select
                className={inputClass}
                value={draft.eyecatch}
                onChange={(e) => update({ eyecatch: e.target.value })}
                aria-label="アイキャッチの画像"
              >
                <option value="">仮イラスト（画像なし）</option>
                {draft.eyecatch && !eyecatches.some((i) => i.src === draft.eyecatch) && (
                  <option value={draft.eyecatch}>{draft.eyecatch}</option>
                )}
                {eyecatches.map((i) => (
                  <option key={i.src} value={i.src}>
                    {i.name}
                  </option>
                ))}
              </select>
              <button type="button" className={btn.small} onClick={() => setShowUpload((v) => !v)}>
                {showUpload ? "アップロードを閉じる" : "新しい画像をアップロード"}
              </button>
            </div>
          </div>
          {showUpload && (
            <ImageUploader
              folder="eyecatch"
              onUploaded={(src) => {
                update({ eyecatch: src });
                loadImages();
                setShowUpload(false);
              }}
            />
          )}
        </Field>
        <Field label="閨の主のひとこと" htmlFor="a-note" hint="書くと、本文の「## まとめ」の直前に枠が入ります。空ならなし">
          <textarea id="a-note" className={`${inputClass} min-h-20`} value={draft.authorNote} onChange={(e) => update({ authorNote: e.target.value })} />
        </Field>
        <label className="flex min-h-11 items-center gap-2 text-sm text-text-sub">
          <input type="checkbox" className="size-[18px] accent-accent" checked={draft.sponsored} onChange={(e) => update({ sponsored: e.target.checked })} />
          作品をもらって紹介する記事（記事に「PR」を表示）
        </label>
      </Card>

      <Card className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <b>本文</b>
          <div role="tablist" className="flex gap-1">
            {(["edit", "preview"] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-4 text-sm aria-selected:border-accent aria-selected:bg-accent aria-selected:text-on-accent"
              >
                {t === "edit" ? "編集" : "プレビュー"}
              </button>
            ))}
          </div>
        </div>
        {tab === "edit" ? (
          <>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {SNIPPETS.map((s) => (
                <button key={s.label} type="button" className={`${btn.small} shrink-0`} onClick={() => insert(s.text)}>
                  ＋{s.label}
                </button>
              ))}
            </div>
            <textarea
              ref={bodyRef}
              aria-label="本文"
              className={`${inputClass} min-h-[60vh] font-mono text-[14px] leading-relaxed`}
              value={draft.body}
              onChange={(e) => update({ body: e.target.value })}
            />
            <p className="text-xs text-text-muted">
              「## 」で始まる行が見出し（目次に入ります）。「## まとめ」の前に閨の主のひとことが入ります。部品の書き方はボタンで入れてから、中の文字を書き換えてください。
            </p>
          </>
        ) : (
          <MdxPreview body={draft.body} authorNote={draft.authorNote} />
        )}
      </Card>

      <div className="sticky bottom-0 -mx-4 flex flex-col gap-2 border-t border-line bg-bg/95 px-4 py-3 backdrop-blur">
        <NoticeBox notice={notice} />
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={btn.primary} onClick={save} disabled={notice?.kind === "wait"}>
            {isNew ? "保存して追加" : "保存する"}
          </button>
          {dirty && <span className="text-xs text-accent">保存していない変更があります</span>}
          {!isNew && (
            <>
              <a href={`/articles/${draft.slug}`} target="_blank" rel="noopener" className={btn.normal}>
                サイトで見る
              </a>
              <button type="button" className={`${btn.danger} ml-auto`} onClick={remove}>
                削除
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
