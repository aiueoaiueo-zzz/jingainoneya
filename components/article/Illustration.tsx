import { GENRES } from "@/lib/site";

type Props = {
  /** 仮イラストの種類（ジャンルのslugなど） */
  kind: string;
  label: string;
  className?: string;
};

/**
 * 仮イラスト。ステップ4で、試作と同じ図形の絵（SVG）に置き換える。
 */
export function Illustration({ kind, label, className = "" }: Props) {
  const genre = GENRES.find((g) => g.slug === kind);
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex aspect-video w-full items-center justify-center bg-[#1b1c23] text-xs text-text-muted ${className}`}
    >
      {genre?.name ?? kind}
    </div>
  );
}
