import { ARTICLE_DIR, type ArticleDraft, SLUG_PATTERN, checkDraft, readDraft, writeDraft } from "@/lib/admin/articles";
import { deleteFile, getText, putFile } from "@/lib/admin/github";
import { adminHandler, bad, ok } from "@/lib/admin/respond";

const pathOf = (slug: string) => `${ARTICLE_DIR}/${slug}.mdx`;

/** 記事を1本読む */
export async function GET(request: Request) {
  return adminHandler(async () => {
    const slug = new URL(request.url).searchParams.get("slug") ?? "";
    if (!SLUG_PATTERN.test(slug)) return bad("URL名が正しくありません。");
    const file = await getText(pathOf(slug));
    if (!file) return bad("記事が見つかりません。", 404);
    return ok({ draft: readDraft(slug, file.text), sha: file.sha });
  });
}

/** 記事を保存する（新規または上書き）。保存前に、作り直しで失敗しないかを確認する */
export async function PUT(request: Request) {
  return adminHandler(async () => {
    const input = (await request.json().catch(() => ({}))) as { draft?: ArticleDraft; sha?: string; isNew?: boolean };
    const d = input.draft;
    if (!d) return bad("内容がありません。");
    const draft: ArticleDraft = {
      slug: String(d.slug ?? "").trim(),
      title: String(d.title ?? "").trim(),
      category: String(d.category ?? ""),
      genres: Array.isArray(d.genres) ? d.genres.map(String) : [],
      publishAt: String(d.publishAt ?? ""),
      description: String(d.description ?? "").trim(),
      eyecatch: String(d.eyecatch ?? "").trim(),
      authorNote: String(d.authorNote ?? "").trim(),
      sponsored: d.sponsored === true,
      body: String(d.body ?? ""),
    };
    const problem = await checkDraft(draft);
    if (problem) return bad(problem);

    const existing = await getText(pathOf(draft.slug));
    if (input.isNew && existing) return bad("同じURL名の記事がすでにあります。別のURL名にしてください。");
    if (!input.isNew && !existing) return bad("元の記事が見つかりません。");
    if (existing && input.sha && existing.sha !== input.sha) {
      return bad("この記事は、ほかの場所で先に変更されています。ページを読み込み直してから編集してください。", 409);
    }
    await putFile(
      pathOf(draft.slug),
      writeDraft(draft),
      `${input.isNew ? "記事を追加" : "記事を更新"}：${draft.title}（管理画面から）`,
      existing?.sha,
    );
    const saved = await getText(pathOf(draft.slug));
    return ok({ ok: true, sha: saved?.sha });
  });
}

/** 記事を削除する */
export async function DELETE(request: Request) {
  return adminHandler(async () => {
    const slug = new URL(request.url).searchParams.get("slug") ?? "";
    if (!SLUG_PATTERN.test(slug)) return bad("URL名が正しくありません。");
    const file = await getText(pathOf(slug));
    if (!file) return bad("記事が見つかりません。", 404);
    await deleteFile(pathOf(slug), file.sha, `記事を削除：${slug}（管理画面から）`);
    return ok({ ok: true });
  });
}
