/** 表示用の整形 */

export function yen(value: number): string {
  return `${value.toLocaleString("ja-JP")}円`;
}

/** 2026-11-02 → 2026.11.02 */
export function formatDate(isoDate: string): string {
  return isoDate.slice(0, 10).replaceAll("-", ".");
}

/** ISO日時 → 11/30 23:59（日本時間） */
export function formatSaleEnd(iso: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
