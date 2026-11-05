"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SEARCH_INPUT_ID, requestSearchFocus } from "@/components/search/focus";
import { SITE_CATCHCOPY, SITE_NAME } from "@/lib/site";
import { CloseIcon, MenuIcon, SearchIcon } from "./icons";
import { MenuPanel } from "./MenuPanel";

/** ヘッダー（左にロゴ、右に虫めがねとハンバーガー） */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const close = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // 虫めがね：パネルを挟まずに検索ページへ移動し、キーワード欄にカーソルを置く
  const goSearch = () => {
    close();
    if (pathname === "/search") {
      document.getElementById(SEARCH_INPUT_ID)?.focus();
      return;
    }
    requestSearchFocus();
    router.push("/search");
  };

  const iconButton =
    "flex size-11 items-center justify-center rounded-sm bg-transparent hover:bg-surface";

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg">
      <div className="mx-auto flex h-16 max-w-[1040px] items-center justify-between gap-3 px-4">
        <Link
          href="/"
          onClick={close}
          className="flex min-h-11 min-w-0 flex-wrap content-center items-baseline gap-x-3 no-underline"
        >
          <span className="font-display text-[22px] font-bold tracking-[0.08em]">{SITE_NAME}</span>
          <span className="font-display text-xs tracking-[0.06em] text-text-sub">
            {SITE_CATCHCOPY}
          </span>
        </Link>
        <div className="flex shrink-0 gap-0.5">
          <button
            type="button"
            className={iconButton}
            aria-label="検索（タグとキーワード）"
            onClick={goSearch}
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            className={iconButton}
            aria-label={menuOpen ? "メニューを閉じる" : "メニュー"}
            aria-expanded={menuOpen}
            aria-controls="panel-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      <MenuPanel id="panel-menu" open={menuOpen} onNavigate={close} />
    </header>
  );
}
