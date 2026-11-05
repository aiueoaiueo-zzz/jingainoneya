/**
 * 記事の読み込みと予約公開。
 *
 * - 記事は content/articles/<slug>.mdx。前付け（ファイル先頭の --- で囲んだ部分）に公開日などを書く。
 * - publishAt が未来の記事は、一覧・検索・関連記事・サイトマップのどこにも出さず、直接開いても404にする。
 * - 公開済みの一覧は「次の0時（日本時間）」で期限が切れるようにキャッシュする。
 *   0時を過ぎて最初にアクセスがあったとき、その日の記事を含めて作り直される。
 */
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { cacheLife, cacheTag } from "next/cache";
import { CATEGORIES, GENRES } from "@/lib/site";
import type { Article } from "@/lib/types";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");
const DAY_MS = 24 * 60 * 60 * 1000;
const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** publishAt（日付）の0時・日本時間を表す時刻 */
export function publishTime(publishAt: string): number {
  return Date.parse(`${publishAt}T00:00:00+09:00`);
}

/** 次の0時（日本時間）までの秒数 */
function secondsUntilNextJstMidnight(now: number): number {
  const jstNow = now + JST_OFFSET_MS;
  const nextMidnightJst = Math.floor(jstNow / DAY_MS) * DAY_MS + DAY_MS;
  return Math.max(1, Math.ceil((nextMidnightJst - jstNow) / 1000));
}

function toDateString(value: unknown, file: string): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  throw new Error(`${file}：publishAt は 2026-11-20 のような日付で書いてください`);
}

function toStringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string" && value) return [value];
  return [];
}

/** 本文から「## 見出し」を取り出す（目次用）。コードの囲みの中は無視する */
export function extractHeadings(body: string): string[] {
  const headings: string[] = [];
  let inFence = false;
  for (const line of body.split("\n")) {
    if (line.trim().startsWith("```")) inFence = !inFence;
    if (inFence) continue;
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (m) headings.push(m[1]);
  }
  return headings;
}

const ALL_GENRE_SLUGS = GENRES.map((g) => g.slug);

function parseArticle(file: string, source: string): Article {
  const { data, content } = matter(source);
  const fileSlug = path.basename(file, ".mdx");
  const slug = String(data.slug ?? fileSlug);
  if (slug !== fileSlug) {
    throw new Error(`${file}：slug（${slug}）とファイル名（${fileSlug}）をそろえてください`);
  }
  const category = String(data.category ?? "");
  if (!CATEGORIES.some((c) => c.slug === category)) {
    throw new Error(
      `${file}：category は ${CATEGORIES.map((c) => c.slug).join(" / ")} のどれかにしてください（今：${category}）`,
    );
  }
  // 入門ガイドは全ジャンルに関連する
  const genres = category === "guide" ? ALL_GENRE_SLUGS : toStringList(data.genres);
  const unknown = genres.filter((g) => !ALL_GENRE_SLUGS.includes(g));
  if (unknown.length > 0) {
    throw new Error(`${file}：genres に知らないジャンルがあります（${unknown.join(", ")}）`);
  }
  if (!data.title) throw new Error(`${file}：title がありません`);

  return {
    slug,
    title: String(data.title),
    category,
    genres,
    publishAt: toDateString(data.publishAt, file),
    description: String(data.description ?? ""),
    eyecatch: data.eyecatch ? String(data.eyecatch) : null,
    authorNote: data.authorNote ? String(data.authorNote) : null,
    sponsored: data.sponsored === true,
    headings: extractHeadings(content),
  };
}

/** 予約中も含めた、すべての記事（新しい順） */
async function loadAllArticles(): Promise<Article[]> {
  "use cache";
  cacheLife("max");
  cacheTag("articles");
  const files = (await fs.readdir(ARTICLES_DIR)).filter((f) => f.endsWith(".mdx"));
  const articles = await Promise.all(
    files.map(async (file) =>
      parseArticle(file, await fs.readFile(path.join(ARTICLES_DIR, file), "utf8")),
    ),
  );
  return articles.sort(
    (a, b) => b.publishAt.localeCompare(a.publishAt) || a.slug.localeCompare(b.slug),
  );
}

/** 公開済みの記事（新しい順）。次の0時（日本時間）で作り直す */
export async function getPublishedArticles(): Promise<Article[]> {
  "use cache";
  cacheTag("articles");
  const now = Date.now();
  const seconds = secondsUntilNextJstMidnight(now);
  // 期限は最低5分（Next.js の決まり）。0時直前に作り直したときだけ、0時を過ぎた最初の1回は古い内容になる
  cacheLife({ stale: 60, revalidate: seconds, expire: Math.max(seconds, 300) });
  const all = await loadAllArticles();
  return all.filter((a) => publishTime(a.publishAt) <= now);
}

/** 公開済みの記事を1本。予約中や存在しない記事は null */
export async function getPublishedArticle(slug: string): Promise<Article | null> {
  const articles = await getPublishedArticles();
  return articles.find((a) => a.slug === slug) ?? null;
}

/** 関連記事：同じジャンルを持つ公開済みの記事。入門ガイドは全ジャンルに関連する */
export async function getRelatedArticles(article: Article, limit = 3): Promise<Article[]> {
  const articles = await getPublishedArticles();
  return articles
    .filter((a) => a.slug !== article.slug)
    // 入門ガイドは全ジャンルを持つので、どの記事とも関連する
    .filter((a) => a.genres.some((g) => article.genres.includes(g)))
    .slice(0, limit);
}
