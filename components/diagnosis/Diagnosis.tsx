/** 診断。ステップ5で、はい・いいえで答える本物の診断に置き換える */
export function Diagnosis({ id }: { id: string }) {
  return (
    <div className="mb-3.5 rounded-card border border-dashed border-line-strong bg-surface p-4 text-center text-sm text-text-muted">
      診断（{id}）はステップ5で作ります
    </div>
  );
}
