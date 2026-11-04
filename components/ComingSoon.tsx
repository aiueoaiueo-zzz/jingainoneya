import Link from "next/link";
import { Breadcrumb } from "./Breadcrumb";

type Props = {
  title: string;
  crumbs?: { href?: string; label: string }[];
  children?: React.ReactNode;
};

/** 土台編の空ページ（見出しと「準備中」だけ） */
export function ComingSoon({ title, crumbs, children }: Props) {
  return (
    <div>
      <Breadcrumb items={crumbs ?? [{ label: title }]} />
      <h1 className="text-[26px] leading-snug">{title}</h1>
      {children}
      <p className="py-10 text-center text-text-muted">
        このページは準備中です。
        <br />
        <Link href="/" className="inline-flex min-h-11 items-center text-text-sub">
          トップへ戻る
        </Link>
      </p>
    </div>
  );
}
