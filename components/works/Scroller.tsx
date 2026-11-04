import { Children } from "react";

type Props = {
  children: React.ReactNode;
  /** 一覧の説明（スクリーンリーダー向け） */
  label: string;
};

/** 横スクロールの棚（カード幅168px・間隔16px・スクロールスナップ） */
export function Scroller({ children, label }: Props) {
  return (
    <ul
      aria-label={label}
      className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2"
    >
      {Children.map(children, (child) => (
        <li className="w-card shrink-0 snap-start">{child}</li>
      ))}
    </ul>
  );
}
