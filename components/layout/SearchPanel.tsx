import Form from "next/form";

type Props = {
  id: string;
  open: boolean;
  onSubmitted: () => void;
};

/** ヘッダーから開く検索パネル。/search?q= に移動する */
export function SearchPanel({ id, open, onSubmitted }: Props) {
  return (
    <div id={id} hidden={!open} className="border-t border-line bg-surface">
      <Form
        action="/search"
        onSubmit={onSubmitted}
        className="mx-auto flex max-w-[1120px] flex-wrap items-center gap-2.5 px-4 py-3.5"
      >
        <label htmlFor="site-search-q" className="text-[13px] text-text-muted">
          作品・記事を検索
        </label>
        <input
          id="site-search-q"
          name="q"
          type="search"
          placeholder="例：獣人　音声　セール"
          autoComplete="off"
          className="h-11 min-w-0 flex-[1_1_220px] rounded-card border border-line-strong bg-bg px-3.5 text-text placeholder:text-text-muted"
        />
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-card border border-accent bg-accent px-5 font-bold text-on-accent"
        >
          検索
        </button>
      </Form>
    </div>
  );
}
