import { Breadcrumb } from "@/components/Breadcrumb";
import type { Article } from "@/lib/types";
import { ArticleList } from "./ArticleList";
import { WithSidebar } from "./WithSidebar";

type Props = {
  title: string;
  crumbs: { href?: string; label: string }[];
  articles: Article[];
  /** 見出しの下に入れるもの（ジャンルの「良さ」、種類の切り替えチップなど） */
  children?: React.ReactNode;
};

/** 記事一覧ページの共通の形（ジャンル別・種類別・検索） */
export function ListPage({ title, crumbs, articles, children }: Props) {
  return (
    <>
      <Breadcrumb items={crumbs} />
      <WithSidebar>
        <div className="mb-3.5 flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="text-[26px]">{title}</h1>
          <span className="text-xs text-text-muted">{articles.length}件</span>
        </div>
        {children}
        {articles.length > 0 ? (
          <ArticleList articles={articles} />
        ) : (
          <p className="py-10 text-center text-text-muted">
            まだ記事がありません。ほかのジャンルやタグも探してみてください。
          </p>
        )}
      </WithSidebar>
    </>
  );
}
