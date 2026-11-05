/** 閨の主のひとこと（記事の前付け authorNote から自動で入る） */
export function AuthorNote({ note }: { note: string }) {
  return (
    <div className="mt-6 mb-2 flex items-start gap-3 rounded-card border border-line bg-surface-2 p-3.5">
      <span
        aria-hidden="true"
        className="flex size-14 shrink-0 items-center justify-center rounded-full border border-accent bg-bg-deep font-display text-2xl"
      >
        閨
      </span>
      <div>
        <b className="text-sm text-accent">閨の主のひとこと</b>
        <p className="mt-1 mb-0.5 text-sm text-text-sub">{note}</p>
      </div>
    </div>
  );
}
