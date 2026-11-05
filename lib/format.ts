/** 表示用の整形 */

/** 2026-11-02 → 2026.11.02 */
export function formatDate(isoDate: string): string {
  return isoDate.slice(0, 10).replaceAll("-", ".");
}
