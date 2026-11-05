"use client";

import { useEffect, useRef } from "react";
import { SEARCH_INPUT_ID, takeSearchFocusRequest } from "./focus";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  /** 読み込み中の仮の欄。仮の欄は合図を受け取らない（すぐ入れ替わるため） */
  placeholderOnly?: boolean;
};

/** 検索ページのキーワード欄。虫めがねから来たときはカーソルを置く */
export function KeywordInput({ value, onChange, placeholderOnly = false }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!placeholderOnly && takeSearchFocusRequest()) ref.current?.focus();
  });

  return (
    <input
      ref={ref}
      id={SEARCH_INPUT_ID}
      name="q"
      type="search"
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      readOnly={!onChange}
      placeholder="例：獣度　切ない"
      autoComplete="off"
      className="h-11 min-w-0 flex-[1_1_220px] rounded-sm border border-line-strong bg-bg px-3.5 text-text placeholder:text-text-muted"
    />
  );
}
