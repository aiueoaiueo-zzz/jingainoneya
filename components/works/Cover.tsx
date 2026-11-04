import { genreGlyph } from "@/lib/labels";
import type { Work } from "@/lib/types";

type Props = {
  work: Work;
  className?: string;
  /** 割引バッジを出すか */
  showBadge?: boolean;
};

/**
 * 作品の表紙。APIが返す公式サンプル画像をそのまま表示する（保存・加工はしない）。
 * 画像がない（仮データ）ときは代わりの枠を出す。
 */
export function Cover({ work, className = "", showBadge = true }: Props) {
  return (
    <div
      className={`relative flex aspect-[3/4] flex-col items-center justify-center gap-1 overflow-hidden rounded-card border border-[#2e3039] bg-placeholder text-xs text-text-muted ${className}`}
    >
      {work.imageUrl ? (
        // next/image は画像をサーバーで変換・キャッシュするため使わず、公式URLをそのまま表示する
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={work.imageUrl}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <>
          <span aria-hidden="true" className="font-display text-[34px] text-[#4a4c56]">
            {genreGlyph(work)}
          </span>
          <span>サンプル画像</span>
        </>
      )}
      {showBadge && work.discountRate > 0 && (
        <span className="absolute top-2 left-2 rounded px-2 py-0.5 text-xs font-bold bg-accent text-on-accent">
          {work.discountRate}%OFF
        </span>
      )}
    </div>
  );
}
