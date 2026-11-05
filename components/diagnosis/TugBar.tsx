import { Illustration } from "@/components/article/Illustration";
import type { ScoredOption } from "@/lib/diagnosis";

/** 結果が2つのときの、左右の綱引きバー（左右の位置は JSON の順番どおり） */
export function TugBar({ left, right }: { left: ScoredOption; right: ScoredOption }) {
  const total = left.pct + right.pct || 1;
  const l = Math.round((left.pct / total) * 100);
  return (
    <div role="img" aria-label={`${left.name} ${l}%、${right.name} ${100 - l}%`} className="flex flex-col gap-2">
      <div className="flex justify-between gap-2.5">
        {[left, right].map((o) => (
          <span key={o.key} className="flex flex-col items-center gap-1 text-[13px]">
            <span className="block w-24 overflow-hidden rounded-sm">
              <Illustration kind={o.image} label="" />
            </span>
            <b>{o.name}</b>
          </span>
        ))}
      </div>
      <div className="relative h-3 rounded-md bg-[#3a5a6e]">
        <i className="absolute inset-y-0 left-0 rounded-l-md bg-accent" style={{ width: `${l}%` }} />
        <em
          className="absolute -top-[5px] -ml-0.5 h-[22px] w-1 rounded-sm bg-text"
          style={{ left: `${l}%` }}
        />
      </div>
      <div className="flex justify-between text-sm font-bold tabular-nums">
        <span>{l}%</span>
        <span>{100 - l}%</span>
      </div>
    </div>
  );
}
