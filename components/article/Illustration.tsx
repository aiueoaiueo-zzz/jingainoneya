import { ILLUSTRATION_BACKGROUND, ILLUSTRATIONS } from "./illustrations";

type Props = {
  /** 仮イラストの種類（ジャンルのslug、guide、muzzle、moon など） */
  kind: string;
  label: string;
  className?: string;
};

/** 仮イラスト（図形で描いた絵）。種類が見つからなければ月の絵 */
export function Illustration({ kind, label, className = "" }: Props) {
  const motif = ILLUSTRATIONS[kind] ?? ILLUSTRATIONS.moon;
  return (
    <svg
      viewBox="0 0 320 180"
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid slice"
      className={`block aspect-video h-auto w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: ILLUSTRATION_BACKGROUND + motif }}
    />
  );
}
