import { CATEGORIES, SITE } from "@/lib/site";
import { Chip } from "./Chip";

/** トップのヒーロー（サブコピー、キャッチコピー、紹介文、記事の種類・タグ検索のチップ） */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="flex flex-col gap-3 border-b border-line pt-2 pb-7"
    >
      <span className="text-[13px] font-bold tracking-[0.1em] text-accent">{SITE.subcopy}</span>
      <h1 id="hero-heading" className="text-[26px] tracking-[0.04em] min-[481px]:text-3xl">
        {SITE.catchcopy}
      </h1>
      <p className="max-w-[34em] text-text-sub">{SITE.heroText}</p>
      <div className="mt-1.5 flex gap-2 overflow-x-auto pb-1.5">
        {CATEGORIES.map((c) => (
          <Chip key={c.slug} href={`/categories/${c.slug}`}>
            {c.name}
          </Chip>
        ))}
        <Chip href="/search">タグで探す</Chip>
      </div>
    </section>
  );
}

