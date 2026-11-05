"use client";

import { useEffect, useState } from "react";
import { previewComponents } from "./previewComponents";

type MDXContent = (props: { components?: typeof previewComponents }) => React.ReactNode;

/** 本文のプレビュー（ブラウザの中で記事の形に変換して表示する） */
export function MdxPreview({ body, authorNote }: { body: string; authorNote: string }) {
  const [Content, setContent] = useState<MDXContent | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const [{ evaluate }, runtime] = await Promise.all([import("@mdx-js/mdx"), import("react/jsx-runtime")]);
        const mod = await evaluate(body, { ...runtime, baseUrl: window.location.href });
        if (!cancelled) {
          setContent(() => mod.default as MDXContent);
          setError("");
        }
      } catch (e) {
        if (!cancelled) {
          const err = e as { line?: number; reason?: string; message?: string };
          setError(`本文の${err.line ? `${err.line}行目あたり` : "どこか"}に書き方の問題があります（${err.reason ?? err.message ?? ""}）`);
        }
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [body]);

  if (error) return <p className="rounded-sm bg-[#2e1f1d] p-3 text-sm text-danger">{error}</p>;
  if (!Content) return <p className="text-text-muted">プレビューを作っています…</p>;

  // 「まとめ」の前に閨の主のひとことを入れるのは、サイトと同じ
  const components = {
    ...previewComponents,
    h2: (props: React.ComponentProps<"h2">) => (
      <>
        {props.children === "まとめ" && authorNote && (
          <div className="mt-6 mb-2 rounded-card border border-line bg-surface-2 p-3.5">
            <b className="text-sm text-accent">閨の主のひとこと</b>
            <p className="mt-1 text-sm text-text-sub">{authorNote}</p>
          </div>
        )}
        <h2 className="mt-9 mb-3 border-b border-line pb-1.5 text-xl" {...props} />
      </>
    ),
  };
  return (
    <div className="max-w-[680px]">
      <Content components={components} />
    </div>
  );
}
