import { ArticleList } from "@/components/home/ArticleList";
import { getRelatedArticles } from "@/lib/articles";
import type { Article } from "@/lib/types";

/** 関連記事3本（同じジャンルを持つ公開済みの記事。入門ガイドは全ジャンルに関連） */
export async function RelatedArticles({ article }: { article: Article }) {
  const related = await getRelatedArticles(article, 3);
  if (related.length === 0) return null;
  return (
    <section aria-labelledby="related-heading" className="mt-8">
      <h2 id="related-heading" className="mb-3 border-b border-line pb-1.5 text-xl">
        関連する記事
      </h2>
      <ArticleList articles={related} />
    </section>
  );
}
