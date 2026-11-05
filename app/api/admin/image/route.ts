import { connection } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getFile } from "@/lib/admin/github";

const TYPES: Record<string, string> = { webp: "image/webp", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg" };

/** GitHub にある画像を、管理画面の中だけで表示するための中継 */
export async function GET(request: Request) {
  await connection();
  const denied = await requireAdmin();
  if (denied) return denied;
  const src = new URL(request.url).searchParams.get("src") ?? "";
  const m = /^\/images\/(?:eyecatch\/)?[a-z0-9-]+\.(webp|png|jpg|jpeg)$/.exec(src);
  if (!m) return new Response("not found", { status: 404 });
  try {
    const file = await getFile(`public${src}`);
    if (!file) return new Response("not found", { status: 404 });
    return new Response(new Uint8Array(file.content), {
      headers: { "Content-Type": TYPES[m[1]], "Cache-Control": "private, max-age=60" },
    });
  } catch {
    return new Response("error", { status: 502 });
  }
}
