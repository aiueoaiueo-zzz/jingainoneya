import "server-only";
import { compile } from "@mdx-js/mdx";
import matter from "gray-matter";
import remarkFrontmatter from "remark-frontmatter";
import { parseArticle } from "@/lib/articles";
import { getDiagnosisIds } from "@/lib/diagnoses";

/** 管理画面で編集する記事の項目（前付け＋本文） */
export type ArticleDraft = {
  slug: string;
  title: string;
  category: string;
  genres: string[];
  publishAt: string;
  description: string;
  eyecatch: string;
  authorNote: string;
  sponsored: boolean;
  body: string;
};

export const ARTICLE_DIR = "content/articles";
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** 記事で使える部品の名前（これ以外の <大文字で始まる名前> は書き間違いとして止める） */
const KNOWN_COMPONENTS = new Set([
  "Diagnosis",
  "Figure",
  "FigureRow",
  "WorkBox",
  "Callout",
  "Scale",
  "Axes",
  "ItemList",
  "Note",
  "Toc",
]);

/** 記事ファイルを読み、編集用の形にする */
export function readDraft(slug: string, source: string): ArticleDraft {
  const { data, content } = matter(source);
  const date = data.publishAt instanceof Date ? data.publishAt.toISOString().slice(0, 10) : String(data.publishAt ?? "");
  return {
    slug,
    title: String(data.title ?? ""),
    category: String(data.category ?? ""),
    genres: Array.isArray(data.genres) ? data.genres.map(String) : [],
    publishAt: date,
    description: String(data.description ?? ""),
    eyecatch: data.eyecatch ? String(data.eyecatch) : "",
    authorNote: data.authorNote ? String(data.authorNote) : "",
    sponsored: data.sponsored === true,
    body: content.replace(/^\n+/, ""),
  };
}

/** 文字列を前付けに安全に書ける形にする（必ず "…" で囲む） */
const q = (s: string) => JSON.stringify(s);

/** 編集用の形を、記事ファイルの文字列に戻す */
export function writeDraft(d: ArticleDraft): string {
  const lines = [
    "---",
    `title: ${q(d.title)}`,
    `slug: ${d.slug}`,
    `category: ${d.category}`,
    ...(d.category === "guide" ? [] : [`genres: [${d.genres.join(", ")}]`]),
    `publishAt: ${d.publishAt}`,
    `description: ${q(d.description)}`,
    ...(d.eyecatch ? [`eyecatch: ${q(d.eyecatch)}`] : []),
    ...(d.authorNote ? [`authorNote: ${q(d.authorNote)}`] : []),
    ...(d.sponsored ? ["sponsored: true"] : []),
    "---",
  ];
  const body = d.body.replace(/\r\n/g, "\n").replace(/\s+$/, "");
  return `${lines.join("\n")}\n${body}\n`;
}

/**
 * 保存する前の確認。問題があれば、管理人向けの説明文を返す。
 * サイトを作り直すときに失敗しないよう、作り直しと同じ確認をここでも行う。
 */
export async function checkDraft(d: ArticleDraft): Promise<string | null> {
  if (!SLUG_PATTERN.test(d.slug)) return "URL名は、半角の英小文字・数字・ハイフン（-）だけで書いてください。";
  if (!d.title.trim()) return "タイトルを入力してください。";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.publishAt)) return "公開日を選んでください。";
  if (!d.description.trim()) return "説明を入力してください。";
  if (d.category !== "guide" && d.genres.length === 0) return "ジャンルを1つ以上選んでください。";
  if (d.eyecatch && !d.eyecatch.startsWith("/images/")) return "アイキャッチは /images/ から始まるパスにしてください。";

  const source = writeDraft(d);
  try {
    parseArticle(`${d.slug}.mdx`, source);
  } catch (e) {
    return e instanceof Error ? e.message : "記事の前付けに問題があります。";
  }

  const used = [...d.body.matchAll(/<([A-Z][A-Za-z]*)/g)].map((m) => m[1]);
  const unknown = [...new Set(used.filter((name) => !KNOWN_COMPONENTS.has(name)))];
  if (unknown.length > 0) return `本文に、使えない部品の名前があります：${unknown.join("、")}`;

  const ids = await getDiagnosisIds();
  for (const m of d.body.matchAll(/<Diagnosis\s+id="([^"]*)"/g)) {
    if (!ids.includes(m[1])) return `診断「${m[1]}」が見つかりません。診断のIDを確認してください。`;
  }

  try {
    await compile(source, { remarkPlugins: [[remarkFrontmatter, ["yaml"]]] });
  } catch (e) {
    const err = e as { line?: number; reason?: string; message?: string };
    // 前付けの行数を引いて、本文の何行目かにする
    const headerLines = source.slice(0, source.indexOf("\n---\n") + 5).split("\n").length - 1;
    const bodyLine = err.line ? Math.max(1, err.line - headerLines) : null;
    return `本文の書き方に問題があります${bodyLine ? `（本文の${bodyLine}行目あたり）` : ""}。部品の < > や " の閉じ忘れがないか確認してください。（${err.reason ?? err.message ?? ""}）`;
  }
  return null;
}
