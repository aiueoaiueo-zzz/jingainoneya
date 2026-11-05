import Link from "next/link";
import { getPublishedArticles } from "@/lib/articles";
import { GENRE_GROUPS, SITE } from "@/lib/site";

const box = "rounded-card border border-line bg-surface p-4.5";

/** サイドバー（人気の記事、系統ごとのジャンル、書いている人）。スマホでは本文の下に出る */
export async function Sidebar() {
  const published = await getPublishedArticles();
  // site.json の人気記事のうち、公開済みのものだけ
  const popular = SITE.popular
    .map((slug) => published.find((a) => a.slug === slug))
    .filter((a) => a !== undefined);

  return (
    <aside className="flex flex-[1_1_260px] flex-col gap-6" aria-label="サイドバー">
      {popular.length > 0 && (
        <div className={box}>
          <h2 className="mb-2.5 text-[17px]">人気の記事</h2>
          <ol className="flex list-decimal flex-col pl-[1.3em] text-sm">
            {popular.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/articles/${a.slug}`}
                  className="block py-2.5 leading-normal no-underline hover:text-accent"
                >
                  {a.title}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}
      <div className={box}>
        <h2 className="mb-2.5 text-[17px]">ジャンル</h2>
        <div className="flex flex-col gap-3">
          {GENRE_GROUPS.map((group) => (
            <div key={group.slug}>
              <h3 className="mb-1 font-body text-xs font-medium text-text-muted">{group.name}</h3>
              <div className="flex flex-wrap gap-x-3 text-sm">
                {group.genres.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/genres/${g.slug}`}
                    className="inline-flex min-h-11 items-center hover:text-accent"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm">
          <Link href="/search" className="inline-flex min-h-11 items-center text-text-sub">
            タグで探す →
          </Link>
        </p>
      </div>
      <div className={box}>
        <h2 className="mb-2.5 text-[17px]">書いている人</h2>
        <div className="mb-2.5 flex items-center gap-3">
          <Avatar />
          <b>{SITE.authorName}</b>
        </div>
        <p className="text-sm text-text-sub">{SITE.authorIntro}</p>
      </div>
    </aside>
  );
}

export function Avatar() {
  return (
    <span
      aria-hidden="true"
      className="flex size-14 shrink-0 items-center justify-center rounded-full border border-accent bg-bg-deep font-display text-2xl"
    >
      閨
    </span>
  );
}
