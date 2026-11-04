import { ARTICLES } from "@/content/articles";
import type { ArticleMeta } from "@/lib/types";

export function getArticles(limit?: number): ArticleMeta[] {
  return limit === undefined ? ARTICLES : ARTICLES.slice(0, limit);
}

export function getArticle(slug: string): ArticleMeta | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
