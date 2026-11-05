import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { getArticle, getArticles } from "@/lib/articles";
import { formatDate } from "@/lib/format";

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  return article ? { title: article.title, description: article.description } : {};
}

/** 記事詳細（content/articles/{slug}.mdx を表示） */
export default async function ArticlePage({ params }: PageProps<"/articles/[slug]">) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const { default: Body } = await import(`@/content/articles/${slug}.mdx`);

  return (
    <>
      <Breadcrumb items={[{ label: article.title }]} />
      <article className="max-w-[680px]">
        <small className="text-[13px] font-bold tracking-[0.1em] text-accent">{article.label}</small>
        <h1 className="mb-2 text-[28px] leading-[1.4]">{article.title}</h1>
        <p className="mb-6 text-xs text-text-muted">
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        </p>
        <Body />
      </article>
    </>
  );
}
