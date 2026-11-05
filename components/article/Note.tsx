/** 小さめの補足文（例：「〇〇の入門記事を読む →」） */
export function Note({ children }: { children: React.ReactNode }) {
  return <p className="mb-3.5 text-xs text-text-muted [&_a]:text-text-sub">{children}</p>;
}
