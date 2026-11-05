export type CommentItem = { id: number; name: string; body: string; created_at: string };

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date(iso))
    .replaceAll("/", ".");
}

/** 公開済みのコメントの一覧 */
export function CommentList({ comments, loading }: { comments: CommentItem[]; loading: boolean }) {
  if (loading) return <p className="text-xs text-text-muted">コメントを読み込んでいます…</p>;
  if (comments.length === 0) {
    return <p className="text-xs text-text-muted">まだコメントはありません。最初のひとことをどうぞ。</p>;
  }
  return (
    <div>
      {comments.map((c) => (
        <div key={c.id} className="flex flex-col gap-1 border-b border-line py-3.5">
          <span className="text-[13px] font-bold">
            {c.name}
            <time dateTime={c.created_at} className="ml-2 font-normal text-text-muted">
              {formatDate(c.created_at)}
            </time>
          </span>
          <p className="break-words whitespace-pre-wrap text-text-sub">{c.body}</p>
        </div>
      ))}
    </div>
  );
}
