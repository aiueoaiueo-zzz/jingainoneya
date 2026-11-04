import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";

export const metadata: Metadata = { title: "プライバシーポリシー" };

/** 文章は仮。公開前に見直す */
export default function PrivacyPage() {
  return (
    <StaticPage title="プライバシーポリシー">
      <p className="text-xs text-text-muted">[仮の文章です。公開前に内容を確認してください]</p>
      <h2>Cookieの利用について</h2>
      <p>
        当サイトでは、年齢確認の結果を保存するためにCookieを使用しています（保存期間は30日間です）。Cookieはブラウザの設定で無効にできますが、その場合は訪問のたびに年齢確認が表示されます。
      </p>
      <h2>広告について</h2>
      <p>
        当サイトはアフィリエイトプログラム（FANZA／DMMアフィリエイト）を利用しています。リンク先のサイトでは、提携先がCookieなどを使って購入の情報を取得することがあります。詳しくは各提携先のプライバシーポリシーをご確認ください。
      </p>
      <h2>アクセス解析について</h2>
      <p>[使用するアクセス解析ツールが決まり次第記載]</p>
      <h2>免責事項</h2>
      <p>
        掲載している作品の価格・セール期間などの情報は、確認した時点のものです。最新の情報は販売サイトでご確認ください。
      </p>
      <h2>改定</h2>
      <p>本ポリシーは、必要に応じて予告なく変更することがあります。</p>
    </StaticPage>
  );
}
