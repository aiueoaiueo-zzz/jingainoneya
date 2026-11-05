-- 人外ノ閨 段階A：利用者が書き込む3つのテーブル（comments / contact_messages / diagnosis_results）とRLS
--
-- 書き込みはすべてサイトのサーバー処理（app/api/）から service role で行う。
-- サイト（anon）から読めるのは「公開済みのコメント」と「診断結果の件数の集計」だけ。
-- 記事・ジャンル・診断の中身はファイルで管理し、ここには入れない。
-- 段階Bの作品テーブル（dmm_items など）はここでは作らない。

-- ---------------------------------------------------------------
-- comments：記事のコメント
-- ---------------------------------------------------------------
create table if not exists public.comments (
  id             bigint generated always as identity primary key,
  article_slug   text        not null,
  name           text        not null check (char_length(name) between 1 and 20),
  body           text        not null check (char_length(body) between 5 and 400),
  -- published：表示中 / rejected：内容の確認で非表示 / pending：確認に失敗（管理人があとで確認）
  status         text        not null check (status in ('published', 'rejected', 'pending')),
  reject_reason  text,
  -- 連投防止用。IPアドレスそのものは保存せず、元に戻せない形（ハッシュ）だけを保存する
  ip_hash        text        not null,
  created_at     timestamptz not null default now()
);

create index if not exists comments_article_idx on public.comments (article_slug, created_at) where status = 'published';
create index if not exists comments_ip_hash_idx on public.comments (ip_hash, created_at desc);

-- ---------------------------------------------------------------
-- contact_messages：お問い合わせ
-- ---------------------------------------------------------------
create table if not exists public.contact_messages (
  id          bigint generated always as identity primary key,
  name        text        not null default '' check (char_length(name) <= 40),
  email       text        not null default '' check (char_length(email) <= 120),
  type        text        not null,
  body        text        not null check (char_length(body) between 1 and 2000),
  created_at  timestamptz not null default now(),
  -- 対応済みか（管理人が Supabase の画面で true にする）
  handled     boolean     not null default false
);

-- ---------------------------------------------------------------
-- diagnosis_results：診断結果の集計（みんなの結果）
-- ---------------------------------------------------------------
create table if not exists public.diagnosis_results (
  id            bigint generated always as identity primary key,
  diagnosis_id  text        not null,
  result_key    text        not null,
  -- 同じ端末の重複を防ぐためのハッシュ（端末ごとの値を元に戻せない形にしたもの）
  client_hash   text        not null,
  -- 記録した日（日本時間）。同じ端末・同じ診断は1日1回まで
  result_date   date        not null default ((now() at time zone 'Asia/Tokyo')::date),
  created_at    timestamptz not null default now(),
  unique (diagnosis_id, client_hash, result_date)
);

create index if not exists diagnosis_results_id_idx on public.diagnosis_results (diagnosis_id);

-- ---------------------------------------------------------------
-- RLS（行ごとの読み書きの決まり）
-- ---------------------------------------------------------------
alter table public.comments          enable row level security;
alter table public.contact_messages  enable row level security;
alter table public.diagnosis_results enable row level security;

-- 公開ロールからは、いったん全部の権限を外す
revoke all on public.comments, public.contact_messages, public.diagnosis_results from anon, authenticated;

-- コメント：公開済みのものだけ、表示に必要な列だけ読める（ip_hash などは読めない）
grant select (id, article_slug, name, body, status, created_at) on public.comments to anon, authenticated;
drop policy if exists "公開済みのコメントは誰でも読める" on public.comments;
create policy "公開済みのコメントは誰でも読める"
  on public.comments for select to anon, authenticated
  using (status = 'published');

-- お問い合わせ：サイトからは読めない（ポリシーなし）
-- 診断結果：表は読めない。件数の集計だけを、下の関数で返す

create or replace function public.diagnosis_counts(p_diagnosis_id text)
returns table (result_key text, count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select r.result_key, count(*)::bigint
  from public.diagnosis_results r
  where r.diagnosis_id = p_diagnosis_id
  group by r.result_key
$$;

revoke all on function public.diagnosis_counts(text) from public;
grant execute on function public.diagnosis_counts(text) to anon, authenticated, service_role;
