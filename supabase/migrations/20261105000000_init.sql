-- 人外ノ閨：土台編のテーブル（dmm_items / pickups / site_settings）とRLS
--
-- dmm_items は作成済みの schema.sql の内容を取り込む想定。
-- ここでは仕様書に書かれた列で定義している。schema.sql と差がある場合は、
-- この dmm_items の部分を schema.sql の内容に置き換えること。

-- ---------------------------------------------------------------
-- dmm_items：FANZA同人の作品情報（dmm-collector が書き込む）
-- ---------------------------------------------------------------
create table if not exists public.dmm_items (
  content_id      text primary key,
  title           text        not null,
  affiliate_url   text        not null,
  image_url       text,
  price           integer,
  list_price      integer,
  is_on_sale      boolean     not null default false,
  sale_end_at     timestamptz,
  -- APIが返すジャンル：[{"id": 123, "name": "獣人"}, ...]
  genres          jsonb       not null default '[]'::jsonb,
  maker           text,
  release_date    date,
  review_average  numeric(3, 2),
  review_count    integer     not null default 0,
  first_seen_at   timestamptz not null default now(),
  posted          boolean     not null default false
);

create index if not exists dmm_items_release_date_idx on public.dmm_items (release_date desc);
create index if not exists dmm_items_on_sale_idx on public.dmm_items (is_on_sale) where is_on_sale;

-- ---------------------------------------------------------------
-- pickups：今週のピックアップの履歴
-- ---------------------------------------------------------------
create table if not exists public.pickups (
  id          bigint generated always as identity primary key,
  week_start  date        not null,
  content_id  text        not null references public.dmm_items (content_id) on delete cascade,
  score       numeric     not null default 0,
  comment     text        not null default '',
  created_at  timestamptz not null default now(),
  unique (week_start, content_id)
);

create index if not exists pickups_week_start_idx on public.pickups (week_start desc);

-- ---------------------------------------------------------------
-- site_settings：運用ルールの設定
-- ---------------------------------------------------------------
create table if not exists public.site_settings (
  key         text primary key,
  value       jsonb       not null,
  updated_at  timestamptz not null default now()
);

insert into public.site_settings (key, value) values
  -- ピックアップ候補の点数の配分（初期値は「発売から2週間以内」のみ）
  ('pickup_rules', '{"max_days_since_release": 14}'::jsonb),
  -- サイトに表示しない作品を判定する語のリスト（タイトル・サークル名・ジャンル名に含まれたら除外）
  ('exclude_keywords', '[]'::jsonb),
  -- 収集するジャンルIDと、サイト上のジャンルの対応表：[{"genre_id": 123, "slug": "kemono"}, ...]
  -- slug は kemono / monster / machine / ishu のいずれか
  ('target_genres', '[]'::jsonb)
on conflict (key) do nothing;

-- ---------------------------------------------------------------
-- RLS：サイト（anon / authenticated）は読み取りのみ。
-- 書き込みは service role（RLSを通らない）に限る。
-- ---------------------------------------------------------------
alter table public.dmm_items     enable row level security;
alter table public.pickups       enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "dmm_items は誰でも読める" on public.dmm_items;
create policy "dmm_items は誰でも読める"
  on public.dmm_items for select to anon, authenticated using (true);

drop policy if exists "pickups は誰でも読める" on public.pickups;
create policy "pickups は誰でも読める"
  on public.pickups for select to anon, authenticated using (true);

drop policy if exists "site_settings は誰でも読める" on public.site_settings;
create policy "site_settings は誰でも読める"
  on public.site_settings for select to anon, authenticated using (true);

-- 念のため、公開ロールから書き込み権限を外す
revoke insert, update, delete on public.dmm_items, public.pickups, public.site_settings
  from anon, authenticated;
