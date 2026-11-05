import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListPage } from "@/components/home/ListPage";
import { getPublishedArticles } from "@/lib/articles";
import { GENRES, findGenre } from "@/lib/site";

export function generateStaticParams() {
  return GENRES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/genres/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const genre = findGenre(slug);
  return genre ? { title: `${genre.name}の記事`, description: genre.good } : {};
}

/** ジャンル別一覧：ジャンルの「良さ」一文と、そのジャンルの記事 */
export default async function GenrePage({ params }: PageProps<"/genres/[slug]">) {
  const { slug } = await params;
  const genre = findGenre(slug);
  if (!genre) notFound();
  const articles = (await getPublishedArticles()).filter((a) => a.genres.includes(slug));
  return (
    <ListPage
      title={`${genre.name}の記事`}
      crumbs={[{ label: `${genre.group}　›　${genre.name}` }]}
      articles={articles}
    >
      <p className="-mt-1 mb-3.5 text-text-sub">{genre.good}</p>
    </ListPage>
  );
}
