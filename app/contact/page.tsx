import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/forms/ContactForm";
import { StaticPage } from "@/components/StaticPage";

export const metadata: Metadata = pageMetadata({
  title: "お問い合わせ",
  description: "人外ノ閨へのお問い合わせ（記事の内容、作品の掲載、削除・修正のご依頼など）。",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <StaticPage title="お問い合わせ">
      <p>
        記事の内容、作品の掲載、削除のご依頼などはこちらからお送りください。内容を確認のうえ、必要に応じてご連絡します。
      </p>
      <ContactForm />
    </StaticPage>
  );
}
