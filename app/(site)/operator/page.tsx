import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { StaticPage } from "@/components/StaticPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "運営者情報",
  description: "人外ノ閨の運営者情報（サイト名、運営者、連絡方法、サイトの内容、広告について）。",
  path: "/operator",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "[サイトのURL]";

export default function OperatorPage() {
  const rows: [string, React.ReactNode][] = [
    ["サイト名", `${SITE.name}（${SITE.reading}）`],
    ["URL", siteUrl],
    ["運営者", SITE.authorName],
    ["開設日", "[開設日]"],
    [
      "お問い合わせ",
      <>
        <Link href="/contact">お問い合わせフォーム</Link>からお願いします
      </>,
    ],
    ["サイトの内容", "人外ジャンルの解説と、人外キャラクターが登場する成人向け作品の紹介"],
    ["対象", "18歳以上の方"],
  ];
  return (
    <StaticPage title="運営者情報">
      <table className="mb-3 w-full border-collapse text-sm">
        <tbody>
          {rows.map(([th, td]) => (
            <tr key={th}>
              <th className="w-[7.5em] border-b border-line py-2.5 text-left align-top font-medium text-text-muted">
                {th}
              </th>
              <td className="border-b border-line py-2.5 text-text-sub">{td}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>運営者について</h2>
      <p>{SITE.authorIntro}</p>
      <h2>広告について</h2>
      <p>
        当サイトは、アフィリエイトプログラムに参加し、作品を紹介することで報酬を得る場合があります。広告を含む記事には、その旨を表示します。
      </p>
    </StaticPage>
  );
}
