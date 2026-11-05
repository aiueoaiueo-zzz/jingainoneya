"use client";

/** 管理画面からサーバーの処理を呼ぶ。ログインが切れていたらログイン画面へ */
export async function adminApi<T = Record<string, unknown>>(
  path: string,
  init: RequestInit & { json?: unknown } = {},
): Promise<{ ok: boolean; status: number; data: T & { message?: string } }> {
  const { json, ...rest } = init;
  const res = await fetch(path, {
    ...rest,
    headers: json !== undefined ? { "Content-Type": "application/json" } : rest.headers,
    body: json !== undefined ? JSON.stringify(json) : rest.body,
    cache: "no-store",
  }).catch(() => null);
  if (!res) return { ok: false, status: 0, data: { message: "通信できませんでした。電波の状態を確認してください。" } as T & { message?: string } };
  if (res.status === 401 && !path.endsWith("/login")) {
    // ログインが切れたときは、ページごと読み込み直してログイン画面へ（どの画面からも呼ばれるため）
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(`/admin/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
  }
  const data = (await res.json().catch(() => ({}))) as T & { message?: string };
  return { ok: res.ok, status: res.status, data };
}

export const REBUILD_NOTE = "保存しました。サイトへの反映には数分かかります（公開先がサイトを作り直します）。";
