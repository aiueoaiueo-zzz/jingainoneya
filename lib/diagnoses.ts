/** 診断の読み込み（content/data/diagnoses/<id>.json） */
import fs from "node:fs/promises";
import path from "node:path";
import { cacheLife } from "next/cache";
import type { DiagnosisData } from "@/lib/diagnosis";
import { GENRES } from "@/lib/site";

const DIR = path.join(process.cwd(), "content", "data", "diagnoses");

export function validateDiagnosis(data: DiagnosisData, file: string): DiagnosisData {
  const keys = new Set(data.options.map((o) => o.key));
  if (data.options.length < 2) throw new Error(`${file}：結果（options）は2つ以上必要です`);
  data.questions.forEach((q, i) => {
    for (const k of [...Object.keys(q.yes), ...Object.keys(q.no)]) {
      if (!keys.has(k)) throw new Error(`${file}：${i + 1}問目に、結果にない key「${k}」があります`);
    }
  });
  for (const o of data.options) {
    for (const g of o.genres ?? []) {
      if (!GENRES.some((x) => x.slug === g)) throw new Error(`${file}：知らないジャンル「${g}」があります`);
    }
  }
  return data;
}

export async function getDiagnosis(id: string): Promise<DiagnosisData> {
  "use cache";
  cacheLife("max");
  const file = `${id}.json`;
  let source: string;
  try {
    source = await fs.readFile(path.join(DIR, file), "utf8");
  } catch {
    throw new Error(`診断「${id}」が見つかりません（content/data/diagnoses/${file}）`);
  }
  return validateDiagnosis(JSON.parse(source) as DiagnosisData, file);
}

export async function getDiagnosisIds(): Promise<string[]> {
  const files = await fs.readdir(DIR);
  return files.filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));
}
