/** 見出しの文字から、目次のリンク先に使う名前を作る */
export function headingId(text: string): string {
  return `h-${text.trim().replace(/\s+/g, "-")}`;
}

/** 見出しの中身（文字や太字など）から文字だけを取り出す */
export function textOf(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (typeof node === "object" && "props" in node) {
    return textOf((node.props as { children?: React.ReactNode }).children);
  }
  return "";
}
