import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComingSoon } from "@/components/ComingSoon";
import { WORK_TYPES, findWorkType } from "@/lib/site";

export function generateStaticParams() {
  return WORK_TYPES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/types/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${findWorkType(slug)?.name ?? "作品タイプ"}の作品` };
}

/** 作品タイプ別一覧（土台編では空ページ） */
export default async function TypePage({ params }: PageProps<"/types/[slug]">) {
  const { slug } = await params;
  const type = findWorkType(slug);
  if (!type) notFound();
  return <ComingSoon title={`${type.name}の作品`} crumbs={[{ label: type.name }]} />;
}
