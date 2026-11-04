import Link from "next/link";
import { FOOTER_LINKS, SITE_NAME } from "@/lib/site";

/** フッター（アフィリエイト利用の明記を含む） */
export function Footer() {
  return (
    <footer className="border-t border-line bg-bg-deep">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-3 px-4 py-7 text-[13px] text-text-muted">
        <nav aria-label="サイト情報" className="flex flex-wrap gap-x-5">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center text-text-sub"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p>
          当サイトはアフィリエイトプログラム（FANZA／DMMアフィリエイト）を利用しており、作品ページへのリンクには広告（PR）を含みます。リンク先で作品が購入されると、当サイトに報酬が支払われることがあります。
        </p>
        <p>18歳未満の方の閲覧はご遠慮ください。</p>
        <p>© {SITE_NAME}</p>
      </div>
    </footer>
  );
}
