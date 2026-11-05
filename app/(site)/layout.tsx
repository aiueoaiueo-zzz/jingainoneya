import { SiteFrame } from "@/components/layout/SiteFrame";

/** サイト本体の共通の枠（年齢帯・ヘッダー・フッター・年齢確認） */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return <SiteFrame>{children}</SiteFrame>;
}
