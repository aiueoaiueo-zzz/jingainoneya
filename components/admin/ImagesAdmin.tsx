"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi } from "./api";
import { ImageUploader } from "./ImageUploader";
import { adminImageUrl } from "./imageTools";
import { Card, Loading, PageTitle, btn } from "./ui";

type Img = { name: string; src: string; size: number };

export function ImagesAdmin() {
  const [data, setData] = useState<{ eyecatch: Img[]; images: Img[] } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const load = useCallback(() => {
    adminApi<{ eyecatch: Img[]; images: Img[] }>("/api/admin/images").then((res) => {
      if (res.ok) setData(res.data);
      else setError(res.data.message ?? "読み込めませんでした。");
    });
  }, []);
  useEffect(load, [load]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      window.prompt("コピーしてください", text);
    }
  };

  return (
    <div>
      <PageTitle>画像</PageTitle>
      {error && <p className="text-danger">{error}</p>}
      {!data && !error && <Loading />}
      {data && (
        <>
          <Section
            copied={copied}
            copy={copy}
            onUploaded={load}
            title="アイキャッチ"
            folder="eyecatch"
            list={data.eyecatch}
            hint="記事の一覧や記事の上に出る横長の画像（16:9）。記事の編集画面で選べます。自動で横1280pxまでに縮小し、WebPに変換します。"
          />
          <Section
            copied={copied}
            copy={copy}
            onUploaded={load}
            title="記事の中の画像"
            folder="images"
            list={data.images}
            hint="本文に入れる画像。「本文用にコピー」を押して、記事の本文に貼り付けてください。自動で横1600pxまでに縮小し、WebPに変換します。"
          />
          <p className="text-xs text-text-muted">
            アップロードした画像は、サイトの作り直しが終わってから（数分後）サイトに表示されます。販売サイトの作品画像は使わないでください。
          </p>
        </>
      )}
    </div>
  );
}

function Section({
title,
folder,
list,
hint,
copied,
copy,
onUploaded,
}: {
title: string;
folder: "eyecatch" | "images";
list: Img[];
hint: string;
copied: string;
copy: (text: string) => void;
onUploaded: () => void;
}) {
return (
  <section className="mb-8 flex flex-col gap-3">
    <h2 className="text-xl">{title}</h2>
    <p className="text-sm text-text-muted">{hint}</p>
    <ImageUploader folder={folder} onUploaded={onUploaded} />
    {list.length === 0 ? (
      <p className="text-sm text-text-muted">まだ画像がありません。</p>
    ) : (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
        {list.map((img) => {
          const snippet =
            folder === "eyecatch" ? img.src : `<Figure src="${img.src}" alt="画像の説明" caption="図の説明" />`;
          return (
            <Card key={img.src} className="flex flex-col gap-2 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={adminImageUrl(img.src)} alt={img.name} loading="lazy" className="aspect-video w-full rounded-sm object-cover" />
              <span className="text-xs break-all text-text-sub">{img.name}</span>
              <span className="text-[11px] text-text-muted">{Math.round(img.size / 1024)}KB</span>
              <button type="button" className={btn.small} onClick={() => copy(snippet)}>
                {copied === snippet ? "コピーしました" : folder === "eyecatch" ? "パスをコピー" : "本文用にコピー"}
              </button>
            </Card>
          );
        })}
      </div>
    )}
  </section>
);
}
