/**
 * データ取得の入口。DATA_SOURCE（mock / supabase）で仮データと本番データを切り替える。
 * ページやコンポーネントは必ずここから取得する。未設定なら mock。
 */
import { mockSource } from "./mock";
import type { DataSource } from "./source";
import { supabaseSource } from "./supabase";

function resolveSource(): DataSource {
  const name = process.env.DATA_SOURCE ?? "mock";
  if (name === "supabase") return supabaseSource;
  if (name !== "mock") {
    throw new Error(`DATA_SOURCE は mock か supabase を指定してください（現在：${name}）`);
  }
  return mockSource;
}

const source = resolveSource();

export const dataSourceName = source === supabaseSource ? "supabase" : "mock";

export const getPickup = () => source.getPickup();
export const getNewWorks = (limit = 10) => source.getNewWorks(limit);
export const getSaleWorks = (limit = 8) => source.getSaleWorks(limit);
export const getRanking: DataSource["getRanking"] = (period, limit = 10) =>
  source.getRanking(period, limit);
export const getWork = (id: string) => source.getWork(id);
export const getWorkIds = (limit = 50) => source.getWorkIds(limit);
