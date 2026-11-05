import { Illustration } from "./Illustration";

const STEPS = [
  { art: "kemono", step: "段階1", name: "ケモミミ型", desc: "人の姿に耳としっぽ" },
  { art: "muzzle", step: "段階2", name: "獣人型", desc: "顔も体も獣、二足歩行" },
  { art: "god", step: "段階3", name: "獣の姿の人外", desc: "神獣・魔獣など" },
];

/** 獣度のものさし */
export function Scale() {
  return (
    <>
      <div
        aria-hidden="true"
        className="mt-1 mb-1.5 h-1.5 rounded-[3px] bg-[linear-gradient(90deg,#3a3d47,var(--color-accent))]"
      />
      <div className="mt-3 mb-4.5 grid grid-cols-1 gap-2 min-[481px]:grid-cols-3">
        {STEPS.map((s) => (
          <div
            key={s.step}
            className="flex flex-col gap-0.5 rounded-card border border-line bg-surface px-2.5 py-3 text-center"
          >
            <Illustration kind={s.art} label={`${s.step}のイメージ`} className="mb-1.5 rounded-md" />
            <small className="text-xs font-bold text-accent">{s.step}</small>
            <b className="text-sm">{s.name}</b>
            <span className="text-xs leading-normal text-text-muted">{s.desc}</span>
          </div>
        ))}
      </div>
    </>
  );
}
