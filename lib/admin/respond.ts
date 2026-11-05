import "server-only";
import { connection } from "next/server";
import { requireAdmin } from "./auth";
import { GitHubError } from "./github";

export function ok(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export function bad(message: string, status = 400): Response {
  return ok({ message }, status);
}

/** 管理画面の処理を包む：ログインの確認と、失敗したときの説明文 */
export async function adminHandler(fn: () => Promise<Response>): Promise<Response> {
  // 管理画面の処理は、毎回その場で実行する
  await connection();
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    return await fn();
  } catch (e) {
    if (e instanceof GitHubError) return bad(e.message, e.status);
    console.error("管理画面の処理でエラー:", e);
    return bad(e instanceof Error ? e.message : "うまく処理できませんでした。", 500);
  }
}
