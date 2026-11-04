import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComingSoon } from "@/components/ComingSoon";
import { GENRES, findGenre } from "@/lib/site";

export function generateStaticParams() {
  return GENRES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/genres/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${findGenre(slug)?.name ?? "ジャンル"}の作品` };
}

/** ジャンル別一覧（土台編では空ページ） */
export default async function GenrePage({ params }: PageProps<"/genres/[slug]">) {
  const { slug } = await params;
  const genre = findGenre(slug);
  if (!genre) notFound();
  return <ComingSoon title={`${genre.name}の作品`} crumbs={[{ label: genre.name }]} />;
}
