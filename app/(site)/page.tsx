import { FeaturedSlides } from "@/components/home/FeaturedSlides";
import { Hero } from "@/components/home/Hero";
import { LatestArticles } from "@/components/home/LatestArticles";
import { WithSidebar } from "@/components/home/WithSidebar";

/**
 * トップ。セクションを部品単位で並べる。
 * 段階Bでは、ここに「新着作品」「セール中」「ランキング」の部品を差し込む。
 */
export default function Home() {
  return (
    <div className="flex flex-col gap-11">
      <Hero />
      <FeaturedSlides />
      <WithSidebar>
        <LatestArticles />
      </WithSidebar>
    </div>
  );
}
