import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";

export const metadata: Metadata = { title: "お問い合わせ" };

/** 文章は仮。連絡先が決まり次第差し替える */
export default function ContactPage() {
  return (
    <StaticPage title="お問い合わせ">
      <p>
        当サイトへのご意見、掲載内容の誤り、掲載作品に関するご連絡は、下記の窓口までお願いします。
      </p>
      <h2>連絡先</h2>
      <p>[お問い合わせフォームまたは連絡先を公開前に記載]</p>
      <h2>ご注意</h2>
      <ul>
        <li>作品の購入・ダウンロードに関するお問い合わせは、販売サイトへお願いします。</li>
        <li>内容によっては、お返事できない場合があります。</li>
      </ul>
    </StaticPage>
  );
}
