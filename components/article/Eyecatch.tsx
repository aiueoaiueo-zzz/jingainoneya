import type { Article } from "@/lib/types";
import { Illustration } from "./Illustration";

type Props = {
  article: Article;
  /** 縦横比（スライドは横長） */
  aspect?: "video" | "wide";
  className?: string;
};

/** 仮イラストの種類：入門ガイドは guide、それ以外は最初のジャンル */
export function eyecatchKind(article: Article): string {
  return article.category === "guide" ? "guide" : (article.genres[0] ?? "moon");
}

/** アイキャッチ。前付けの eyecatch に画像があればそれを、なければ仮イラストを出す */
export function Eyecatch({ article, aspect = "video", className = "" }: Props) {
  const ratio = aspect === "wide" ? "aspect-[21/9]" : "aspect-video";
  return (
    <div
      className={`relative overflow-hidden rounded-sm border border-[#2e3039] bg-placeholder ${ratio} ${className}`}
    >
      {article.eyecatch ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.eyecatch}
          alt={`アイキャッチ：${article.title}`}
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <>
          <Illustration
            kind={eyecatchKind(article)}
            label={`アイキャッチ：${article.title}`}
            className="absolute inset-0 size-full"
          />
          <span className="absolute right-1.5 bottom-1.5 rounded bg-[rgba(14,15,18,0.75)] px-1.5 text-[10px] text-text-muted">
            仮イラスト
          </span>
        </>
      )}
    </div>
  );
}
