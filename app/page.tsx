import { SITE_CATCHCOPY } from "@/lib/site";

/** トップ（ステップ4でヒーロー・特集スライド・新着記事・サイドバーを並べる） */
export default function Home() {
  return (
    <section className="py-10">
      <p className="text-[13px] font-bold tracking-[0.1em] text-accent">
        人外好きが、人外好きのために選ぶ。
      </p>
      <h1 className="mt-2 text-3xl">{SITE_CATCHCOPY}</h1>
      <p className="mt-3 text-text-muted">サイトを準備しています。</p>
    </section>
  );
}
