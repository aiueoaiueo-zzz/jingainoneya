import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { Axes } from "@/components/article/Axes";
import { Callout } from "@/components/article/Callout";
import { Figure, FigureRow } from "@/components/article/Figure";
import { ItemList } from "@/components/article/ItemList";
import { Note } from "@/components/article/Note";
import { Scale } from "@/components/article/Scale";
import { WorkBox } from "@/components/article/WorkBox";
import { Diagnosis } from "@/components/diagnosis/Diagnosis";

/**
 * 記事（MDX）の見た目と、記事の中で使える部品。
 * 見出し（##）は記事ページ側で、目次と「閨の主のひとこと」を差し込むために上書きする。
 */
const components: MDXComponents = {
  h3: (props) => <h3 className="mt-5 mb-1.5 text-base text-text" {...props} />,
  p: (props) => <p className="mb-3.5 text-text-sub" {...props} />,
  ul: (props) => <ul className="mb-3.5 list-disc pl-[1.3em] text-text-sub" {...props} />,
  ol: (props) => <ol className="mb-3.5 list-decimal pl-[1.3em] text-text-sub" {...props} />,
  li: (props) => <li className="mb-2 [&_b]:text-text [&_strong]:text-text" {...props} />,
  a: ({ href = "", ...props }) =>
    href.startsWith("/") || href.startsWith("#") ? (
      <Link href={href} className="text-text underline" {...props} />
    ) : (
      <a href={href} target="_blank" rel="noopener" className="text-text underline" {...props} />
    ),
  Axes,
  Callout,
  Diagnosis,
  Figure,
  FigureRow,
  ItemList,
  Note,
  Scale,
  WorkBox,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
