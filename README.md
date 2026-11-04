# 人外ノ閨

人外ジャンル（獣人・モンスター・機械・異種族）の成人向け同人誌・CG集・音声作品を紹介するアフィリエイトブログ。キャッチコピーは「ヒトでは満たされない夜に。」。

現在は **土台編（フェーズ1）** の段階です。トップページは仮データで表示し、ほかのページは「準備中」の空ページです。

## 必要なもの

- Node.js 20 以上（22 で動作確認）
- npm

## 起動方法

```bash
npm install
cp .env.example .env.local   # 必要なら値を入れる（仮データなら空のままでよい）
npm run dev                  # http://localhost:3000
```

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動する |
| `npm run build` | 本番用にビルドする |
| `npm run start` | ビルドしたものを起動する |
| `npm run lint` | ESLint でチェックする |

年齢確認をもう一度表示したいときは、ブラウザで `localhost` の Cookie `jingai_neya_age_ok` を削除してください。

## 環境変数

秘密の値はコードに書かず、`.env.local`（Git に含めない）とホスティング先の設定画面に入れます。リポジトリには値を空にした `.env.example` だけを置きます。

| 変数名 | 中身 | 置き場所 |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase の URL | サイト |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 読み取り用の公開キー | サイト |
| `NEXT_PUBLIC_SITE_URL` | 本番の URL | サイト |
| `DATA_SOURCE` | `mock` か `supabase`（仮データと本番データの切替） | サイト |
| `DMM_API_ID` | DMM の API ID | Supabase の secrets |
| `DMM_AFFILIATE_ID` | API 用アフィリエイト ID（末尾 990〜999） | Supabase の secrets |

## データの切替方法

ページは必ず `lib/data/index.ts` からデータを取得します。`DATA_SOURCE` で取得元が切り替わります。

| `DATA_SOURCE` | 取得元 | 用途 |
| --- | --- | --- |
| `mock`（未設定でもこれ） | `lib/data/mock.ts` の仮データ | 手元での確認 |
| `supabase` | Supabase の `dmm_items` / `pickups` / `site_settings` | 本番データ |

`supabase` に切り替える手順：

1. Supabase のプロジェクトで `supabase/migrations/` の SQL を実行する（`supabase db push` か、SQL エディタに貼り付け）
2. `.env.local` に `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を入れ、`DATA_SOURCE=supabase` にする
3. `npm run dev` を起動し直す

本番データはビルド時と1時間ごとに取得し直します（`use cache` と `cacheLife("hours")`）。

### site_settings に入れる値

| key | value の例 | 内容 |
| --- | --- | --- |
| `pickup_rules` | `{"max_days_since_release": 14}` | ピックアップ候補の条件 |
| `exclude_keywords` | `["除外したい語", "..."]` | タイトル・サークル名・ジャンル名にこの語を含む作品は表示しない |
| `target_genres` | `[{"genre_id": 123, "slug": "kemono"}]` | FANZA のジャンル ID とサイト上のジャンル（`kemono` / `monster` / `machine` / `ishu`）の対応表 |

書き込みは service role（収集関数・管理作業）だけができます。サイトからは読み取りのみです（RLS）。

## ディレクトリ構成

```
app/                     ページ（App Router）
components/layout/       PrBar, Header, SearchPanel, MenuPanel, Footer, AgeGate
components/works/        WorkCard, SaleCard, Scroller, RankingList, AffiliateButton ほか
components/articles/     ArticleCard
content/articles/        記事（MDX）と記事一覧（index.ts）
lib/data/                データ取得（index.ts が入口 / mock.ts / supabase.ts）
lib/supabase/            Supabase クライアント
lib/types.ts             作品・ピックアップ・記事などの型
lib/site.ts              ジャンル・作品タイプ・メニューなどの定数
supabase/migrations/     テーブル定義とRLSのSQL
supabase/functions/dmm-collector/  収集関数（稼働は次フェーズ）
```

## 記事の追加

1. `content/articles/{slug}.mdx` を作る
2. `content/articles/index.ts` の `ARTICLES` に1行足す（新しい順）

記事内では `<AffiliateButton href="..." />` で購入ページへのボタン（（PR）表記・`rel="sponsored noopener"` つき）を置けます。

## 守っている要件

- **年齢確認**：全ページに重ねて表示。承認は Cookie に30日間保存。「18歳未満です」は外部の一般サイトへ移動。検索エンジンにも同じ HTML を返す（承認済みかどうかは描画前のスクリプトが Cookie を見て判定し、CSS で隠す）
- **成人向けの表明**：全ページの `<head>` に `<meta name="rating" content="adult">`
- **PR表記**：全ページ最上部のPR帯、フッターのアフィリエイト明記、購入ボタンは「作品ページを見る（PR）」、アフィリエイトリンクは `rel="sponsored noopener"`
- **除外**：`exclude_keywords` に当たる作品は表示時にも除外（`lib/data/exclude.ts`）
- **画像**：APIが返す公式サンプル画像の URL をそのまま `<img>` で表示（`next/image` はサーバーで変換・キャッシュするため使わない）

## 技術メモ

- Next.js 16（App Router）で、Cache Components（`cacheComponents: true`）が有効です。データ取得は既定でリクエストごとになるため、キャッシュしたい取得関数には `"use cache"` を付けます。
- 存在しない作品 ID などは not-found ページ（`noindex` 付き）を表示します。部分プリレンダリングの仕組み上、HTTP ステータスは 200 のままです。
