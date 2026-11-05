import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * 管理画面のログイン。
 * パスワード（環境変数 ADMIN_PASSWORD）が合えば、7日間有効な合言葉（Cookie）を渡す。
 * 合言葉はパスワードから作るので、パスワードを変えると全員ログアウトになる。
 */
export const ADMIN_COOKIE = "jingai_neya_admin";
const SESSION_DAYS = 7;

function secret(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 12) return null;
  return createHash("sha256").update(`admin:${password}:${process.env.HASH_SALT ?? ""}`).digest("hex");
}

function sign(value: string, key: string): string {
  return createHmac("sha256", key).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function isAdminConfigured(): boolean {
  return secret() !== null;
}

export function checkPassword(input: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || !secret()) return false;
  const a = createHash("sha256").update(input).digest("hex");
  const b = createHash("sha256").update(password).digest("hex");
  return safeEqual(a, b);
}

export async function startSession(): Promise<void> {
  const key = secret();
  if (!key) throw new Error("ADMIN_PASSWORD が未設定です");
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const value = `${expires}.${sign(String(expires), key)}`;
  (await cookies()).set(ADMIN_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(ADMIN_COOKIE);
}

export async function isLoggedIn(): Promise<boolean> {
  const key = secret();
  if (!key) return false;
  const value = (await cookies()).get(ADMIN_COOKIE)?.value ?? "";
  const [expires, mac] = value.split(".");
  if (!expires || !mac || Number(expires) < Date.now()) return false;
  return safeEqual(mac, sign(expires, key));
}

/** 管理画面の処理の入口で呼ぶ。ログインしていなければ 401 を返す */
export async function requireAdmin(): Promise<Response | null> {
  if (await isLoggedIn()) return null;
  return Response.json(
    { message: "ログインが必要です。" },
    { status: 401, headers: { "Cache-Control": "no-store" } },
  );
}
