import type { Metadata } from "next";
import type { MDXComponents } from "mdx/types";
import { notFound } from "next/navigation";
import { AuthorNote } from "@/components/article/AuthorNote";
import { headingId, textOf } from "@/components/article/headingId";
import { Toc } from "@/components/article/Toc";
import { Breadcrumb } from "@/components/Breadcrumb";
import { getPublishedArticle, getPublishedArticles } from "@/lib/articles";
import { formatDate } from "@/lib/format";
import { findCategory } from "@/lib/site";

// 公開前の記事や存在しない記事に、本物の404を返すため、ページを最後まで作ってから送る
export const ensureStatic = "navigation";

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  return article ? { title: article.title, description: article.description } : {};
}

/** 記事（ステップ4で、アイキャッチ・書いている人・関連記事などを足して仕上げる） */
export default async function ArticlePage({ params }: PageProps<"/articles/[slug]">) {
  const { slug } = await params;
  // 予約中（公開日が未来）や存在しない記事は404
  const article = await getPublishedArticle(slug);
  if (!article) notFound();
  const { default: Body } = await import(`@/content/articles/${slug}.mdx`);
  const category = findCategory(article.category);
  const firstHeading = article.headings[0];

  // 「##」見出し：最初の見出しの前に目次、「まとめ」の前に閨の主のひとことを入れる
  const components: MDXComponents = {
    h2: ({ children }) => {
      const text = textOf(children);
      return (
        <>
          {text === firstHeading && <Toc headings={article.headings} />}
          {text === "まとめ" && article.authorNote && <AuthorNote note={article.authorNote} />}
          <h2
            id={headingId(text)}
            className="mt-9 mb-3 scroll-mt-20 border-b border-line pb-1.5 text-xl"
          >
            {children}
          </h2>
        </>
      );
    },
  };

  return (
    <>
      <Breadcrumb
        items={[
          ...(category ? [{ href: `/categories/${category.slug}`, label: category.name }] : []),
          { label: "記事" },
        ]}
      />
      <article className="max-w-[680px]">
        <p className="text-xs text-text-muted">
          {category?.name}｜<time dateTime={article.publishAt}>{formatDate(article.publishAt)}</time>
        </p>
        <h1 className="mt-2 mb-2.5 text-[28px]">{article.title}</h1>
        <Body components={components} />
      </article>
    </>
  );
}
