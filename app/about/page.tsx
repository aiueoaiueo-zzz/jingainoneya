import type { Metadata } from "next";
import Link from "next/link";
import { StaticPage } from "@/components/StaticPage";

export const metadata: Metadata = { title: "このサイトについて" };

export default function AboutPage() {
  return (
    <StaticPage title="このサイトについて">
      <p>
        人外ノ閨は、人外好きが、人外好きのために作品を選んで紹介するサイトです。獣人、モンスター、機械・ロボット、異種族の同人誌・CG集・音声作品を扱います。
      </p>
      <h2>広告について</h2>
      <p>
        当サイトはアフィリエイトプログラム（FANZA／DMMアフィリエイト）を利用しており、作品ページへのリンクには広告（PR）を含みます。リンク先で作品が購入されると、当サイトに報酬が支払われることがあります。
      </p>
      <h2>年齢制限について</h2>
      <p>成人向けの内容を含むため、18歳未満の方はご利用いただけません。</p>
      <h2>掲載する作品について</h2>
      <p>
        未成年を連想させる作品、実在の人物を扱う作品は掲載しません。作品の画像は、販売サイトが提供する公式のサンプル画像のみを使用しています。
      </p>
      <h2>プライバシーポリシー・お問い合わせ</h2>
      <p>
        <Link href="/privacy" className="underline">
          プライバシーポリシー
        </Link>
        と
        <Link href="/contact" className="underline">
          お問い合わせ
        </Link>
        のページをご覧ください。
      </p>
    </StaticPage>
  );
}
