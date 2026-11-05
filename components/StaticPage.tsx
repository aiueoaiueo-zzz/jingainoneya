import { Breadcrumb } from "./Breadcrumb";

/** サイト情報ページ（about / operator / privacy / contact）の枠 */
export function StaticPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <Breadcrumb items={[{ label: title }]} />
      <article className="max-w-[680px] [&_h2]:mt-9 [&_h2]:mb-3 [&_h2]:border-b [&_h2]:border-line [&_h2]:pb-1.5 [&_h2]:text-xl [&_li]:mb-2 [&_li]:text-text-sub [&_p]:mb-3.5 [&_p]:text-text-sub [&_ul]:mb-3.5 [&_ul]:list-disc [&_ul]:pl-[1.3em] [&_a]:underline">
        <h1 className="mt-2 mb-2.5 text-[28px]">{title}</h1>
        {children}
      </article>
    </>
  );
}
