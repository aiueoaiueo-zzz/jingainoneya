/** 記事の型 */

/** 記事（content/articles/<slug>.mdx の前付け＋本文の見出し） */
export type Article = {
  slug: string;
  title: string;
  /** 記事の種類（guide / genre / talk / matome / review） */
  category: string;
  /** ジャンルのslug。入門ガイドは全ジャンル */
  genres: string[];
  /** 公開日（YYYY-MM-DD）。この日の0時（日本時間）に公開 */
  publishAt: string;
  description: string;
  /** アイキャッチ画像のパス。なければ仮イラスト */
  eyecatch: string | null;
  /** 閨の主のひとこと */
  authorNote: string | null;
  /** 作品をもらって紹介する記事なら true（PRを表示） */
  sponsored: boolean;
  /** 本文の「##」見出し（目次用。「まとめ」は目次に入れない） */
  headings: string[];
  /** 本文に <Toc /> があれば、その場所に目次を出す（なければ最初の見出しの前） */
  hasTocMarker: boolean;
};
