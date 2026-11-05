"use client";

import { useEffect, useRef } from "react";
import { AGE_COOKIE_MAX_AGE, AGE_COOKIE_NAME, SITE_NAME, UNDERAGE_REDIRECT_URL } from "@/lib/site";

/**
 * 年齢確認。全ページに重ねて表示する。
 *
 * - サーバーは誰に対しても同じHTML（ゲート入り）を返す。クローラー向けの出し分けはしない。
 * - 承認済みかどうかは AgeGateScript が描画前に Cookie を見て <html data-age-ok> を付け、
 *   CSS（globals.css）でゲートを隠す。そのため承認済みの人にも一瞬表示されることはない。
 */
export function AgeGate() {
  const yesRef = useRef<HTMLButtonElement>(null);

  // 承認するまで、年齢確認以外の部分をキーボードでも操作できないようにする
  useEffect(() => {
    if (document.documentElement.hasAttribute("data-age-ok")) return;
    setBackgroundInert(true);
    yesRef.current?.focus();
  }, []);

  const accept = () => {
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${AGE_COOKIE_NAME}=1; Max-Age=${AGE_COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
    document.documentElement.setAttribute("data-age-ok", "");
    setBackgroundInert(false);
  };

  const decline = () => {
    location.href = UNDERAGE_REDIRECT_URL;
  };

  return (
    <div
      data-age-gate
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      aria-describedby="age-gate-desc"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(10,10,13,0.97)] p-5"
    >
      <div className="flex w-full max-w-[420px] flex-col gap-3.5 rounded-[14px] border border-line-strong bg-surface px-5.5 py-7 text-center">
        <h2 id="age-gate-title" className="text-[26px] tracking-[0.08em]">
          {SITE_NAME}
        </h2>
        <p id="age-gate-desc" className="text-sm text-text-sub">
          このサイトには成人向けの作品紹介が含まれます。
          <br />
          あなたは18歳以上ですか？
        </p>
        <div className="mt-1.5 flex flex-col gap-2.5">
          <button
            ref={yesRef}
            type="button"
            onClick={accept}
            className="inline-flex h-11 items-center justify-center rounded-sm border border-accent bg-accent px-5 font-bold text-on-accent"
          >
            18歳以上です（入場する）
          </button>
          <button
            type="button"
            onClick={decline}
            className="inline-flex h-11 items-center justify-center rounded-sm border border-line-strong px-5 font-medium"
          >
            18歳未満です
          </button>
        </div>
        <p className="text-xs text-text-muted">承認すると、この端末では30日間表示されません。</p>
      </div>
    </div>
  );
}

function setBackgroundInert(inert: boolean) {
  for (const el of Array.from(document.body.children)) {
    if (el.hasAttribute("data-age-gate") || el.tagName === "SCRIPT") continue;
    if (inert) el.setAttribute("inert", "");
    else el.removeAttribute("inert");
  }
}

/**
 * 描画前に Cookie を確認し、承認済みなら <html data-age-ok> を付ける。
 * <head> 内に置くので、ゲートがちらつかない。
 */
export function AgeGateScript() {
  const code = `try{if(document.cookie.split('; ').some(function(c){return c.indexOf(${JSON.stringify(
    AGE_COOKIE_NAME + "=",
  )})===0})){document.documentElement.setAttribute('data-age-ok','')}}catch(e){}`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
