"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminApi } from "./api";

const LINKS = [
  { href: "/admin", label: "ホーム" },
  { href: "/admin/articles", label: "記事" },
  { href: "/admin/diagnoses", label: "診断" },
  { href: "/admin/images", label: "画像" },
  { href: "/admin/comments", label: "コメント" },
  { href: "/admin/contacts", label: "お問い合わせ" },
  { href: "/admin/settings", label: "サイト設定" },
];

/** 管理画面の上部（ログイン画面では出さない） */
export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname === "/admin/login") return null;
  const active = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg-deep">
      <div className="mx-auto flex max-w-[960px] items-center justify-between gap-3 px-4 pt-2">
        <Link href="/admin" className="font-display text-lg font-bold no-underline">
          人外ノ閨 <span className="font-body text-xs text-text-muted">管理画面</span>
        </Link>
        <div className="flex gap-1">
          <a href="/" target="_blank" rel="noopener" className="inline-flex min-h-11 items-center px-2 text-[13px] text-text-sub">
            サイトを見る
          </a>
          <button
            type="button"
            className="inline-flex min-h-11 items-center px-2 text-[13px] text-text-sub"
            onClick={async () => {
              await adminApi("/api/admin/logout", { method: "POST" });
              router.replace("/admin/login");
            }}
          >
            ログアウト
          </button>
        </div>
      </div>
      <nav aria-label="管理メニュー" className="mx-auto flex max-w-[960px] gap-1 overflow-x-auto px-3 pb-1.5">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active(l.href) ? "page" : undefined}
            className="inline-flex min-h-11 shrink-0 items-center rounded-full px-3.5 text-sm font-medium whitespace-nowrap no-underline aria-[current=page]:bg-accent aria-[current=page]:text-on-accent"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
