import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { StaticPage } from "@/components/StaticPage";

export const metadata: Metadata = pageMetadata({
  title: "このサイトについて",
  description: "人外ノ閨のコンセプト、年齢制限、紹介する作品の方針、コメントのルールについて。",
  path: "/about",
});

export default function AboutPage() {
  return (
    <StaticPage title="このサイトについて">
      <p>
        人外ノ閨は、人外好きが、人外好きのために作品を選んで語るブログです。獣人、竜、鬼、機械、人魚、あやかしなど、人ならざるものが登場する成人向けの同人誌・CG集・音声作品を紹介しています。
      </p>
      <h2>年齢制限について</h2>
      <p>成人向けの内容を含むため、18歳未満の方はご利用いただけません。</p>
      <h2>紹介する作品について</h2>
      <p>
        紹介する作品は、管理人が実際に読んだ・聴いたものから選んでいます。言葉と意思を持つ人外キャラクターが登場する作品を扱い、未成年を思わせる登場人物の作品や、実在の動物を扱う作品、実在の人物を扱う作品は紹介しません。
      </p>
      <h2>コメントについて</h2>
      <p>
        記事にはどなたでもコメントを書き込めます。誹謗中傷、個人情報、外部サイトへの誘導、未成年を思わせる内容などを含むコメントは、自動の確認で表示しない場合があります。
      </p>
      <h2>関連ページ</h2>
      <p>
        <Link href="/operator">運営者情報</Link>／<Link href="/privacy">プライバシーポリシー</Link>／
        <Link href="/contact">お問い合わせ</Link>
      </p>
    </StaticPage>
  );
}
