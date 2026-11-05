/**
 * 虫めがねボタン → 検索ページのキーワード欄にカーソルを置くための合図。
 * ヘッダーが合図を立てて /search へ移動し、キーワード欄が表示されたときに合図を受け取る。
 */
export const SEARCH_INPUT_ID = "search-q";

let pending = false;

export function requestSearchFocus() {
  pending = true;
}

/** 合図が立っていれば消して true を返す */
export function takeSearchFocusRequest(): boolean {
  const was = pending;
  pending = false;
  return was;
}
