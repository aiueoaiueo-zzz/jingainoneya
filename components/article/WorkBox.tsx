import { findGenre } from "@/lib/site";

type Props = {
  title: string;
  circle: string;
  /** 同人誌・CG集・音声など */
  format: string;
  /** ジャンルのslug（例：kemono） */
  genre?: string;
  /** 公式の作品ページのURL（普通のリンク） */
  url?: string;
  /**
   * 段階Bで使う予定：作品データのID。
   * 渡すと、作品データから画像・価格・セール・アフィリエイトリンク（PR）を埋める作品カードに差し替える。
   */
  contentId?: string;
};

/**
 * 紹介している作品の枠。
 * 段階Aでは、作品名・サークル名・形式・ジャンルと、公式ページへの普通のリンクだけを出す。
 */
export function WorkBox({ title, circle, format, genre, url }: Props) {
  const genreName = genre ? findGenre(genre)?.name : undefined;
  const meta = [circle, format, genreName].filter(Boolean).join("｜");
  return (
    <div className="mt-3.5 mb-4.5 flex flex-col gap-1.5 rounded-card border border-line-strong p-4">
      <span className="text-[11px] tracking-[0.1em] text-text-muted">紹介している作品</span>
      <b className="font-display text-[17px]">{title}</b>
      <span className="text-[13px] text-text-muted">{meta}</span>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener"
          className="mt-1.5 inline-flex min-h-11 items-center self-start text-sm text-text-sub"
        >
          公式の作品ページを見る →
        </a>
      )}
    </div>
  );
}
