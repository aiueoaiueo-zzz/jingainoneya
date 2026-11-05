/** フォームの共通の見た目 */
export const labelClass = "text-[13px] text-text-muted";
export const inputClass =
  "w-full rounded-sm border border-line-strong bg-bg px-3 py-2.5 text-text placeholder:text-text-muted min-h-11";
export const submitClass =
  "inline-flex h-11 items-center justify-center self-start rounded-sm border border-accent bg-accent px-5 font-bold text-on-accent disabled:opacity-60";
/** ボット用のわな（人には見えない入力欄） */
export const honeypotClass = "absolute -left-[9999px] h-px w-px overflow-hidden";

export function StatusBox({ kind, children }: { kind: "ok" | "ng" | "wait"; children: React.ReactNode }) {
  const color =
    kind === "ok"
      ? "bg-[#1e2a22] text-[#a8dbb5]"
      : kind === "ng"
        ? "bg-[#2e1f1d] text-danger"
        : "bg-surface text-text-muted";
  return (
    <div role="status" className={`mt-1.5 rounded-sm px-3 py-2.5 text-[13px] ${color}`}>
      {children}
    </div>
  );
}
