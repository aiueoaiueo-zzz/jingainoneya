export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-line-strong px-2 text-[11px] text-text-sub">
      {children}
    </span>
  );
}
