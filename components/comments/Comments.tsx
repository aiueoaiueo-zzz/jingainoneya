"use client";

import { useEffect, useState } from "react";
import { CommentForm } from "./CommentForm";
import { type CommentItem, CommentList } from "./CommentList";

/** 記事のコメント欄（ページは静的なまま、コメントは開いたときに読み込む） */
export function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
      .then((res) => (res.ok ? res.json() : { comments: [] }))
      .then((json: { comments?: CommentItem[] }) => {
        if (!cancelled) setComments(json.comments ?? []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <section aria-labelledby="comments-heading" className="mt-10">
      <h2 id="comments-heading" className="mb-3 border-b border-line pb-1.5 text-xl">
        コメント（{comments.length}件）
      </h2>
      <CommentList comments={comments} loading={loading} />
      <CommentForm slug={slug} onPublished={(c) => setComments((list) => [...list, c])} />
    </section>
  );
}
