"use client";

/** 画像をブラウザの中で WebP に変換し、大きすぎれば縮小する（スマホの写真もそのまま選べる） */
export async function toWebp(file: File, maxWidth: number): Promise<{ base64: string; blob: Blob; width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("画像を変換できませんでした。");
  ctx.drawImage(bitmap, 0, 0, width, height);
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("画像を変換できませんでした。"))), "image/webp", 0.85),
  );
  const buf = new Uint8Array(await blob.arrayBuffer());
  let bin = "";
  for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return { base64: btoa(bin), blob, width, height };
}

/** ファイル名から、URLに使える名前を作る（日本語の名前なら日付と時刻で作る） */
export function suggestName(file: File): string {
  const base = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (base.length >= 2) return `${base}.webp`;
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `image-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}.webp`;
}

/** 管理画面で画像を表示するときのURL（反映前の画像も見られるよう、GitHub から取る） */
export const adminImageUrl = (src: string) => `/api/admin/image?src=${encodeURIComponent(src)}`;
