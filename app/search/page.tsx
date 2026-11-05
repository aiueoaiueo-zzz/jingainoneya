import type { Metadata } from "next";
import Form from "next/form";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { KeywordInput } from "@/components/search/KeywordInput";

export const metadata: Metadata = { title: "タグで探す" };

/** タグ＋キーワード検索（ステップ4でタグと結果一覧を作り込む） */
export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <div>
      <Breadcrumb items={[{ label: "タグで探す" }]} />
      <h1 className="mb-4 text-[26px]">タグで探す</h1>
      <Form action="/search" className="flex flex-wrap items-center gap-2.5">
        <label htmlFor="search-q" className="text-[13px] text-text-muted">
          キーワード
        </label>
        <Suspense fallback={<KeywordInput placeholderOnly />}>
          <Keyword searchParams={searchParams} />
        </Suspense>
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-sm border border-accent bg-accent px-5 font-bold text-on-accent"
        >
          検索
        </button>
      </Form>
      <p className="py-10 text-center text-text-muted">タグと検索結果は準備中です。</p>
    </div>
  );
}

async function Keyword({ searchParams }: Pick<PageProps<"/search">, "searchParams">) {
  const { q } = await searchParams;
  return <KeywordInput defaultValue={Array.isArray(q) ? q[0] : q} />;
}
