import { Breadcrumb } from "./Breadcrumb";

/** サイト情報ページ（about / privacy / contact）の枠 */
export function StaticPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <Breadcrumb items={[{ label: title }]} />
      <article className="max-w-[680px] [&_h2]:mt-7 [&_h2]:mb-2.5 [&_h2]:text-xl [&_li]:text-text-sub [&_p]:mb-3 [&_p]:text-text-sub [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6">
        <h1 className="mb-2 text-[28px] leading-[1.4]">{title}</h1>
        {children}
      </article>
    </>
  );
}
