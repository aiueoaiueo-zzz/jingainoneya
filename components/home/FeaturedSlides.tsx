import { Eyecatch } from "@/components/article/Eyecatch";
import { SectionHeading } from "@/components/SectionHeading";
import { getPublishedArticles } from "@/lib/articles";
import carouselJson from "@/content/data/carousel.json";
import { Carousel, type Slide } from "./Carousel";

/** トップの「はじめての方へ・特集」（content/data/carousel.json） */
export async function FeaturedSlides() {
  const published = await getPublishedArticles();
  const slides: Slide[] = carouselJson.slides.flatMap((s) => {
    // 公開前・存在しない記事のスライドは出さない
    const article = published.find((a) => a.slug === s.article);
    if (!article) return [];
    return [
      {
        href: `/articles/${article.slug}`,
        label: s.label,
        title: article.title,
        text: s.text,
        image: <Eyecatch article={article} aspect="wide" className="rounded-none border-0" />,
      },
    ];
  });
  if (slides.length === 0) return null;
  return (
    <section aria-labelledby="slides-heading">
      <SectionHeading id="slides-heading" title="はじめての方へ・特集" />
      <Carousel slides={slides} />
    </section>
  );
}
