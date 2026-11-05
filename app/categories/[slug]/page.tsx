import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Chip } from "@/components/home/Chip";
import { ListPage } from "@/components/home/ListPage";
import { getPublishedArticles } from "@/lib/articles";
import { CATEGORIES, findCategory } from "@/lib/site";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/categories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = findCategory(slug);
  return category
    ? { title: category.name, description: `人外ノ閨の「${category.name}」の記事一覧です。` }
    : {};
}

/** 記事の種類別一覧：種類の切り替えチップと記事一覧 */
export default async function CategoryPage({ params }: PageProps<"/categories/[slug]">) {
  const { slug } = await params;
  const category = findCategory(slug);
  if (!category) notFound();
  const articles = (await getPublishedArticles()).filter((a) => a.category === slug);
  return (
    <ListPage title={category.name} crumbs={[{ label: category.name }]} articles={articles}>
      <nav aria-label="記事の種類" className="mb-1.5 flex gap-2 overflow-x-auto pb-1.5">
        {CATEGORIES.map((c) => (
          <Chip key={c.slug} href={`/categories/${c.slug}`} current={c.slug === slug}>
            {c.name}
          </Chip>
        ))}
      </nav>
    </ListPage>
  );
}
