import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New, Zen_Old_Mincho } from "next/font/google";
import { AgeGate, AgeGateScript } from "@/components/layout/AgeGate";
import { AgeBar } from "@/components/layout/AgeBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SITE_CATCHCOPY, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
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
  description: SITE_DESCRIPTION,
  // 成人向けサイトであることの表明（全ページの <head> に入る）
  other: { rating: "adult" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-age-ok は AgeGateScript が描画前に付けるので、ハイドレーションの差分警告を抑える
    <html
      lang="ja"
      className={`${display.variable} ${body.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <AgeGateScript />
      </head>
      <body className="flex min-h-dvh flex-col">
        <AgeBar />
        <Header />
        <main className="flex-1 pt-7 pb-16">
          <div className="mx-auto max-w-[1040px] px-4">{children}</div>
        </main>
        <Footer />
        <AgeGate />
      </body>
    </html>
  );
}
