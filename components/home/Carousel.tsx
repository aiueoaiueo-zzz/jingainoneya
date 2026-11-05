"use client";

import Link from "next/link";
import { useRef, useState } from "react";

export type Slide = {
  href: string;
  label: string;
  title: string;
  text: string;
  /** アイキャッチ（サーバー側で作った絵） */
  image: React.ReactNode;
};

const GAP = 12;

/**
 * 「はじめての方へ・特集」のスライド。
 * 指で左右にスワイプでき、矢印と丸ボタンでも切り替えられる。自動では動かない。
 */
export function Carousel({ slides }: { slides: Slide[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const n = slides.length;

  const slideTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const index = (i + n) % n;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: (track.clientWidth + GAP) * index, behavior: reduce ? "auto" : "smooth" });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    setCurrent(Math.round(track.scrollLeft / (track.clientWidth + GAP)));
  };

  const arrow =
    "flex size-11 items-center justify-center rounded-full border border-line-strong bg-surface text-lg";

  return (
    <div className="relative" aria-roledescription="カルーセル">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-card [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, i) => (
          <Link
            key={slide.href}
            href={slide.href}
            aria-label={`${i + 1}枚目／${n}枚：${slide.title}`}
            className="flex shrink-0 grow-0 basis-full snap-center flex-col overflow-hidden rounded-card border border-line bg-surface no-underline"
          >
            {slide.image}
            <span className="flex flex-col gap-1.5 px-4 pt-3.5 pb-4.5">
              <small className="text-xs font-bold tracking-[0.08em] text-accent">{slide.label}</small>
              <b className="font-display text-xl leading-[1.45]">{slide.title}</b>
              <span className="text-[13px] text-text-muted">{slide.text}</span>
            </span>
          </Link>
        ))}
      </div>
      {n > 1 && (
        <div className="mt-2.5 flex items-center justify-center gap-3.5">
          <button type="button" className={arrow} aria-label="前のスライド" onClick={() => slideTo(current - 1)}>
            ‹
          </button>
          <div className="flex">
            {slides.map((slide, i) => (
              <button
                key={slide.href}
                type="button"
                aria-label={`${i + 1}枚目へ`}
                aria-current={i === current}
                onClick={() => slideTo(i)}
                className="group flex size-11 items-center justify-center"
              >
                <span className="size-2.5 rounded-full bg-line-strong group-aria-[current=true]:bg-accent" />
              </button>
            ))}
          </div>
          <button type="button" className={arrow} aria-label="次のスライド" onClick={() => slideTo(current + 1)}>
            ›
          </button>
        </div>
      )}
    </div>
  );
}
