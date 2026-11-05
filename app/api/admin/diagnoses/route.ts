import { listDir } from "@/lib/admin/github";
import { adminHandler, ok } from "@/lib/admin/respond";
import { getText } from "@/lib/admin/github";

const DIR = "content/data/diagnoses";

/** 診断の一覧 */
export async function GET() {
  return adminHandler(async () => {
    const entries = (await listDir(DIR)).filter((e) => e.name.endsWith(".json"));
    const list = await Promise.all(
      entries.map(async (e) => {
        const file = await getText(e.path);
        const data = JSON.parse(file?.text ?? "{}") as { title?: string; questions?: unknown[]; options?: unknown[] };
        return {
          id: e.name.replace(/\.json$/, ""),
          title: data.title ?? "",
          questions: data.questions?.length ?? 0,
          options: data.options?.length ?? 0,
        };
      }),
    );
    return ok({ diagnoses: list });
  });
}
