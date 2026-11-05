/**
 * 左に線のついた項目の並び（ジャンルの一覧やタイプの一覧）。
 * 中には普通の箇条書きを書く：「- **見出し**　説明」
 */
export function ItemList({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3.5 [&_li]:mb-2.5 [&_li]:list-none [&_li]:border-l-2 [&_li]:border-accent [&_li]:py-0.5 [&_li]:pl-3 [&_li]:text-sm [&_li]:text-text-sub [&_li_strong]:block [&_li_strong]:text-[15px] [&_li_strong]:text-text [&_ul]:m-0 [&_ul]:p-0">
      {children}
    </div>
  );
}
