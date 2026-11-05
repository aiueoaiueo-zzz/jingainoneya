/** 診断の型と点数計算（ブラウザでもサーバーでも使う） */

export type DiagnosisOption = {
  key: string;
  name: string;
  /** グラフ用の短い名前 */
  short?: string;
  /** 仮イラストの種類 */
  image: string;
  description: string;
  /** 解説記事へのリンク */
  link?: string;
  linkText?: string;
  /** ジャンル一覧へのチップ */
  genres?: string[];
};

export type DiagnosisQuestion = {
  text: string;
  /** 「はい」のとき各結果に入る点数 */
  yes: Record<string, number>;
  /** 「いいえ」のとき各結果に入る点数 */
  no: Record<string, number>;
};

export type DiagnosisData = {
  id: string;
  title: string;
  chartLabel: string;
  options: DiagnosisOption[];
  questions: DiagnosisQuestion[];
};

export type Answer = "yes" | "no";

export type ScoredOption = DiagnosisOption & {
  /** 相性（%）＝獲得点 ÷ その結果が取りうる最高点 */
  pct: number;
  /** 獲得点 */
  raw: number;
};

/** 相性の高い順に並べた結果 */
export function scoreDiagnosis(data: DiagnosisData, answers: Answer[]): ScoredOption[] {
  const score: Record<string, number> = {};
  const max: Record<string, number> = {};
  for (const o of data.options) {
    score[o.key] = 0;
    max[o.key] = 0;
  }
  data.questions.forEach((q, i) => {
    for (const o of data.options) {
      max[o.key] += Math.max(q.yes[o.key] ?? 0, q.no[o.key] ?? 0);
    }
    const picked = answers[i] === "yes" ? q.yes : q.no;
    for (const [key, value] of Object.entries(picked)) {
      if (key in score) score[key] += value;
    }
  });
  return data.options
    .map((o) => ({
      ...o,
      pct: max[o.key] ? Math.round((score[o.key] / max[o.key]) * 100) : 0,
      raw: score[o.key],
    }))
    .sort((a, b) => b.pct - a.pct || b.raw - a.raw);
}

/** Xの投稿画面のURL */
export function shareUrl(data: DiagnosisData, top: ScoredOption, pageUrl: string): string {
  const name = data.title.replace(/^あなたの/, "");
  const text = `人外ノ閨の『${name}』で、私は『${top.name}』でした（相性${top.pct}%）\n#人外ノ閨診断 #人外`;
  return `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(pageUrl)}`;
}
