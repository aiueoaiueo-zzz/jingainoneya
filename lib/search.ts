import { findCategory, findGenre } from "@/lib/site";
import type { Article } from "@/lib/types";

export type SearchQuery = {
  /** キーワード（スペース区切りで複数） */
  q: string;
  /** 記事の種類（どれか） */
  categories: string[];
  /** ジャンル（どれか） */
  genres: string[];
};

function toList(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return (Array.isArray(value) ? value : [value]).flatMap((v) => v.split(",")).filter(Boolean);
}

/** URLのクエリ（?q=…&c=guide&g=kemono）を読み取る */
export function parseSearchQuery(params: Record<string, string | string[] | undefined>): SearchQuery {
  const q = params.q;
  return {
    q: (Array.isArray(q) ? q[0] : q) ?? "",
    categories: toList(params.c).filter((c) => findCategory(c)),
    genres: toList(params.g).filter((g) => findGenre(g)),
  };
}

/** 条件をURLのクエリにする */
export function toSearchParams(query: SearchQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.q.trim()) params.set("q", query.q.trim());
  for (const c of query.categories) params.append("c", c);
  for (const g of query.genres) params.append("g", g);
  return params;
}

/**
 * 絞り込み。
 * - 種類どうし・ジャンルどうしは「どれか」、種類とジャンルの間は「両方」
 * - キーワードは、タイトル・説明・タグ名（種類名・ジャンル名）に、すべての語を含むもの
 */
export function searchArticles(articles: Article[], query: SearchQuery): Article[] {
  const words = query.q.trim().split(/[\s　]+/).filter(Boolean);
  return articles.filter((a) => {
    if (query.categories.length > 0 && !query.categories.includes(a.category)) return false;
    if (query.genres.length > 0 && !a.genres.some((g) => query.genres.includes(g))) return false;
    const fields = [
      a.title,
      a.description,
      findCategory(a.category)?.name ?? "",
      ...a.genres.map((g) => findGenre(g)?.name ?? ""),
    ];
    return words.every((w) => fields.some((f) => f.includes(w)));
  });
}
