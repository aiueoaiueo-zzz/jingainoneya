"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { chipClass } from "@/components/home/Chip";
import { CATEGORIES, GENRE_GROUPS, findCategory, findGenre } from "@/lib/site";
import { type SearchQuery, toSearchParams } from "@/lib/search";
import { KeywordInput } from "./KeywordInput";
import { SEARCH_INPUT_ID } from "./focus";

/**
 * タグとキーワードの選択欄。
 * 選んだ条件はURL（/search?q=…&c=…&g=…）に残すので、共有やブックマークができる。
 */
export function TagPicker({ initial }: { initial: SearchQuery }) {
  const router = useRouter();
  const [query, setQuery] = useState<SearchQuery>(initial);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const apply = (next: SearchQuery) => {
    const qs = toSearchParams(next).toString();
    router.replace(qs ? `/search?${qs}` : "/search", { scroll: false });
  };

  const update = (next: SearchQuery, delay = 0) => {
    setQuery(next);
    if (timer.current) clearTimeout(timer.current);
    if (delay === 0) apply(next);
    else timer.current = setTimeout(() => apply(next), delay);
  };

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const toggle = (list: string[], key: string) =>
    list.includes(key) ? list.filter((k) => k !== key) : [...list, key];

  const selected = [
    ...query.categories.map((c) => findCategory(c)?.name),
    ...query.genres.map((g) => findGenre(g)?.name),
  ].filter(Boolean);

  return (
    <form
      className="mb-5.5 flex flex-col gap-3.5"
      onSubmit={(e) => {
        e.preventDefault();
        update(query);
      }}
    >
      <div className="flex flex-wrap items-center gap-2.5">
        <label htmlFor={SEARCH_INPUT_ID} className="text-[13px] text-text-muted">
          キーワード
        </label>
        <KeywordInput value={query.q} onChange={(q) => update({ ...query, q }, 400)} />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-[13px] text-text-muted">記事の種類（選んだもののどれか）</legend>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              type="button"
              className={chipClass}
              aria-pressed={query.categories.includes(c.slug)}
              onClick={() => update({ ...query, categories: toggle(query.categories, c.slug) })}
            >
              {c.name}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-[13px] text-text-muted">ジャンル（選んだもののどれか）</legend>
        {GENRE_GROUPS.map((group) => (
          <div key={group.slug} className="flex flex-col gap-2">
            <span className="mt-1 text-xs text-text-muted">{group.name}</span>
            <div className="flex flex-wrap gap-2">
              {group.genres.map((g) => (
                <button
                  key={g.slug}
                  type="button"
                  className={chipClass}
                  aria-pressed={query.genres.includes(g.slug)}
                  onClick={() => update({ ...query, genres: toggle(query.genres, g.slug) })}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </fieldset>

      <div className="flex flex-wrap items-center gap-2 text-[13px] text-text-sub" aria-live="polite">
        {selected.length > 0
          ? `選択中：${selected.join("・")}`
          : "タグは複数選べます。種類とジャンルの両方を選ぶと、両方に当てはまる記事に絞り込みます。"}
        {(selected.length > 0 || query.q) && (
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-sm border border-line-strong px-3.5 text-[13px] font-medium"
            onClick={() => update({ q: "", categories: [], genres: [] })}
          >
            条件をクリア
          </button>
        )}
      </div>
    </form>
  );
}
