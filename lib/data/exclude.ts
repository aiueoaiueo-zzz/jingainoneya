import type { Work } from "@/lib/types";

/**
 * 表示しない作品を除外する。
 * site_settings.exclude_keywords の語が、タイトル・サークル名・ジャンル名に含まれる作品を外す。
 * （収集時は dmm-collector でも同じ判定をする）
 */
export function excludeWorks(works: Work[], keywords: string[]): Work[] {
  const words = keywords.map((k) => k.trim().toLowerCase()).filter(Boolean);
  if (words.length === 0) return works;
  return works.filter((work) => {
    const haystack = [work.title, work.circle, ...work.sourceGenres.map((g) => g.name)]
      .join("\n")
      .toLowerCase();
    return !words.some((w) => haystack.includes(w));
  });
}

export function discountRate(price: number, listPrice: number): number {
  if (listPrice <= 0 || price >= listPrice) return 0;
  return Math.round((1 - price / listPrice) * 100);
}
