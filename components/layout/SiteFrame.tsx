import { AgeBar } from "./AgeBar";
import { AgeGate } from "./AgeGate";
import { Footer } from "./Footer";
import { Header } from "./Header";

/** サイト本体の枠。ページが見つからないときの画面でも使う */
export function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AgeBar />
      <Header />
      <main className="flex-1 pt-7 pb-16">
        <div className="mx-auto max-w-[1040px] px-4">{children}</div>
      </main>
      <Footer />
      <AgeGate />
    </>
  );
}
