const AXES = [
  { name: "人間度", left: "人に近い", right: "人から遠い" },
  { name: "関係性", left: "対等な相棒", right: "主従・契約" },
  { name: "温度", left: "甘い", right: "ダーク" },
];

/** 好みを見つける3つの軸の図 */
export function Axes() {
  return (
    <div
      role="img"
      aria-label="好みを見つける3つの軸の図"
      className="mt-3 mb-4.5 flex flex-col gap-2.5 rounded-card border border-line bg-surface p-4"
    >
      {AXES.map((ax) => (
        <div key={ax.name}>
          <b className="text-sm text-accent">{ax.name}</b>
          <div className="flex items-center gap-2.5 text-xs text-text-sub">
            <span>{ax.left}</span>
            <i className="h-1 flex-1 rounded-sm bg-[linear-gradient(90deg,var(--color-line-strong),var(--color-accent))]" />
            <span>{ax.right}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
