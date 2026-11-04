/** 作品・ピックアップ・記事などの型 */

export type GenreSlug = "kemono" | "monster" | "machine" | "ishu";
export type WorkTypeSlug = "doujinshi" | "cg" | "voice" | "game";
export type RankingPeriod = "weekly" | "monthly";

/** APIが返すジャンル（FANZAのジャンルID・名前） */
export type SourceGenre = {
  id: number;
  name: string;
};

/** サイトで扱う作品（dmm_items の1行を画面向けに整えたもの） */
export type Work = {
  /** FANZAの content_id */
  id: string;
  title: string;
  /** サークル名（APIの maker） */
  circle: string;
  /** アフィリエイトリンク（購入ページ）。仮データでは null */
  affiliateUrl: string | null;
  /** APIが返す公式サンプル画像のURL。保存・加工はしない。仮データでは null */
  imageUrl: string | null;
  /** 現在の価格（円） */
  price: number;
  /** 通常価格（円） */
  listPrice: number;
  isOnSale: boolean;
  /** 割引率（%）。セールでなければ 0 */
  discountRate: number;
  /** セール終了日時（ISO 8601） */
  saleEndAt: string | null;
  /** APIが返したジャンル（生データ） */
  sourceGenres: SourceGenre[];
  /** サイト上のジャンル（site_settings.target_genres で対応付け） */
  genre: GenreSlug | null;
  /** 作品タイプ（同人誌・CG集・音声・ゲーム）。判定できなければ null */
  type: WorkTypeSlug | null;
  /** 発売日（YYYY-MM-DD） */
  releaseDate: string;
  reviewAverage: number | null;
  reviewCount: number;
};

/** 今週のピックアップ（pickups の1行＋作品） */
export type Pickup = {
  weekStart: string;
  score: number;
  /** 自分の紹介文 */
  comment: string;
  work: Work;
};

/** 記事（content/articles/*.mdx の meta） */
export type ArticleMeta = {
  slug: string;
  title: string;
  /** まとめ・入門ガイド・セール・特集など */
  label: string;
  /** 公開日（YYYY-MM-DD） */
  publishedAt: string;
  description: string;
};

/** site_settings の値 */
export type PickupRules = {
  /** 発売から何日以内を候補にするか */
  maxDaysSinceRelease: number;
};

export type TargetGenre = {
  /** FANZAのジャンルID */
  genreId: number;
  /** サイト上のジャンル */
  slug: GenreSlug;
};
