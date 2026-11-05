import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComingSoon } from "@/components/ComingSoon";
import { CATEGORIES, findCategory } from "@/lib/site";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/categories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: findCategory(slug)?.name ?? "記事の種類" };
}

/** 記事の種類別一覧（ステップ4で作り込む） */
export default async function CategoryPage({ params }: PageProps<"/categories/[slug]">) {
  const { slug } = await params;
  const category = findCategory(slug);
  if (!category) notFound();
  return <ComingSoon title={category.name} />;
}
