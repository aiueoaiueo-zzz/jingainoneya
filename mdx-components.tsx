import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { AffiliateButton } from "@/components/works/AffiliateButton";

/** 記事（MDX）の見た目と、記事内で使える部品 */
const components: MDXComponents = {
  h2: (props) => <h2 className="mt-7 mb-2.5 text-xl" {...props} />,
  h3: (props) => <h3 className="mt-5 mb-2 text-[17px]" {...props} />,
  p: (props) => <p className="mb-3 text-text-sub" {...props} />,
  ul: (props) => <ul className="mb-3 list-disc pl-6 text-text-sub" {...props} />,
  ol: (props) => <ol className="mb-3 list-decimal pl-6 text-text-sub" {...props} />,
  a: ({ href = "", ...props }) =>
    href.startsWith("/") ? (
      <Link href={href} className="underline" {...props} />
    ) : (
      // 外部リンクはアフィリエイトの可能性があるため sponsored を付ける
      <a href={href} target="_blank" rel="sponsored noopener" className="underline" {...props} />
    ),
  AffiliateButton,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
