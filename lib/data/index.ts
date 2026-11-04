/**
 * データ取得の入口。DATA_SOURCE（mock / supabase）で仮データと本番データを切り替える。
 * ページやコンポーネントは必ずここから取得する。
 */
import { mockSource } from "./mock";
import type { DataSource } from "./source";

function resolveSource(): DataSource {
  // 本番データは次のステップで追加する
  return mockSource;
}

const source = resolveSource();

export const getPickup = () => source.getPickup();
export const getNewWorks = (limit = 10) => source.getNewWorks(limit);
export const getSaleWorks = (limit = 8) => source.getSaleWorks(limit);
export const getRanking: DataSource["getRanking"] = (period, limit = 10) =>
  source.getRanking(period, limit);
export const getWork = (id: string) => source.getWork(id);
export const getWorkIds = (limit = 50) => source.getWorkIds(limit);
