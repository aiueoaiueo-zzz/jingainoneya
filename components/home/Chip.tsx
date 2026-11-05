import Link from "next/link";

export const chipClass =
  "inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full border border-[#33363f] bg-[#1f2027] px-3.5 text-sm font-medium no-underline aria-[current=page]:border-accent aria-[current=page]:bg-accent aria-[current=page]:text-on-accent aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-on-accent";

/** チップ（丸いボタン型のリンク）。current なら選択中の色 */
export function Chip({
  href,
  current = false,
  children,
}: {
  href: string;
  current?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={chipClass} aria-current={current ? "page" : undefined}>
      {children}
    </Link>
  );
}
