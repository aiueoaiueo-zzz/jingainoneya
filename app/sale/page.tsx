import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "セール情報" };

/** セール情報（土台編では空ページ） */
export default function SalePage() {
  return <ComingSoon title="セール情報" />;
}
