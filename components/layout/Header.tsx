"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SITE_CATCHCOPY, SITE_NAME } from "@/lib/site";
import { CloseIcon, MenuIcon, SearchIcon } from "./icons";
import { MenuPanel } from "./MenuPanel";
import { SearchPanel } from "./SearchPanel";

type Panel = "search" | "menu" | null;

/** ヘッダー（右上に検索とハンバーガー）。パネルは同時に1つだけ開く */
export function Header() {
  const [open, setOpen] = useState<Panel>(null);
  const close = () => setOpen(null);
  const toggle = (panel: Exclude<Panel, null>) => setOpen((cur) => (cur === panel ? null : panel));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    if (open === "search") document.getElementById("site-search-q")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const iconButton =
    "flex size-11 items-center justify-center rounded-card bg-transparent hover:bg-surface";

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between gap-3 px-4">
        <Link
          href="/"
          onClick={close}
          className="flex min-h-11 min-w-0 flex-wrap items-baseline content-center gap-x-3 no-underline"
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
            aria-label={open === "search" ? "検索を閉じる" : "検索"}
            aria-expanded={open === "search"}
            aria-controls="panel-search"
            onClick={() => toggle("search")}
          >
            {open === "search" ? <CloseIcon /> : <SearchIcon />}
          </button>
          <button
            type="button"
            className={iconButton}
            aria-label={open === "menu" ? "メニューを閉じる" : "メニュー"}
            aria-expanded={open === "menu"}
            aria-controls="panel-menu"
            onClick={() => toggle("menu")}
          >
            {open === "menu" ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      <SearchPanel id="panel-search" open={open === "search"} onSubmitted={close} />
      <MenuPanel id="panel-menu" open={open === "menu"} onNavigate={close} />
    </header>
  );
}
