import { getPublishedArticle } from "@/lib/articles";
import { moderateComment } from "@/lib/moderation";
import { clientIp, hashValue, json, verifyTurnstile } from "@/lib/security";
import { adminClient, isSupabaseConfigured, publicClient } from "@/lib/supabase/server";
import { COMMENT_DEFAULT_NAME, validateComment } from "@/lib/validation";

const INTERVAL_SECONDS = 30;

/** 記事の公開済みコメント（古い順） */
export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug") ?? "";
  if (!isSupabaseConfigured()) return json({ comments: [], configured: false });
  const { data, error } = await publicClient()
    .from("comments")
    .select("id, name, body, created_at")
    .eq("article_slug", slug)
    .eq("status", "published")
    .order("created_at", { ascending: true })
    .limit(300);
  if (error) {
    console.error("コメントの読み込みに失敗:", error.message);
    return json({ message: "コメントを読み込めませんでした。" }, 500);
  }
  return json({ comments: data ?? [], configured: true });
}

type Body = { slug?: string; name?: string; body?: string; website?: string; token?: string };

/**
 * コメント投稿。
 * ボット対策 → 見えない入力欄 → 30秒あける → 入力チェック → AIで内容を確認 → 保存
 */
export async function POST(request: Request) {
  const input = (await request.json().catch(() => ({}))) as Body;
  const slug = String(input.slug ?? "");
  const name = String(input.name ?? "").trim();
  const body = String(input.body ?? "").trim();

  if (!(await getPublishedArticle(slug))) return json({ message: "記事が見つかりません。" }, 404);
  if (!isSupabaseConfigured()) {
    return json({ message: "コメントの保存先の設定が終わっていないため、いまは投稿できません。" }, 503);
  }

  const ip = clientIp(request);
  const turnstile = await verifyTurnstile(String(input.token ?? ""), ip);
  if (!turnstile.ok) return json({ message: turnstile.message }, 400);

  // 見えない入力欄が埋まっていたらボットとみなし、保存せずに終える
  if (input.website) return json({ status: "discarded" });

  const ipHash = hashValue(`ip:${ip}`);
  const db = adminClient();
  const since = new Date(Date.now() - INTERVAL_SECONDS * 1000).toISOString();
  const { count, error: countError } = await db
    .from("comments")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);
  if (countError) {
    console.error("連投の確認に失敗:", countError.message);
    return json({ message: "いまは投稿できません。時間をおいてもう一度お試しください。" }, 500);
  }
  if ((count ?? 0) > 0) {
    return json({ message: `続けて投稿するときは、${INTERVAL_SECONDS}秒ほどあけてください。` }, 429);
  }

  const invalid = validateComment({ name, body });
  if (invalid) return json({ message: invalid }, 400);

  const displayName = name || COMMENT_DEFAULT_NAME;
  const result = await moderateComment(displayName, body);
  const { data, error } = await db
    .from("comments")
    .insert({
      article_slug: slug,
      name: displayName,
      body,
      status: result.status,
      reject_reason: result.status === "rejected" ? result.reason : null,
      ip_hash: ipHash,
    })
    .select("id, name, body, created_at")
    .single();
  if (error) {
    console.error("コメントの保存に失敗:", error.message);
    return json({ message: "いまは投稿できません。時間をおいてもう一度お試しください。" }, 500);
  }

  if (result.status === "published") return json({ status: "published", comment: data });
  if (result.status === "rejected") return json({ status: "rejected", reason: result.reason });
  return json({ status: "pending" });
}
