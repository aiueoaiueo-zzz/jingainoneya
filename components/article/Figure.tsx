import { Illustration } from "./Illustration";

type Props = {
  /** 画像のパス（public/images/ に置いたもの）。なければ仮イラスト */
  src?: string;
  /** 画像の説明（画像を指定したときは必須） */
  alt?: string;
  /** 仮イラストの種類 */
  art?: string;
  caption: string;
  /** FigureRow の中で使う小さい表示 */
  small?: boolean;
};

/** 記事内の図。src があれば画像、なければ仮イラスト */
export function Figure({ src, alt, art = "moon", caption, small = false }: Props) {
  return (
    <figure
      className={`overflow-hidden rounded-card border border-line bg-surface ${small ? "m-0" : "mt-4 mb-5"}`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? caption} loading="lazy" className="block aspect-video w-full object-cover" />
      ) : (
        <Illustration kind={art} label={caption} />
      )}
      <figcaption
        className={`flex flex-wrap justify-between gap-2 text-text-sub ${small ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-[13px]"}`}
      >
        {caption}
        {!src && !small && <span className="text-[11px] text-text-muted">仮イラスト：あとで画像に差し替え</span>}
      </figcaption>
    </figure>
  );
}

/** 小さい図を横に並べる */
export function FigureRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3.5 mb-4.5 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2.5 [&_figure]:m-0">
      {children}
    </div>
  );
}
