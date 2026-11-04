/** サイト全体で使う定数（ジャンル・作品タイプ・メニュー） */

export const SITE_NAME = "人外ノ閨";
export const SITE_CATCHCOPY = "ヒトでは満たされない夜に。";

export type Genre = {
  slug: string;
  name: string;
  /** 画像の代わりの枠に出す一文字 */
  glyph: string;
};

export const GENRES: readonly Genre[] = [
  { slug: "kemono", name: "獣人", glyph: "獣" },
  { slug: "monster", name: "モンスター", glyph: "魔" },
  { slug: "machine", name: "機械・ロボット", glyph: "機" },
  { slug: "ishu", name: "異種族ファンタジー", glyph: "異" },
] as const;

export type WorkTypeInfo = {
  slug: string;
  name: string;
};

export const WORK_TYPES: readonly WorkTypeInfo[] = [
  { slug: "doujinshi", name: "同人誌" },
  { slug: "cg", name: "CG集" },
  { slug: "voice", name: "音声" },
  { slug: "game", name: "ゲーム" },
] as const;

export function findGenre(slug: string): Genre | undefined {
  return GENRES.find((g) => g.slug === slug);
}

export function findWorkType(slug: string): WorkTypeInfo | undefined {
  return WORK_TYPES.find((t) => t.slug === slug);
}

/** 年齢確認の Cookie */
export const AGE_COOKIE_NAME = "jingai_neya_age_ok";
export const AGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30日
/** 「18歳未満です」を押したときの移動先（外部の一般サイト） */
export const UNDERAGE_REDIRECT_URL = "https://www.google.co.jp/";

export type MenuGroup = {
  heading: string;
  links: { href: string; label: string }[];
};

export const MENU: MenuGroup[] = [
  {
    heading: "ジャンルから探す",
    links: GENRES.map((g) => ({ href: `/genres/${g.slug}`, label: g.name })),
  },
  {
    heading: "作品タイプから探す",
    links: WORK_TYPES.map((t) => ({ href: `/types/${t.slug}`, label: t.name })),
  },
  {
    heading: "特集",
    links: [
      { href: "/sale", label: "セール情報" },
      { href: "/ranking", label: "ランキング" },
      { href: "/articles", label: "まとめ記事" },
    ],
  },
  {
    heading: "サイト情報",
    links: [
      { href: "/about", label: "このサイトについて" },
      { href: "/", label: "トップへ戻る" },
    ],
  },
];

export const FOOTER_LINKS = [
  { href: "/about", label: "このサイトについて" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/contact", label: "お問い合わせ" },
];
