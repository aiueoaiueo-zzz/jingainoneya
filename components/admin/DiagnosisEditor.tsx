"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ILLUSTRATIONS } from "@/components/article/illustrations";
import { Illustration } from "@/components/article/Illustration";
import { type DiagnosisData, type DiagnosisOption, scoreDiagnosis } from "@/lib/diagnosis";
import { GENRES } from "@/lib/site";
import { REBUILD_NOTE, adminApi } from "./api";
import { Card, Field, Loading, type Notice, NoticeBox, PageTitle, btn, inputClass } from "./ui";

const KINDS = Object.keys(ILLUSTRATIONS);

export function DiagnosisEditor() {
  const id = useSearchParams().get("id") ?? "";
  const [data, setData] = useState<DiagnosisData | null>(null);
  const [sha, setSha] = useState<string>();
  const [notice, setNotice] = useState<Notice>(null);
  const [dirty, setDirty] = useState(false);
  const [newKey, setNewKey] = useState("");

  useEffect(() => {
    adminApi<{ data: DiagnosisData; sha: string }>(`/api/admin/diagnosis?id=${encodeURIComponent(id)}`).then((res) => {
      if (res.ok) {
        setData(res.data.data);
        setSha(res.data.sha);
      } else setNotice({ kind: "ng", text: res.data.message ?? "読み込めませんでした。" });
    });
  }, [id]);

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  if (!data) return notice ? <NoticeBox notice={notice} /> : <Loading />;

  const set = (next: DiagnosisData) => {
    setData(next);
    setDirty(true);
  };
  const setOption = (i: number, patch: Partial<DiagnosisOption>) =>
    set({ ...data, options: data.options.map((o, j) => (j === i ? { ...o, ...patch } : o)) });
  const setQuestion = (i: number, patch: Partial<DiagnosisData["questions"][number]>) =>
    set({ ...data, questions: data.questions.map((q, j) => (j === i ? { ...q, ...patch } : q)) });
  const setPoint = (qi: number, side: "yes" | "no", key: string, value: number) => {
    const q = data.questions[qi];
    setQuestion(qi, { [side]: { ...q[side], [key]: Math.max(0, Math.min(9, value)) } });
  };
  const moveQuestion = (i: number, d: -1 | 1) => {
    const qs = [...data.questions];
    const j = i + d;
    if (j < 0 || j >= qs.length) return;
    [qs[i], qs[j]] = [qs[j], qs[i]];
    set({ ...data, questions: qs });
  };

  // 全部「はい」と全部「いいえ」のときの結果（点数の偏りを確かめる目安）
  const allYes = scoreDiagnosis(data, data.questions.map(() => "yes"))[0];
  const allNo = scoreDiagnosis(data, data.questions.map(() => "no"))[0];

  const save = async () => {
    setNotice({ kind: "wait", text: "確認して保存しています…" });
    const res = await adminApi<{ sha: string }>("/api/admin/diagnosis", { method: "PUT", json: { data, sha } });
    if (!res.ok) {
      setNotice({ kind: "ng", text: res.data.message ?? "保存できませんでした。" });
      return;
    }
    setSha(res.data.sha);
    setDirty(false);
    setNotice({ kind: "ok", text: REBUILD_NOTE });
  };

  return (
    <div className="flex flex-col gap-5">
      <PageTitle>
        <Link href="/admin/diagnoses" className="mr-2 text-base text-text-muted no-underline">
          ‹ 診断
        </Link>
        {data.title}
      </PageTitle>

      <Card className="flex flex-col gap-4">
        <Field label="診断の名前" htmlFor="d-title" hint={`記事では <Diagnosis id="${data.id}" /> で使えます`}>
          <input id="d-title" className={inputClass} value={data.title} onChange={(e) => set({ ...data, title: e.target.value })} />
        </Field>
        <Field label="相性グラフの見出し" htmlFor="d-chart">
          <input id="d-chart" className={inputClass} value={data.chartLabel} onChange={(e) => set({ ...data, chartLabel: e.target.value })} />
        </Field>
      </Card>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl">結果（{data.options.length}つ）</h2>
        {data.options.map((o, i) => (
          <Card key={o.key} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="w-24 shrink-0 overflow-hidden rounded-sm">
                <Illustration kind={o.image} label={o.name} />
              </span>
              <span className="text-xs text-text-muted">key：{o.key}</span>
              {data.options.length > 2 && (
                <button
                  type="button"
                  className={`${btn.small} ml-auto`}
                  onClick={() => {
                    if (!window.confirm(`結果「${o.name}」を削除します。設問の点数からも消えます。`)) return;
                    const strip = (m: Record<string, number>) => Object.fromEntries(Object.entries(m).filter(([k]) => k !== o.key));
                    set({
                      ...data,
                      options: data.options.filter((_, j) => j !== i),
                      questions: data.questions.map((q) => ({ ...q, yes: strip(q.yes), no: strip(q.no) })),
                    });
                  }}
                >
                  この結果を削除
                </button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="結果の名前">
                <input className={inputClass} value={o.name} onChange={(e) => setOption(i, { name: e.target.value })} />
              </Field>
              <Field label="グラフ用の短い名前（任意）">
                <input className={inputClass} value={o.short ?? ""} onChange={(e) => setOption(i, { short: e.target.value })} />
              </Field>
            </div>
            <Field label="説明文">
              <textarea className={`${inputClass} min-h-20`} value={o.description} onChange={(e) => setOption(i, { description: e.target.value })} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="イラスト">
                <select className={inputClass} value={o.image} onChange={(e) => setOption(i, { image: e.target.value })}>
                  {KINDS.map((k) => (
                    <option key={k} value={k}>
                      {GENRES.find((g) => g.slug === k)?.name ?? k}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="解説記事へのリンク（任意）" hint="例：/articles/kaii">
                <input className={inputClass} value={o.link ?? ""} onChange={(e) => setOption(i, { link: e.target.value })} />
              </Field>
              <Field label="ボタンの文字（任意）">
                <input className={inputClass} value={o.linkText ?? ""} onChange={(e) => setOption(i, { linkText: e.target.value })} />
              </Field>
            </div>
            <Field label="ジャンル一覧へのボタン（任意）">
              <div className="flex flex-wrap gap-1.5">
                {GENRES.map((g) => {
                  const on = (o.genres ?? []).includes(g.slug);
                  return (
                    <button
                      key={g.slug}
                      type="button"
                      aria-pressed={on}
                      onClick={() =>
                        setOption(i, { genres: on ? (o.genres ?? []).filter((x) => x !== g.slug) : [...(o.genres ?? []), g.slug] })
                      }
                      className="inline-flex min-h-11 items-center rounded-full border border-[#33363f] bg-[#1f2027] px-3 text-[13px] aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-on-accent"
                    >
                      {g.name}
                    </button>
                  );
                })}
              </div>
            </Field>
          </Card>
        ))}
        <Card className="flex flex-wrap items-end gap-2">
          <Field label="結果を追加（key を決める：半角英小文字・数字・_）" htmlFor="d-newkey">
            <input id="d-newkey" className={inputClass} value={newKey} onChange={(e) => setNewKey(e.target.value.toLowerCase())} />
          </Field>
          <button
            type="button"
            className={btn.normal}
            disabled={!/^[a-z0-9_]+$/.test(newKey) || data.options.some((o) => o.key === newKey)}
            onClick={() => {
              set({ ...data, options: [...data.options, { key: newKey, name: "新しい結果", image: "moon", description: "説明文" }] });
              setNewKey("");
            }}
          >
            追加
          </button>
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl">設問（{data.questions.length}問）</h2>
        <p className="text-sm text-text-muted">
          「はい」「いいえ」を選んだときに、それぞれの結果へ入る点数（0〜9）です。相性は「もらった点 ÷ その結果が取りうる最高点」で計算されます。
        </p>
        {data.questions.map((q, qi) => (
          <Card key={qi} className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <b className="text-accent">Q{qi + 1}</b>
              <div className="ml-auto flex gap-1">
                <button type="button" className={btn.small} onClick={() => moveQuestion(qi, -1)} disabled={qi === 0} aria-label="上へ">
                  ↑
                </button>
                <button type="button" className={btn.small} onClick={() => moveQuestion(qi, 1)} disabled={qi === data.questions.length - 1} aria-label="下へ">
                  ↓
                </button>
                <button
                  type="button"
                  className={btn.small}
                  onClick={() => window.confirm(`Q${qi + 1}を削除します。`) && set({ ...data, questions: data.questions.filter((_, j) => j !== qi) })}
                >
                  削除
                </button>
              </div>
            </div>
            <textarea aria-label={`Q${qi + 1}の質問文`} className={`${inputClass} min-h-16`} value={q.text} onChange={(e) => setQuestion(qi, { text: e.target.value })} />
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-xs text-text-muted">
                  <th className="py-1 text-left font-medium">結果</th>
                  <th className="w-20 py-1 font-medium">はい</th>
                  <th className="w-20 py-1 font-medium">いいえ</th>
                </tr>
              </thead>
              <tbody>
                {data.options.map((o) => (
                  <tr key={o.key} className="border-t border-line">
                    <td className="py-1 pr-2 text-text-sub">{o.short || o.name}</td>
                    {(["yes", "no"] as const).map((side) => (
                      <td key={side} className="py-1 text-center">
                        <input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          max={9}
                          aria-label={`Q${qi + 1} ${side === "yes" ? "はい" : "いいえ"} ${o.name}`}
                          className="h-11 w-16 rounded-sm border border-line-strong bg-bg text-center"
                          value={q[side][o.key] ?? 0}
                          onChange={(e) => setPoint(qi, side, o.key, Number(e.target.value) || 0)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ))}
        <button
          type="button"
          className={btn.normal}
          onClick={() => set({ ...data, questions: [...data.questions, { text: "新しい質問？", yes: {}, no: {} }] })}
        >
          ＋ 設問を追加
        </button>
        <p className="text-xs text-text-muted">
          目安：全部「はい」なら「{allYes?.name}」、全部「いいえ」なら「{allNo?.name}」になります。
        </p>
      </section>

      <div className="sticky bottom-0 -mx-4 flex flex-col gap-2 border-t border-line bg-bg/95 px-4 py-3 backdrop-blur">
        <NoticeBox notice={notice} />
        <div className="flex items-center gap-2">
          <button type="button" className={btn.primary} onClick={save} disabled={notice?.kind === "wait"}>
            保存する
          </button>
          {dirty && <span className="text-xs text-accent">保存していない変更があります</span>}
        </div>
      </div>
    </div>
  );
}
