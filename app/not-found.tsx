import Link from "next/link";
import { SiteFrame } from "@/components/layout/SiteFrame";

export default function NotFound() {
  return (
    <SiteFrame>
      <div className="py-10 text-center">
        <h1 className="text-[26px]">ページが見つかりません</h1>
        <p className="mt-3 text-text-muted">お探しのページは移動または削除された可能性があります。</p>
        <Link href="/" className="mt-2 inline-flex min-h-11 items-center text-text-sub">
          トップへ戻る
        </Link>
      </div>
    </SiteFrame>
  );
}
