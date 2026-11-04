import Link from "next/link";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Cover } from "@/components/works/Cover";
import { RankingList } from "@/components/works/RankingList";
import { SaleCard } from "@/components/works/SaleCard";
import { Scroller } from "@/components/works/Scroller";
import { WorkCard } from "@/components/works/WorkCard";
import { getArticles } from "@/lib/articles";
import { getNewWorks, getPickup, getRanking, getSaleWorks } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { genreName, typeName } from "@/lib/labels";
import { GENRES } from "@/lib/site";
import type { Pickup } from "@/lib/types";

const chip =
  "inline-flex h-11 shrink-0 snap-start items-center whitespace-nowrap rounded-full border border-[#33363f] bg-[#1f2027] px-4 text-sm font-medium no-underline hover:border-line-strong";

export default async function Home() {
  const [pickup, newWorks, saleWorks, weekly, monthly] = await Promise.all([
    getPickup(),
    getNewWorks(10),
    getSaleWorks(8),
    getRanking("weekly", 5),
    getRanking("monthly", 5),
  ]);
  const articles = getArticles(4);

  return (
    <div className="flex flex-col gap-12">
      {pickup && <PickupSection pickup={pickup} relatedArticle={articles[0]?.slug} />}

      <section aria-labelledby="genres-heading">
        <SectionHeading id="genres-heading" title="ジャンルから探す" />
        <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto px-4 pb-1.5">
          {GENRES.map((g) => (
            <li key={g.slug}>
              <Link href={`/genres/${g.slug}`} className={chip}>
                {g.name}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/sale" className={chip}>
              セール中
            </Link>
          </li>
          <li>
            <Link href="/ranking" className={chip}>
              ランキング
            </Link>
          </li>
        </ul>
      </section>

      <section aria-labelledby="new-heading">
        <SectionHeading
          id="new-heading"
          title="新着作品"
          more={{ href: "/search", label: "すべて見る →" }}
        />
        <Scroller label="新着作品">
          {newWorks.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </Scroller>
      </section>

      <section
        aria-labelledby="sale-heading"
        className="rounded-box border border-line bg-surface px-4 py-5.5"
      >
        <SectionHeading
          id="sale-heading"
          title="セール中の作品"
          more={{ href: "/sale", label: "セール情報まとめ →" }}
        />
        {saleWorks.length > 0 ? (
          <Scroller label="セール中の作品">
            {saleWorks.map((work) => (
              <SaleCard key={work.id} work={work} />
            ))}
          </Scroller>
        ) : (
          <p className="py-6 text-center text-text-muted">現在セール中の作品はありません。</p>
        )}
      </section>

      <section aria-labelledby="ranking-heading">
        <RankingList weekly={weekly} monthly={monthly} />
        <div className="text-center">
          <Link href="/ranking" className="inline-flex min-h-11 items-center text-sm text-text-sub">
            ランキングをもっと見る →
          </Link>
        </div>
      </section>

      <section aria-labelledby="articles-heading">
        <SectionHeading
          id="articles-heading"
          title="特集・まとめ記事"
          more={{ href: "/articles", label: "記事一覧 →" }}
        />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}

function PickupSection({ pickup, relatedArticle }: { pickup: Pickup; relatedArticle?: string }) {
  const { work } = pickup;
  const meta = [work.circle, typeName(work), genreName(work), `${formatDate(work.releaseDate)} 発売`]
    .filter(Boolean)
    .map((text) => <span key={text}>{text}</span>);

  return (
    <section aria-labelledby="pickup-heading" className="flex flex-wrap items-center gap-7">
      <Cover work={work} className="mx-auto w-[min(240px,62%)] flex-[0_1_240px]" />
      <div className="flex min-w-0 flex-[999_1_320px] flex-col gap-3">
        <span className="text-[13px] font-bold tracking-[0.1em] text-accent">今週のピックアップ</span>
        <h1 id="pickup-heading" className="text-3xl leading-[1.35]">
          {work.title}
        </h1>
        <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-[13px] text-text-muted">{meta}</div>
        <p className="max-w-[34em] text-text-sub">{pickup.comment}</p>
        <div className="flex flex-wrap gap-2.5">
          <Link
            href={`/works/${work.id}`}
            className="inline-flex h-11 items-center justify-center rounded-card border border-accent bg-accent px-5 font-bold text-on-accent no-underline"
          >
            作品の紹介を見る
          </Link>
          {relatedArticle && (
            <Link
              href={`/articles/${relatedArticle}`}
              className="inline-flex h-11 items-center justify-center rounded-card border border-line-strong px-5 font-medium no-underline"
            >
              関連記事を読む
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
