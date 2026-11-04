import type { Metadata } from "next";
import { Suspense } from "react";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "検索結果", robots: { index: false } };

/** 検索結果（土台編では空ページ） */
export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <ComingSoon title="検索結果" crumbs={[{ label: "検索" }]}>
      <Suspense>
        <Query searchParams={searchParams} />
      </Suspense>
    </ComingSoon>
  );
}

async function Query({ searchParams }: Pick<PageProps<"/search">, "searchParams">) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim();
  if (!query) return null;
  return <p className="mt-2 text-sm text-text-sub">検索語：「{query}」</p>;
}
