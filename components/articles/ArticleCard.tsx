import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { ArticleMeta } from "@/lib/types";

export function ArticleCard({ article }: { article: ArticleMeta }) {
  return (
    <Link href={`/articles/${article.slug}`} className="flex flex-col gap-2 no-underline">
      <div className="flex aspect-video items-center justify-center rounded-card border border-[#2e3039] bg-placeholder text-xs text-text-muted">
        アイキャッチ画像
      </div>
      <small className="text-xs font-bold text-accent">{article.label}</small>
      <b className="text-base leading-normal">{article.title}</b>
      <time dateTime={article.publishedAt} className="text-xs text-text-muted">
        {formatDate(article.publishedAt)}
      </time>
    </Link>
  );
}
