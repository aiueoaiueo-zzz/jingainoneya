import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { getPublishedArticles } from "@/lib/articles";
import { ArticleList, FeatureArticle } from "./ArticleList";

/** 新着記事：最新1本を大きく、その下に8本。下に「すべての記事を見る（件数）」 */
export async function LatestArticles() {
  const articles = await getPublishedArticles();
  const [first, ...rest] = articles;
  return (
    <section aria-labelledby="latest-heading">
      <SectionHeading id="latest-heading" title="新着記事" />
      {first ? (
        <>
          <FeatureArticle article={first} />
          <ArticleList articles={rest.slice(0, 8)} />
          <p className="mt-3.5 text-center">
            <Link
              href="/search"
              className="inline-flex h-11 items-center justify-center rounded-sm border border-line-strong px-5 font-medium no-underline"
            >
              すべての記事を見る（{articles.length}件）
            </Link>
          </p>
        </>
      ) : (
        <p className="py-10 text-center text-text-muted">まだ記事がありません。</p>
      )}
    </section>
  );
}
