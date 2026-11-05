import { ARTICLE_DIR, readDraft } from "@/lib/admin/articles";
import { getText, listDir } from "@/lib/admin/github";
import { adminHandler, ok } from "@/lib/admin/respond";

/** 記事の一覧（GitHub にある最新の内容。予約中も含む） */
export async function GET() {
  return adminHandler(async () => {
    const entries = (await listDir(ARTICLE_DIR)).filter((e) => e.type === "file" && e.name.endsWith(".mdx"));
    const articles = await Promise.all(
      entries.map(async (e) => {
        const slug = e.name.replace(/\.mdx$/, "");
        const file = await getText(e.path);
        const d = readDraft(slug, file?.text ?? "");
        return { slug, title: d.title, category: d.category, genres: d.genres, publishAt: d.publishAt, eyecatch: d.eyecatch };
      }),
    );
    articles.sort((a, b) => b.publishAt.localeCompare(a.publishAt) || a.slug.localeCompare(b.slug));
    return ok({ articles });
  });
}
