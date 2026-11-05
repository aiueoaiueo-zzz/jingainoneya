import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/seo";
import { CATEGORIES, GENRES } from "@/lib/site";

/** sitemap.xml（公開日前の記事は入れない。記事の一覧と同じく毎日0時に作り直す） */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticles();
  const latest = articles[0]?.publishAt;
  const page = (path: string, lastModified?: string): MetadataRoute.Sitemap[number] => ({
    url: absoluteUrl(path),
    ...(lastModified ? { lastModified } : {}),
  });
  return [
    page("/", latest),
    ...articles.map((a) => page(`/articles/${a.slug}`, a.publishAt)),
    ...GENRES.map((g) => page(`/genres/${g.slug}`)),
    ...CATEGORIES.map((c) => page(`/categories/${c.slug}`)),
    page("/search"),
    page("/about"),
    page("/operator"),
    page("/privacy"),
    page("/contact"),
  ];
}
