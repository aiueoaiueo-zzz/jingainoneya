/**
 * サイト全体で使う定数と、ジャンル・記事の種類の読み込み。
 * ジャンルと記事の種類の中身は content/data/*.json にある（ここでは読み込むだけ）。
 */
import categoriesJson from "@/content/data/categories.json";
import genresJson from "@/content/data/genres.json";
import siteJson from "@/content/data/site.json";

/** サイト名・キャッチコピー・自己紹介など（content/data/site.json） */
export const SITE = siteJson;
export const SITE_NAME = siteJson.name;
export const SITE_CATCHCOPY = siteJson.catchcopy;
export const SITE_DESCRIPTION = siteJson.description;

export type Genre = {
  slug: string;
  name: string;
  /** このジャンルの「良さ」の一文 */
  good: string;
  /** 仮イラストの種類 */
  illustration: string;
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
      { href: "/privacy", label: "プライバシーポリシー" },
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
