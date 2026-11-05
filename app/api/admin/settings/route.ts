import { getText, putFile } from "@/lib/admin/github";
import { adminHandler, bad, ok } from "@/lib/admin/respond";

const SITE = "content/data/site.json";
const CAROUSEL = "content/data/carousel.json";

type Slide = { article: string; label: string; text: string };

/** サイト設定（自己紹介・人気の記事・XのURL・トップのスライド） */
export async function GET() {
  return adminHandler(async () => {
    const [site, carousel] = await Promise.all([getText(SITE), getText(CAROUSEL)]);
    if (!site || !carousel) return bad("設定ファイルが見つかりません。", 404);
    return ok({
      site: JSON.parse(site.text),
      slides: (JSON.parse(carousel.text) as { slides: Slide[] }).slides,
      sha: { site: site.sha, carousel: carousel.sha },
    });
  });
}

export async function PUT(request: Request) {
  return adminHandler(async () => {
    const input = (await request.json().catch(() => ({}))) as {
      site?: { authorIntro?: string; heroText?: string; popular?: string[]; xUrl?: string };
      slides?: Slide[];
    };
    const [site, carousel] = await Promise.all([getText(SITE), getText(CAROUSEL)]);
    if (!site || !carousel) return bad("設定ファイルが見つかりません。", 404);
    const current = JSON.parse(site.text) as Record<string, unknown>;
    const s = input.site ?? {};
    const xUrl = String(s.xUrl ?? "").trim();
    if (xUrl && !/^https:\/\/(x|twitter)\.com\/\w+/.test(xUrl)) return bad("XのURLは https://x.com/アカウント名 の形にしてください。");
    const nextSite = {
      ...current,
      heroText: String(s.heroText ?? current.heroText ?? "").trim(),
      authorIntro: String(s.authorIntro ?? current.authorIntro ?? "").trim(),
      popular: (s.popular ?? (current.popular as string[])).map(String).filter(Boolean).slice(0, 5),
      xUrl,
    };
    const slides = (input.slides ?? [])
      .map((sl) => ({ article: String(sl.article ?? ""), label: String(sl.label ?? "").trim(), text: String(sl.text ?? "").trim() }))
      .filter((sl) => sl.article);
    if (slides.length === 0) return bad("スライドを1枚以上入れてください。");

    const siteText = `${JSON.stringify(nextSite, null, 2)}\n`;
    const carouselText = `${JSON.stringify({ slides }, null, 2)}\n`;
    if (siteText !== site.text) await putFile(SITE, siteText, "サイト設定を更新（管理画面から）", site.sha);
    if (carouselText !== carousel.text) await putFile(CAROUSEL, carouselText, "トップのスライドを更新（管理画面から）", carousel.sha);
    return ok({ ok: true });
  });
}
