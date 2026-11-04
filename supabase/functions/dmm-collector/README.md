# dmm-collector

作成済みの収集関数（Supabase Edge Function）をここに置きます。

- 稼働（pg_cron での定期実行）は次のフェーズで行います。
- 収集時にも `site_settings.exclude_keywords` で表示しない作品を除外してください（表示時はサイト側の `lib/data/exclude.ts` でも除外します）。
- 必要な secrets：`DMM_API_ID`、`DMM_AFFILIATE_ID`（API用アフィリエイトID・末尾990〜999）
- `dmm_items.genres` は `[{"id": 123, "name": "ジャンル名"}]` の形で保存する想定です。
