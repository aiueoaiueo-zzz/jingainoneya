"use client";

import type { MDXComponents } from "mdx/types";
import { Axes } from "@/components/article/Axes";
import { Callout } from "@/components/article/Callout";
import { Figure, FigureRow } from "@/components/article/Figure";
import { ItemList } from "@/components/article/ItemList";
import { Note } from "@/components/article/Note";
import { Scale } from "@/components/article/Scale";
import { WorkBox } from "@/components/article/WorkBox";
import { adminImageUrl } from "./imageTools";

/** プレビュー用の部品（サイトと同じ見た目。診断と目次は場所だけ示す） */
export const previewComponents: MDXComponents = {
  h2: (props) => <h2 className="mt-9 mb-3 border-b border-line pb-1.5 text-xl" {...props} />,
  h3: (props) => <h3 className="mt-5 mb-1.5 text-base text-text" {...props} />,
  p: (props) => <p className="mb-3.5 text-text-sub" {...props} />,
  ul: (props) => <ul className="mb-3.5 list-disc pl-[1.3em] text-text-sub" {...props} />,
  ol: (props) => <ol className="mb-3.5 list-decimal pl-[1.3em] text-text-sub" {...props} />,
  li: (props) => <li className="mb-2 [&_b]:text-text [&_strong]:text-text" {...props} />,
  a: (props) => <a className="text-text underline" target="_blank" rel="noopener" {...props} />,
  Axes,
  Callout,
  Figure: (props: React.ComponentProps<typeof Figure>) => (
    <Figure {...props} src={props.src ? adminImageUrl(props.src) : undefined} />
  ),
  FigureRow,
  ItemList,
  Note,
  Scale,
  WorkBox,
  Diagnosis: ({ id }: { id: string }) => (
    <div className="my-4 rounded-[14px] border border-accent bg-surface p-4 text-center text-sm text-text-muted">
      ここに診断「{id}」が入ります
    </div>
  ),
  Toc: () => (
    <div className="my-4 rounded-card border border-line bg-surface px-4 py-3 text-sm text-text-muted">ここに目次が入ります</div>
  ),
};
