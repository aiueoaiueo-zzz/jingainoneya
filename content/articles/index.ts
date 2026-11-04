import type { ArticleMeta } from "@/lib/types";

/**
 * 記事の一覧。記事を増やすときは、同じフォルダに {slug}.mdx を置き、ここに1行足す。
 * 新しい順に並べる。
 */
export const ARTICLES: ArticleMeta[] = [
  {
    slug: "hajimete-no-jingai",
    title: "はじめての人外ジャンル入門",
    label: "入門ガイド",
    publishedAt: "2026-11-05",
    description: "[記事の説明文：検索結果やSNSに出る1〜2文]",
  },
];
