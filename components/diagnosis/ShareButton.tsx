"use client";

import { usePathname } from "next/navigation";
import { type DiagnosisData, type ScoredOption, shareUrl } from "@/lib/diagnosis";

/** 結果をXでシェア（投稿画面を開くだけ。勝手に投稿はしない） */
export function ShareButton({ data, top }: { data: DiagnosisData; top: ScoredOption }) {
  const pathname = usePathname();
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const pageUrl = `${base ?? (typeof window !== "undefined" ? window.location.origin : "")}${pathname}`;
  return (
    <a
      href={shareUrl(data, top, pageUrl)}
      target="_blank"
      rel="noopener"
      className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-sm border border-line-strong bg-bg-deep px-5 font-medium no-underline"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z"
        />
      </svg>
      結果をXでシェア
    </a>
  );
}
