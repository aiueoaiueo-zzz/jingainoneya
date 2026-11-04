import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New, Zen_Old_Mincho } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PrBar } from "@/components/layout/PrBar";
import { SITE_CATCHCOPY, SITE_NAME } from "@/lib/site";
import "./globals.css";

const display = Zen_Old_Mincho({
  variable: "--font-zen-old-mincho",
  weight: ["600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const body = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku-gothic-new",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title: {
    default: `${SITE_NAME}｜${SITE_CATCHCOPY}`,
    template: `%s｜${SITE_NAME}`,
  },
  description:
    "獣人・モンスター・機械・異種族。人外ジャンルの成人向け同人誌・CG集・音声作品を紹介するサイトです。",
  // 成人向けサイトであることの表明（全ページの <head> に入る）
  other: { rating: "adult" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${display.variable} ${body.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <PrBar />
        <Header />
        <main className="flex-1 pt-7 pb-16">
          <div className="mx-auto max-w-[1120px] px-4">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
