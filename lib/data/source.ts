import type { Pickup, RankingPeriod, Work } from "@/lib/types";

/** 仮データ（mock.ts）と本番データ（supabase.ts）が共通で持つ取得関数 */
export interface DataSource {
  /** 今週のピックアップ */
  getPickup(): Promise<Pickup | null>;
  /** 新着作品（発売日の新しい順） */
  getNewWorks(limit: number): Promise<Work[]>;
  /** セール中の作品 */
  getSaleWorks(limit: number): Promise<Work[]>;
  /** ランキング（週間・月間） */
  getRanking(period: RankingPeriod, limit: number): Promise<Work[]>;
  /** 作品1件 */
  getWork(id: string): Promise<Work | null>;
  /** 事前に生成しておく作品詳細ページのID */
  getWorkIds(limit: number): Promise<string[]>;
}
