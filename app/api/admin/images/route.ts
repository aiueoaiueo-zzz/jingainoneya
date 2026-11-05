import { getFile, listDir, putFile } from "@/lib/admin/github";
import { adminHandler, bad, ok } from "@/lib/admin/respond";

const FOLDERS = { eyecatch: "public/images/eyecatch", images: "public/images" } as const;
const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*\.(webp|png|jpg|jpeg)$/;
const MAX_BYTES = 4 * 1024 * 1024;

/** 画像の一覧（アイキャッチ用・記事内用） */
export async function GET() {
  return adminHandler(async () => {
    const [eyecatch, images] = await Promise.all([listDir(FOLDERS.eyecatch), listDir(FOLDERS.images)]);
    const pick = (list: Awaited<ReturnType<typeof listDir>>) =>
      list
        .filter((e) => e.type === "file" && NAME.test(e.name))
        .map((e) => ({ name: e.name, src: e.path.replace(/^public/, ""), size: e.size }));
    return ok({ eyecatch: pick(eyecatch), images: pick(images) });
  });
}

/** 画像のアップロード（ブラウザ側で WebP に変換・縮小してから送る） */
export async function POST(request: Request) {
  return adminHandler(async () => {
    const input = (await request.json().catch(() => ({}))) as { folder?: string; name?: string; data?: string };
    const folder = input.folder === "eyecatch" ? FOLDERS.eyecatch : input.folder === "images" ? FOLDERS.images : null;
    const name = String(input.name ?? "");
    if (!folder) return bad("置き場所が正しくありません。");
    if (!NAME.test(name)) return bad("画像の名前は、半角の英小文字・数字・ハイフン（-）に .webp などを付けてください。");
    const bytes = Buffer.from(String(input.data ?? ""), "base64");
    if (bytes.length === 0) return bad("画像の中身がありません。");
    if (bytes.length > MAX_BYTES) return bad("画像が大きすぎます（4MBまで）。");
    const path = `${folder}/${name}`;
    const existing = await getFile(path);
    await putFile(path, bytes, `画像を${existing ? "差し替え" : "追加"}：${name}（管理画面から）`, existing?.sha);
    return ok({ ok: true, src: path.replace(/^public/, "") });
  });
}
