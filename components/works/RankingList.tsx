"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRightIcon } from "@/components/layout/icons";
import { genreName, typeName } from "@/lib/labels";
import type { RankingPeriod, Work } from "@/lib/types";
import { Price } from "./Price";

type Props = {
  weekly: Work[];
  monthly: Work[];
  /** 見出しのレベル。トップでは h2、ランキングページでは h1 */
  headingLevel?: "h1" | "h2";
  note?: string;
};

const TABS: { key: RankingPeriod; label: string }[] = [
  { key: "weekly", label: "週間" },
  { key: "monthly", label: "月間" },
];

/** ランキング（週間・月間タブ） */
export function RankingList({ weekly, monthly, headingLevel = "h2", note }: Props) {
  const [period, setPeriod] = useState<RankingPeriod>("weekly");
  const Heading = headingLevel;
  const works = period === "weekly" ? weekly : monthly;
  const current = TABS.find((t) => t.key === period)!;

  return (
    <div>
      <div className="mb-3.5 flex flex-wrap items-baseline justify-between gap-3">
        <Heading id="ranking-heading" className="text-[21px]">
          ランキング
        </Heading>
        <div role="group" aria-label="集計期間" className="flex gap-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              aria-pressed={period === tab.key}
              onClick={() => setPeriod(tab.key)}
              className="relative h-9 rounded-full border border-line-strong px-4 text-[13px] font-bold text-text-sub after:absolute after:-inset-1 aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-on-accent"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <p className="-mt-1.5 mb-2 text-xs text-text-muted" aria-live="polite">
        {current.label}ランキング{note ? `｜${note}` : ""}
      </p>
      {works.length === 0 ? (
        <p className="py-10 text-center text-text-muted">集計中です。</p>
      ) : (
        <ol>
          {works.map((work, i) => {
            const meta = [work.circle, genreName(work), typeName(work)].filter(Boolean).join("｜");
            return (
              <li key={work.id} className="border-b border-line">
                <Link
                  href={`/works/${work.id}`}
                  className="flex items-center gap-3.5 py-3 no-underline"
                >
                  <span
                    className={`w-[34px] shrink-0 text-center font-display text-[26px] font-bold tabular-nums ${i < 3 ? "text-accent" : "text-text-muted"}`}
                  >
                    {i + 1}
                  </span>
                  <Thumb work={work} />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="leading-normal font-medium">{work.title}</span>
                    <span className="text-xs text-text-muted">{meta}</span>
                    <Price work={work} />
                  </span>
                  <ChevronRightIcon className="shrink-0 text-text-muted" />
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function Thumb({ work }: { work: Work }) {
  return (
    <span className="relative h-[72px] w-[54px] shrink-0 overflow-hidden rounded-md border border-[#2e3039] bg-placeholder">
      {work.imageUrl && (
        // 公式サンプル画像をそのまま表示する（保存・加工はしない）
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={work.imageUrl}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          className="absolute inset-0 size-full object-cover"
        />
      )}
    </span>
  );
}
