import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "ランキング" };

/** ランキング（週間・月間）（土台編では空ページ） */
export default function RankingPage() {
  return <ComingSoon title="ランキング" />;
}
