import type { Metadata } from "next";
import { ArticleListAdmin } from "@/components/admin/ArticleListAdmin";

export const metadata: Metadata = { title: "記事" };

export default function AdminArticlesPage() {
  return <ArticleListAdmin />;
}
