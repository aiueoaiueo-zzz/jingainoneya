"use client";

import { useState } from "react";
import type { DiagnosisData } from "@/lib/diagnosis";
import { ScoreBars } from "./ScoreBars";

type Counts = Record<string, number>;

/** みんなの結果。開いたときに集計を取りにいく */
export function CrowdResult({ data }: { data: DiagnosisData }) {
  const [state, setState] = useState<"idle" | "loading" | "error" | "done">("idle");
  const [counts, setCounts] = useState<Counts>({});

  const load = async () => {
    if (state === "loading" || state === "done") return;
    setState("loading");
    try {
      const res = await fetch(`/api/diagnosis?id=${encodeURIComponent(data.id)}`);
      if (!res.ok) throw new Error(String(res.status));
      const json = (await res.json()) as { counts: Counts };
      setCounts(json.counts ?? {});
      setState("done");
    } catch {
      setState("error");
    }
  };

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const bars = data.options
    .map((o) => ({
      key: o.key,
      label: o.short ?? o.name,
      image: o.image,
      pct: total ? Math.round(((counts[o.key] ?? 0) / total) * 100) : 0,
    }))
    .sort((a, b) => b.pct - a.pct);

  return (
    <details
      className="rounded-[10px] border border-line bg-bg px-3 py-2.5"
      onToggle={(e) => {
        if ((e.target as HTMLDetailsElement).open) void load();
      }}
    >
      <summary className="flex min-h-11 cursor-pointer items-center text-[13px] font-bold text-text-sub">
        みんなの結果を見る{state === "done" && total > 0 ? `（${total}人）` : ""}
      </summary>
      <div className="mt-2.5">
        {state === "loading" && <p className="text-[13px] text-text-muted">集計を読み込んでいます…</p>}
        {state === "error" && (
          <p className="text-[13px] text-text-muted">いまは集計を読み込めませんでした。時間をおいて開き直してください。</p>
        )}
        {state === "done" && total === 0 && (
          <p className="text-[13px] text-text-muted">まだ集計がありません。あなたが最初のひとりです。</p>
        )}
        {state === "done" && total > 0 && (
          <ScoreBars
            bars={bars}
            highlightTop={false}
            color="#6e7fa3"
            label={`みんなの結果：${bars.map((b) => `${b.label} ${b.pct}%`).join("、")}`}
          />
        )}
      </div>
    </details>
  );
}
