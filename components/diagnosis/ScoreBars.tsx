import { Illustration } from "@/components/article/Illustration";

export type Bar = { key: string; label: string; image: string; pct: number };

/** 横棒グラフ（1位だけアクセント色）。みんなの結果では color で色を変える */
export function ScoreBars({
  bars,
  highlightTop = true,
  color,
  label,
}: {
  bars: Bar[];
  highlightTop?: boolean;
  color?: string;
  label: string;
}) {
  return (
    <div role="img" aria-label={label} className="flex flex-col gap-2">
      {bars.map((bar, i) => {
        const top = highlightTop && i === 0;
        return (
          <div
            key={bar.key}
            className={`grid grid-cols-[44px_minmax(0,7.5em)_1fr_3em] items-center gap-2 text-[13px] ${top ? "font-bold text-text" : "text-text-sub"}`}
          >
            <span className="block h-7 w-11 overflow-hidden rounded-[5px]">
              <Illustration kind={bar.image} label="" className="h-full" />
            </span>
            <span className="truncate">{bar.label}</span>
            <span className="h-2.5 rounded-[5px] border border-line bg-bg">
              <i
                className={`block h-full rounded-[5px] ${color ? "" : top ? "bg-accent" : "bg-line-strong"}`}
                style={{ width: `${Math.max(bar.pct, 4)}%`, ...(color ? { background: color } : {}) }}
              />
            </span>
            <span className="text-right tabular-nums">{bar.pct}%</span>
          </div>
        );
      })}
    </div>
  );
}
