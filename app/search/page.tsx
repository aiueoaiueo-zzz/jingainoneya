import type { Metadata } from "next";
import { Suspense } from "react";
import { ListPage } from "@/components/home/ListPage";
import { KeywordInput } from "@/components/search/KeywordInput";
import { TagPicker } from "@/components/search/TagPicker";
import { getPublishedArticles } from "@/lib/articles";
import { parseSearchQuery, searchArticles } from "@/lib/search";

export const metadata: Metadata = {
  title: "タグとキーワードで探す",
  description: "記事の種類、ジャンル、キーワードを組み合わせて、人外ノ閨の記事を探せます。",
};

/** タグ＋キーワード検索。条件なしなら全記事 */
export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchResults searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchResults({ searchParams }: Pick<PageProps<"/search">, "searchParams">) {
  const query = parseSearchQuery(await searchParams);
  const articles = searchArticles(await getPublishedArticles(), query);
  return (
    <ListPage title="タグとキーワードで探す" crumbs={[{ label: "検索" }]} articles={articles}>
      <TagPicker initial={query} />
    </ListPage>
  );
}

function SearchFallback() {
  return (
    <div>
      <h1 className="mt-10 mb-3.5 text-[26px]">タグとキーワードで探す</h1>
      <KeywordInput placeholderOnly />
    </div>
  );
}
