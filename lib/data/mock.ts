/**
 * 仮データ（DATA_SOURCE=mock のとき使う）
 * 作品名・サークル名・価格・順位はすべて動作確認用の仮の値。
 */
import type { GenreSlug, Pickup, RankingPeriod, Work, WorkTypeSlug } from "@/lib/types";
import { discountRate, excludeWorks } from "./exclude";
import type { DataSource } from "./source";

const GENRE_ORDER: GenreSlug[] = ["kemono", "monster", "machine", "ishu"];
const TYPE_ORDER: WorkTypeSlug[] = ["doujinshi", "cg", "voice", "game"];
const PRICES = [550, 770, 880, 990, 1100, 1320, 1540, 660];
const OFF_RATES = [30, 50, 70];

/** 表示時の除外語（本番では site_settings.exclude_keywords） */
const MOCK_EXCLUDE_KEYWORDS: string[] = [];

type MockWork = Work & { weeklyScore: number; monthlyScore: number };

/** 2026-11-02 を基準に、i 日前の日付を返す（実行時刻に依存しない固定値） */
function daysBefore(days: number): string {
  const base = Date.UTC(2026, 10, 2);
  return new Date(base - days * 86_400_000).toISOString().slice(0, 10);
}

const ITEMS: MockWork[] = Array.from({ length: 24 }, (_, i) => {
  const n = i + 1;
  const no = String(n).padStart(2, "0");
  const listPrice = PRICES[(i * 3) % PRICES.length];
  const off = n % 3 === 0 ? OFF_RATES[(n / 3) % 3] : 0;
  const price = off ? Math.round((listPrice * (100 - off)) / 100 / 10) * 10 : listPrice;
  return {
    id: `mock_${no}`,
    title: `[作品タイトル] ${no}`,
    circle: `[サークル名] ${"ABCDEFGH"[i % 8]}`,
    affiliateUrl: null,
    imageUrl: null,
    price,
    listPrice,
    isOnSale: off > 0,
    discountRate: discountRate(price, listPrice),
    saleEndAt: off > 0 ? "2026-11-30T23:59:00+09:00" : null,
    sourceGenres: [],
    genre: GENRE_ORDER[i % 4],
    type: TYPE_ORDER[(i + Math.floor(i / 4)) % 4],
    releaseDate: daysBefore(((i * 13) % 24) * 2),
    reviewAverage: null,
    reviewCount: 0,
    weeklyScore: ((i * 37) % 100) + 1,
    monthlyScore: ((i * 53) % 100) + 1,
  };
});

function visible(): MockWork[] {
  return excludeWorks(ITEMS, MOCK_EXCLUDE_KEYWORDS) as MockWork[];
}

function strip({ weeklyScore: _w, monthlyScore: _m, ...work }: MockWork): Work {
  void _w;
  void _m;
  return work;
}

const byNewest = (a: Work, b: Work) => b.releaseDate.localeCompare(a.releaseDate);

export const mockSource: DataSource = {
  async getPickup(): Promise<Pickup | null> {
    // 選定ルール（仮）：発売から2週間以内の作品のうち、点数が一番高いもの
    const candidates = visible().filter((w) => w.releaseDate >= daysBefore(14));
    const best = [...candidates].sort((a, b) => b.weeklyScore - a.weeklyScore)[0];
    if (!best) return null;
    return {
      weekStart: "2026-11-02",
      score: best.weeklyScore,
      comment:
        "[おすすめポイントを2〜3行で。どんな人に刺さる作品か、ほかの作品との違いを自分の言葉で紹介]",
      work: strip(best),
    };
  },

  async getNewWorks(limit) {
    return [...visible()].sort(byNewest).slice(0, limit).map(strip);
  },

  async getSaleWorks(limit) {
    return visible()
      .filter((w) => w.isOnSale)
      .slice(0, limit)
      .map(strip);
  },

  async getRanking(period: RankingPeriod, limit) {
    const key = period === "weekly" ? "weeklyScore" : "monthlyScore";
    return [...visible()]
      .sort((a, b) => b[key] - a[key])
      .slice(0, limit)
      .map(strip);
  },

  async getWork(id) {
    const found = visible().find((w) => w.id === id);
    return found ? strip(found) : null;
  },

  async getWorkIds(limit) {
    return visible()
      .slice(0, limit)
      .map((w) => w.id);
  },
};
