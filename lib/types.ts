/** 記事などの型（ステップ3で前付け・ジャンル・診断の型を追加する） */

/** 記事（content/articles/*.mdx） */
export type ArticleMeta = {
  slug: string;
  title: string;
  /** 記事の種類の表示名 */
  label: string;
  /** 公開日（YYYY-MM-DD） */
  publishedAt: string;
  description: string;
};
