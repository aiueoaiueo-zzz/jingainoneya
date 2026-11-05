/** SEO 用の共通の値 */
import { SITE } from "@/lib/site";
import type { Article } from "@/lib/types";

/** 本番のURL（未設定なら手元の確認用） */
export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${siteUrl()}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** サイト共通のOGP画像（アイキャッチがない記事やページで使う） */
export const DEFAULT_OG_IMAGE = {
  url: "/images/og-default.png",
  width: 1200,
  height: 630,
  alt: `${SITE.name}｜${SITE.catchcopy}`,
};

/** 記事の構造化データ（Article と パンくず） */
export function articleJsonLd(article: Article, categoryName: string | undefined) {
  const url = absoluteUrl(`/articles/${article.slug}`);
  const image = absoluteUrl(article.eyecatch ?? DEFAULT_OG_IMAGE.url);
  const published = `${article.publishAt}T00:00:00+09:00`;
  const breadcrumbs = [
    { name: "トップ", url: absoluteUrl("/") },
    ...(categoryName ? [{ name: categoryName, url: absoluteUrl(`/categories/${article.category}`) }] : []),
    { name: article.title, url },
  ];
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      image: [image],
      datePublished: published,
      dateModified: published,
      author: { "@type": "Person", name: SITE.authorName, url: absoluteUrl("/operator") },
      publisher: { "@type": "Organization", name: SITE.name, url: absoluteUrl("/") },
      mainEntityOfPage: url,
      inLanguage: "ja",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: b.url,
      })),
    },
  ];
}

/** <script type="application/ld+json"> に安全に入れるための文字列 */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * ページごとのタイトル・説明・OGP（シェアされたときの表示）をまとめて作る。
 * タイトルは「ページ名｜人外ノ閨」になる。
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website" as const,
      title: `${title}｜${SITE.name}`,
      description,
      url: path,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: { card: "summary_large_image" as const, title: `${title}｜${SITE.name}`, description },
  };
}
