import type { Metadata } from "next";
import { Suspense } from "react";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { Loading } from "@/components/admin/ui";

export const metadata: Metadata = { title: "記事の編集" };

export default function AdminArticleEditPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ArticleEditor />
    </Suspense>
  );
}
