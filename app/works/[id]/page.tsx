import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComingSoon } from "@/components/ComingSoon";
import { getWork, getWorkIds } from "@/lib/data";
import { genreName } from "@/lib/labels";

export async function generateStaticParams() {
  const ids = await getWorkIds(50);
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<"/works/[id]">): Promise<Metadata> {
  const { id } = await params;
  const work = await getWork(id);
  return { title: work?.title ?? "作品詳細" };
}

/** 作品詳細（土台編では空ページ） */
export default async function WorkPage({ params }: PageProps<"/works/[id]">) {
  const { id } = await params;
  const work = await getWork(id);
  if (!work) notFound();

  const genre = genreName(work);
  const crumbs = [
    ...(genre && work.genre ? [{ href: `/genres/${work.genre}`, label: genre }] : []),
    { label: work.title },
  ];
  return <ComingSoon title={work.title} crumbs={crumbs} />;
}
