type Props = {
  href: string | null;
  children?: React.ReactNode;
};

/**
 * 購入ページ（FANZA）へのボタン。必ず「（PR）」と rel="sponsored noopener" を付ける。
 * アフィリエイトリンクはすべてこの部品を通す。
 */
export function AffiliateButton({ href, children = "作品ページを見る（PR）" }: Props) {
  const className =
    "inline-flex h-11 items-center justify-center gap-1.5 rounded-card border border-accent bg-accent px-5 font-bold text-on-accent no-underline";
  if (!href) {
    // 仮データにはリンクがない
    return (
      <span className={`${className} opacity-60`} aria-disabled="true">
        {children}
      </span>
    );
  }
  return (
    <a href={href} target="_blank" rel="sponsored noopener" className={className}>
      {children}
    </a>
  );
}
