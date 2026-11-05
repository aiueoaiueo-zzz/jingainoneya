import Link from "next/link";

type Props = {
  id: string;
  title: string;
  more?: { href: string; label: string };
};

/** セクションの見出し（右に「すべて見る →」などのリンク） */
export function SectionHeading({ id, title, more }: Props) {
  return (
    <div className="mb-3.5 flex flex-wrap items-baseline justify-between gap-3">
      <h2 id={id} className="text-[21px]">
        {title}
      </h2>
      {more && (
        <Link href={more.href} className="inline-flex min-h-11 items-center text-sm text-text-sub">
          {more.label}
        </Link>
      )}
    </div>
  );
}
