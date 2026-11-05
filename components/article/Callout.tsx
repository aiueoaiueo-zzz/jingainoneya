/** 囲み（補足やコツ） */
export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3.5 rounded-card border border-line bg-surface px-4 py-3.5 text-sm text-text-sub [&>p:last-child]:mb-0 [&>p]:text-sm">
      {children}
    </div>
  );
}
