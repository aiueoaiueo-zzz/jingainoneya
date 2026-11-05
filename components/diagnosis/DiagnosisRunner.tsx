"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Illustration } from "@/components/article/Illustration";
import { chipClass } from "@/components/home/Chip";
import { type Answer, type DiagnosisData, scoreDiagnosis } from "@/lib/diagnosis";
import { findGenre } from "@/lib/site";
import { CrowdResult } from "./CrowdResult";
import { recordResult } from "./record";
import { ScoreBars } from "./ScoreBars";
import { ShareButton } from "./ShareButton";
import { TugBar } from "./TugBar";

const smallBtn =
  "inline-flex h-11 items-center justify-center rounded-sm border border-line-strong px-3.5 text-[13px] font-medium";

/** はい・いいえで1問ずつ答える診断 */
export function DiagnosisRunner({ data }: { data: DiagnosisData }) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const n = data.questions.length;
  const i = answers.length;
  const done = i >= n;
  const result = done ? scoreDiagnosis(data, answers) : null;
  const top = result?.[0];
  const recorded = useRef(false);

  // 結果が出た時点で1回だけ記録する
  useEffect(() => {
    if (top && !recorded.current) {
      recorded.current = true;
      recordResult(data.id, top.key);
    }
  }, [top, data.id]);

  const back = () => setAnswers((a) => a.slice(0, -1));
  const reset = () => setAnswers([]);

  return (
    <div
      aria-live="polite"
      className="my-4 mb-5.5 overflow-hidden rounded-[14px] border border-accent bg-surface"
    >
      <div className="flex flex-col border-b border-line bg-surface-2 px-4 py-2.5">
        <span className="text-[11px] font-bold tracking-[0.14em] text-accent">YES / NO 診断・全{n}問</span>
        <b className="font-display text-[17px]">{data.title}</b>
      </div>
      <div className="flex min-h-[170px] flex-col gap-3 px-4 pt-4.5 pb-5">
        {!done ? (
          <>
            <div className="flex items-center gap-2.5 text-xs font-bold text-text-muted">
              <span>
                Q{i + 1} / {n}
              </span>
              <span className="h-1 flex-1 overflow-hidden rounded-sm bg-line-strong">
                <i className="block h-full bg-accent" style={{ width: `${(i / n) * 100}%` }} />
              </span>
            </div>
            <b className="text-lg leading-[1.55]">{data.questions[i].text}</b>
            <div className="mt-1 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setAnswers((a) => [...a, "yes"])}
                className="inline-flex h-13 items-center justify-center rounded-sm border border-accent bg-accent text-base font-bold text-on-accent"
              >
                はい
              </button>
              <button
                type="button"
                onClick={() => setAnswers((a) => [...a, "no"])}
                className="inline-flex h-13 items-center justify-center rounded-sm border border-line-strong text-base font-medium"
              >
                いいえ
              </button>
            </div>
            {i > 0 && (
              <div className="flex flex-wrap gap-2">
                <button type="button" className={smallBtn} onClick={back}>
                  ひとつ戻る
                </button>
              </div>
            )}
          </>
        ) : (
          result &&
          top && (
            <>
              <span className="text-xs font-bold tracking-[0.08em] text-text-muted">
                診断結果：あなたにいちばん合うのは
              </span>
              <div className="flex flex-wrap items-center gap-3 rounded-card border border-accent bg-surface-2 p-2.5">
                <span className="block w-[120px] shrink-0 overflow-hidden rounded-sm">
                  <Illustration kind={top.image} label={top.name} />
                </span>
                <div className="min-w-0 flex-[1_1_180px]">
                  <b className="font-display text-[21px] leading-[1.45] text-accent">{top.name}</b>
                  <p className="text-[13px] text-text-sub">{top.description}</p>
                </div>
              </div>
              <span className="mt-1 text-xs font-bold tracking-[0.08em] text-text-muted">{data.chartLabel}</span>
              {data.options.length === 2 ? (
                <TugBar
                  left={result.find((o) => o.key === data.options[0].key)!}
                  right={result.find((o) => o.key === data.options[1].key)!}
                />
              ) : (
                <ScoreBars
                  bars={result.map((o) => ({ key: o.key, label: o.short ?? o.name, image: o.image, pct: o.pct }))}
                  label={`相性：${result.map((o) => `${o.name} ${o.pct}%`).join("、")}`}
                />
              )}
              {top.link && (
                <Link
                  href={top.link}
                  className="inline-flex min-h-11 items-center justify-center self-start rounded-sm border border-accent bg-accent px-5 py-2 font-bold text-on-accent no-underline"
                >
                  {top.linkText ?? `${top.name}の解説記事を読む`}
                </Link>
              )}
              {top.genres && top.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {top.genres.map((g) => (
                    <Link key={g} href={`/genres/${g}`} className={chipClass}>
                      {findGenre(g)?.name}の記事一覧
                    </Link>
                  ))}
                </div>
              )}
              <ShareButton data={data} top={top} />
              <CrowdResult data={data} />
              <div className="flex flex-wrap gap-2">
                <button type="button" className={smallBtn} onClick={back}>
                  ひとつ戻る
                </button>
                <button type="button" className={smallBtn} onClick={reset}>
                  最初からやり直す
                </button>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}
