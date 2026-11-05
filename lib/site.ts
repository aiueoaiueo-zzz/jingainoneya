/**
 * サイト全体で使う定数と、ジャンル・記事の種類の読み込み。
 * ジャンルと記事の種類の中身は content/data/*.json にある（ここでは読み込むだけ）。
 */
import categoriesJson from "@/content/data/categories.json";
import genresJson from "@/content/data/genres.json";

export const SITE_NAME = "人外ノ閨";
export const SITE_CATCHCOPY = "ヒトでは満たされない夜に。";
export const SITE_DESCRIPTION =
  "人外好きが、人外好きのために選ぶ。獣人・竜・鬼・怪異・機械など、人ならざるものが登場する成人向け作品を紹介・語るブログ。";

export type Genre = {
  slug: string;
  name: string;
  /** 仮イラストの代わりに出す一文字 */
  glyph: string;
  /** 系統の名前 */
  group: string;
};

export type GenreGroup = {
  slug: string;
  name: string;
  genres: Genre[];
};

export type Category = {
  slug: string;
  name: string;
};

export const GENRE_GROUPS: GenreGroup[] = genresJson.groups.map((g) => ({
  slug: g.slug,
  name: g.name,
  genres: g.genres.map((genre) => ({ ...genre, group: g.name })),
}));

export const GENRES: Genre[] = GENRE_GROUPS.flatMap((g) => g.genres);

export const CATEGORIES: Category[] = categoriesJson.categories;

export function findGenre(slug: string): Genre | undefined {
  return GENRES.find((g) => g.slug === slug);
}

export function findCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

/** 年齢確認の Cookie */
export const AGE_COOKIE_NAME = "jingai_neya_age_ok";
export const AGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30日
/** 「18歳未満です」を押したときの移動先（一般向けの外部ページ） */
export const UNDERAGE_REDIRECT_URL = "https://www.google.co.jp/";

export type MenuGroup = {
  heading: string;
  links: { href: string; label: string }[];
};

/** ハンバーガーメニュー：記事の種類、5つの系統と各ジャンル、サイト情報 */
export const MENU: MenuGroup[] = [
  {
    heading: "記事の種類",
    links: [
      ...CATEGORIES.map((c) => ({ href: `/categories/${c.slug}`, label: c.name })),
      { href: "/search", label: "タグで探す" },
    ],
  },
  ...GENRE_GROUPS.map((g) => ({
    heading: g.name,
    links: g.genres.map((genre) => ({ href: `/genres/${genre.slug}`, label: genre.name })),
  })),
  {
    heading: "サイト情報",
    links: [
      { href: "/about", label: "このサイトについて" },
      { href: "/operator", label: "運営者情報" },
      { href: "/contact", label: "お問い合わせ" },
      { href: "/", label: "トップへ戻る" },
    ],
  },
];

export const FOOTER_LINKS = [
  { href: "/about", label: "このサイトについて" },
  { href: "/operator", label: "運営者情報" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/contact", label: "お問い合わせ" },
];
