"use client";

import { useState } from "react";
import { adminApi } from "./api";
import { toWebp, suggestName } from "./imageTools";
import { Field, type Notice, NoticeBox, btn, inputClass } from "./ui";

type Props = {
  folder: "eyecatch" | "images";
  onUploaded: (src: string) => void;
};

/** 画像のアップロード（選ぶ → 名前を決める → アップロード） */
export function ImageUploader({ folder, onUploaded }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [name, setName] = useState("");
  const [notice, setNotice] = useState<Notice>(null);
  const maxWidth = folder === "eyecatch" ? 1280 : 1600;

  const pick = (f: File | null) => {
    setFile(f);
    setNotice(null);
    if (f) {
      setName(suggestName(f));
      setPreview(URL.createObjectURL(f));
    }
  };

  const upload = async () => {
    if (!file) return;
    setNotice({ kind: "wait", text: "変換してアップロードしています…" });
    try {
      const { base64, width, height } = await toWebp(file, maxWidth);
      const res = await adminApi<{ src: string }>("/api/admin/images", {
        method: "POST",
        json: { folder, name, data: base64 },
      });
      if (!res.ok) {
        setNotice({ kind: "ng", text: res.data.message ?? "アップロードできませんでした。" });
        return;
      }
      setNotice({ kind: "ok", text: `アップロードしました（${width}×${height}）：${res.data.src}` });
      onUploaded(res.data.src);
      setFile(null);
      setPreview("");
    } catch (e) {
      setNotice({ kind: "ng", text: e instanceof Error ? e.message : "画像を読み込めませんでした。" });
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-card border border-dashed border-line-strong p-3">
      <label className={`${btn.normal} cursor-pointer`}>
        画像を選ぶ
        <input type="file" accept="image/*" className="sr-only" onChange={(e) => pick(e.target.files?.[0] ?? null)} />
      </label>
      {file && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="選んだ画像" className="max-h-48 w-auto self-start rounded-sm" />
          <Field label="画像の名前" hint="半角の英小文字・数字・ハイフン（-）。末尾は .webp（自動で WebP に変換します）">
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value.toLowerCase())} />
          </Field>
          <button type="button" className={btn.primary} onClick={upload} disabled={notice?.kind === "wait"}>
            アップロード
          </button>
        </>
      )}
      <NoticeBox notice={notice} />
    </div>
  );
}
