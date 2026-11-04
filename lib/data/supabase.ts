/**
 * 本番データ（DATA_SOURCE=supabase のとき使う）
 * dmm_items / pickups / site_settings を読み取り、画面向けの型に変換する。
 */
import { cacheLife } from "next/cache";
import { getSupabase } from "@/lib/supabase/client";
import type {
  GenreSlug,
  Pickup,
  RankingPeriod,
  SourceGenre,
  TargetGenre,
  Work,
  WorkTypeSlug,
} from "@/lib/types";
import { discountRate, excludeWorks } from "./exclude";
import type { DataSource } from "./source";

type DmmItemRow = {
  content_id: string;
  title: string;
  affiliate_url: string;
  image_url: string | null;
  price: number | null;
  list_price: number | null;
  is_on_sale: boolean;
  sale_end_at: string | null;
  genres: SourceGenre[] | null;
  maker: string | null;
  release_date: string | null;
  review_average: number | null;
  review_count: number | null;
};

const ITEM_COLUMNS =
  "content_id,title,affiliate_url,image_url,price,list_price,is_on_sale,sale_end_at,genres,maker,release_date,review_average,review_count";

/** 除外で件数が減っても足りるよう、多めに取得してから絞る */
const OVERFETCH = 3;

type Settings = {
  excludeKeywords: string[];
  targetGenres: TargetGenre[];
};

async function getSettings(): Promise<Settings> {
  const { data, error } = await getSupabase()
    .from("site_settings")
    .select("key,value")
    .in("key", ["exclude_keywords", "target_genres"]);
  if (error) throw error;
  const map = new Map((data ?? []).map((row) => [row.key as string, row.value as unknown]));
  const exclude = map.get("exclude_keywords");
  const targets = map.get("target_genres");
  return {
    excludeKeywords: Array.isArray(exclude) ? exclude.map(String) : [],
    targetGenres: Array.isArray(targets)
      ? targets.map((t: { genre_id: number; slug: GenreSlug }) => ({
          genreId: Number(t.genre_id),
          slug: t.slug,
        }))
      : [],
  };
}

/** APIのジャンル名から作品タイプを推定する（判定できなければ null） */
function guessType(genres: SourceGenre[]): WorkTypeSlug | null {
  const names = genres.map((g) => g.name).join(" ");
  if (/ボイス|音声|ASMR/.test(names)) return "voice";
  if (/ゲーム/.test(names)) return "game";
  if (/CG|イラスト/.test(names)) return "cg";
  if (/コミック|マンガ|漫画|同人誌/.test(names)) return "doujinshi";
  return null;
}

function toWork(row: DmmItemRow, targets: TargetGenre[]): Work {
  const genres = row.genres ?? [];
  const price = row.price ?? 0;
  const listPrice = row.list_price ?? price;
  const genre = targets.find((t) => genres.some((g) => g.id === t.genreId))?.slug ?? null;
  return {
    id: row.content_id,
    title: row.title,
    circle: row.maker ?? "",
    affiliateUrl: row.affiliate_url,
    imageUrl: row.image_url,
    price,
    listPrice,
    isOnSale: row.is_on_sale,
    discountRate: row.is_on_sale ? discountRate(price, listPrice) : 0,
    saleEndAt: row.sale_end_at,
    sourceGenres: genres,
    genre,
    type: guessType(genres),
    releaseDate: row.release_date ?? "",
    reviewAverage: row.review_average,
    reviewCount: row.review_count ?? 0,
  };
}

function toWorks(rows: DmmItemRow[] | null, settings: Settings, limit: number): Work[] {
  const works = (rows ?? []).map((row) => toWork(row, settings.targetGenres));
  return excludeWorks(works, settings.excludeKeywords).slice(0, limit);
}

async function getPickup(): Promise<Pickup | null> {
  "use cache";
  cacheLife("hours");
  const settings = await getSettings();
  const { data, error } = await getSupabase()
    .from("pickups")
    .select(`week_start,score,comment,dmm_items(${ITEM_COLUMNS})`)
    .order("week_start", { ascending: false })
    .order("score", { ascending: false })
    .limit(10);
  if (error) throw error;
  for (const row of data ?? []) {
    const item = row.dmm_items as unknown as DmmItemRow | null;
    if (!item) continue;
    const [work] = toWorks([item], settings, 1);
    if (!work) continue; // 除外語に当たった
    return {
      weekStart: row.week_start as string,
      score: Number(row.score),
      comment: (row.comment as string) ?? "",
      work,
    };
  }
  return null;
}

async function getNewWorks(limit: number): Promise<Work[]> {
  "use cache";
  cacheLife("hours");
  const settings = await getSettings();
  const { data, error } = await getSupabase()
    .from("dmm_items")
    .select(ITEM_COLUMNS)
    .order("release_date", { ascending: false, nullsFirst: false })
    .limit(limit * OVERFETCH);
  if (error) throw error;
  return toWorks(data as DmmItemRow[], settings, limit);
}

async function getSaleWorks(limit: number): Promise<Work[]> {
  "use cache";
  cacheLife("hours");
  const settings = await getSettings();
  const { data, error } = await getSupabase()
    .from("dmm_items")
    .select(ITEM_COLUMNS)
    .eq("is_on_sale", true)
    .order("sale_end_at", { ascending: true, nullsFirst: false })
    .limit(limit * OVERFETCH);
  if (error) throw error;
  return toWorks(data as DmmItemRow[], settings, limit);
}

async function getRanking(period: RankingPeriod, limit: number): Promise<Work[]> {
  "use cache";
  cacheLife("hours");
  // TODO（次フェーズ）：週間・月間の順位データを収集して使う。
  // 今はレビュー数の多い順を、週間・月間どちらにも仮で使う。
  void period;
  const settings = await getSettings();
  const { data, error } = await getSupabase()
    .from("dmm_items")
    .select(ITEM_COLUMNS)
    .order("review_count", { ascending: false })
    .limit(limit * OVERFETCH);
  if (error) throw error;
  return toWorks(data as DmmItemRow[], settings, limit);
}

async function getWork(id: string): Promise<Work | null> {
  "use cache";
  cacheLife("hours");
  const settings = await getSettings();
  const { data, error } = await getSupabase()
    .from("dmm_items")
    .select(ITEM_COLUMNS)
    .eq("content_id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? (toWorks([data as DmmItemRow], settings, 1)[0] ?? null) : null;
}

async function getWorkIds(limit: number): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  const works = await getNewWorks(limit);
  return works.map((w) => w.id);
}

export const supabaseSource: DataSource = {
  getPickup,
  getNewWorks,
  getSaleWorks,
  getRanking,
  getWork,
  getWorkIds,
};
