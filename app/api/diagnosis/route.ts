import { getDiagnosis, getDiagnosisIds } from "@/lib/diagnoses";
import { clientIp, hashValue, json } from "@/lib/security";
import { adminClient, isSupabaseConfigured, publicClient } from "@/lib/supabase/server";

async function knownDiagnosis(id: string) {
  if (!(await getDiagnosisIds()).includes(id)) return null;
  return getDiagnosis(id);
}

/** みんなの結果：診断ごとの、いちばん合った結果の件数 */
export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (!(await knownDiagnosis(id))) return json({ message: "診断が見つかりません。" }, 404);
  if (!isSupabaseConfigured()) return json({ counts: {}, configured: false });
  const { data, error } = await publicClient().rpc("diagnosis_counts", { p_diagnosis_id: id });
  if (error) {
    console.error("診断の集計の読み込みに失敗:", error.message);
    return json({ message: "集計を読み込めませんでした。" }, 500);
  }
  const counts: Record<string, number> = {};
  for (const row of (data ?? []) as { result_key: string; count: number }[]) {
    counts[row.result_key] = Number(row.count);
  }
  return json({ counts, configured: true });
}

type Body = { diagnosisId?: string; resultKey?: string; device?: string };

/** 結果の記録。同じ端末・同じ診断は1日1回まで（データベースの決まりで重複を防ぐ） */
export async function POST(request: Request) {
  const input = (await request.json().catch(() => ({}))) as Body;
  const id = String(input.diagnosisId ?? "");
  const key = String(input.resultKey ?? "");
  const diagnosis = await knownDiagnosis(id);
  if (!diagnosis || !diagnosis.options.some((o) => o.key === key)) {
    return json({ message: "診断の結果が正しくありません。" }, 400);
  }
  if (!isSupabaseConfigured()) return json({ recorded: false, configured: false });

  const device = String(input.device ?? "").slice(0, 100);
  const clientHash = hashValue(device ? `device:${device}` : `ip:${clientIp(request)}`);
  const { error } = await adminClient()
    .from("diagnosis_results")
    .insert({ diagnosis_id: id, result_key: key, client_hash: clientHash });
  if (error) {
    // 23505：同じ日にすでに記録済み
    if (error.code === "23505") return json({ recorded: false });
    console.error("診断結果の記録に失敗:", error.message);
    return json({ message: "記録できませんでした。" }, 500);
  }
  return json({ recorded: true });
}
