import { getText, putFile } from "@/lib/admin/github";
import { adminHandler, bad, ok } from "@/lib/admin/respond";
import type { DiagnosisData } from "@/lib/diagnosis";
import { validateDiagnosis } from "@/lib/diagnoses";

const pathOf = (id: string) => `content/data/diagnoses/${id}.json`;
const ID = /^[a-z0-9_]+$/;

export async function GET(request: Request) {
  return adminHandler(async () => {
    const id = new URL(request.url).searchParams.get("id") ?? "";
    if (!ID.test(id)) return bad("診断のIDが正しくありません。");
    const file = await getText(pathOf(id));
    if (!file) return bad("診断が見つかりません。", 404);
    return ok({ data: JSON.parse(file.text) as DiagnosisData, sha: file.sha });
  });
}

/** 診断を保存する（既存の診断の上書きのみ） */
export async function PUT(request: Request) {
  return adminHandler(async () => {
    const input = (await request.json().catch(() => ({}))) as { data?: DiagnosisData; sha?: string };
    const data = input.data;
    if (!data || !ID.test(String(data.id ?? ""))) return bad("内容が正しくありません。");
    const clean: DiagnosisData = {
      id: data.id,
      title: String(data.title ?? "").trim(),
      chartLabel: String(data.chartLabel ?? "").trim() || "タイプごとの相性",
      options: (data.options ?? []).map((o) => {
        const opt: DiagnosisData["options"][number] = {
          key: String(o.key ?? "").trim(),
          name: String(o.name ?? "").trim(),
          image: String(o.image ?? "moon"),
          description: String(o.description ?? "").trim(),
        };
        if (o.short?.trim()) opt.short = o.short.trim();
        if (o.link?.trim()) {
          opt.link = o.link.trim();
          opt.linkText = o.linkText?.trim() || `${opt.name}の解説記事を読む`;
        }
        if (o.genres && o.genres.length) opt.genres = o.genres.map(String);
        return opt;
      }),
      questions: (data.questions ?? []).map((qn) => ({
        text: String(qn.text ?? "").trim(),
        yes: Object.fromEntries(Object.entries(qn.yes ?? {}).filter(([, v]) => Number(v) > 0).map(([k, v]) => [k, Number(v)])),
        no: Object.fromEntries(Object.entries(qn.no ?? {}).filter(([, v]) => Number(v) > 0).map(([k, v]) => [k, Number(v)])),
      })),
    };
    if (!clean.title) return bad("診断の名前を入力してください。");
    if (clean.questions.length === 0) return bad("設問を1つ以上入れてください。");
    if (clean.questions.some((q) => !q.text)) return bad("空の設問があります。");
    if (clean.options.some((o) => !/^[a-z0-9_]+$/.test(o.key))) return bad("結果の key は半角英小文字・数字・_ にしてください。");
    if (new Set(clean.options.map((o) => o.key)).size !== clean.options.length) return bad("結果の key が重なっています。");
    if (clean.options.some((o) => !o.name || !o.description)) return bad("結果の名前と説明を入力してください。");
    try {
      validateDiagnosis(clean, `${clean.id}.json`);
    } catch (e) {
      return bad(e instanceof Error ? e.message : "診断の内容に問題があります。");
    }
    const existing = await getText(pathOf(clean.id));
    if (!existing) return bad("診断が見つかりません。", 404);
    if (input.sha && existing.sha !== input.sha) {
      return bad("この診断は、ほかの場所で先に変更されています。ページを読み込み直してから編集してください。", 409);
    }
    await putFile(pathOf(clean.id), `${JSON.stringify(clean, null, 2)}\n`, `診断を更新：${clean.title}（管理画面から）`, existing.sha);
    const saved = await getText(pathOf(clean.id));
    return ok({ ok: true, sha: saved?.sha });
  });
}
