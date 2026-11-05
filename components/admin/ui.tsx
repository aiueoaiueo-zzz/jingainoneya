"use client";

/** 管理画面の共通の部品 */

export const btn = {
  primary:
    "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-sm border border-accent bg-accent px-5 font-bold text-on-accent disabled:opacity-50",
  normal:
    "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-sm border border-line-strong px-4 font-medium disabled:opacity-50",
  danger:
    "inline-flex min-h-11 items-center justify-center rounded-sm border border-danger/60 px-4 font-medium text-danger disabled:opacity-50",
  small: "inline-flex min-h-11 items-center justify-center rounded-sm border border-line-strong px-3 text-[13px] font-medium",
};

export const inputClass =
  "w-full min-h-11 rounded-sm border border-line-strong bg-bg px-3 py-2 text-text placeholder:text-text-muted";

export function PageTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl">{children}</h1>
      {action}
    </div>
  );
}

export function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-bold text-text-sub">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-text-muted">{hint}</p>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-card border border-line bg-surface p-4 ${className}`}>{children}</div>;
}

export type Notice = { kind: "ok" | "ng" | "wait"; text: string } | null;

export function NoticeBox({ notice }: { notice: Notice }) {
  if (!notice) return null;
  const color =
    notice.kind === "ok"
      ? "bg-[#1e2a22] text-[#a8dbb5]"
      : notice.kind === "ng"
        ? "bg-[#2e1f1d] text-danger"
        : "bg-surface-2 text-text-muted";
  return (
    <div role="status" className={`rounded-sm px-3 py-2.5 text-sm whitespace-pre-wrap ${color}`}>
      {notice.text}
    </div>
  );
}

export function Loading() {
  return <p className="py-10 text-center text-text-muted">読み込んでいます…</p>;
}
