import { formatDate } from "@/lib/format";
import { findCategory, findGenre } from "@/lib/site";
import type { Article } from "@/lib/types";

/** 記事の種類・ジャンル・公開日（ジャンルが4つ以上なら「全ジャンル」） */
export function ArticleLabels({ article }: { article: Article }) {
  const genres =
    article.genres.length > 3
      ? ["全ジャンル"]
      : article.genres.map((g) => findGenre(g)?.name ?? g);
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs">
      <span className="font-bold text-accent">{findCategory(article.category)?.name}</span>
      {genres.map((name) => (
        <span
          key={name}
          className="rounded-full border border-line-strong px-2 text-[11px] text-text-sub"
        >
          {name}
        </span>
      ))}
      {article.sponsored && (
        <span className="rounded-full border border-accent px-2 text-[11px] font-bold text-accent">
          PR
        </span>
      )}
      <time dateTime={article.publishAt} className="text-text-muted">
        {formatDate(article.publishAt)}
      </time>
    </div>
  );
}
