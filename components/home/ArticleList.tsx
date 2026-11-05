import Link from "next/link";
import { ArticleLabels } from "@/components/article/ArticleLabels";
import { Eyecatch } from "@/components/article/Eyecatch";
import type { Article } from "@/lib/types";

/** 記事の一覧（左にアイキャッチ、右にタイトルと説明） */
export function ArticleList({ articles }: { articles: Article[] }) {
  return (
    <div className="flex flex-col">
      {articles.map((article) => (
        <ArticleRow key={article.slug} article={article} />
      ))}
    </div>
  );
}

export function ArticleRow({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="flex gap-4 border-b border-line py-4 no-underline"
    >
      <Eyecatch article={article} className="w-[104px] shrink-0 self-start min-[481px]:w-[132px]" />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <ArticleLabels article={article} />
        <b className="text-base leading-normal">{article.title}</b>
        <span className="line-clamp-2 text-[13px] text-text-muted">{article.description}</span>
      </span>
    </Link>
  );
}

/** いちばん新しい記事を大きく出す */
export function FeatureArticle({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="mb-5 flex flex-wrap gap-5 no-underline"
    >
      <Eyecatch article={article} className="min-w-0 flex-[1_1_280px]" />
      <span className="flex min-w-0 flex-[999_1_260px] flex-col gap-2">
        <ArticleLabels article={article} />
        <h3 className="text-[22px]">{article.title}</h3>
        <span className="line-clamp-2 text-[13px] text-text-muted">{article.description}</span>
      </span>
    </Link>
  );
}
