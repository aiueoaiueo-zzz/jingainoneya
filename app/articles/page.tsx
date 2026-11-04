import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "特集・まとめ記事" };

/** 記事一覧（土台編では空ページ） */
export default function ArticlesPage() {
  return <ComingSoon title="特集・まとめ記事" crumbs={[{ label: "記事一覧" }]} />;
}
