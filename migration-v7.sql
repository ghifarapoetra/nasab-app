-- =============================================
-- SULALAH v7 — Trakteer Payment Integration
-- Jalankan di Supabase SQL Editor
-- =============================================

-- Tabel log transaksi Trakteer
create table if not exists trakteer_payments (
  id uuid default gen_random_uuid() primary key,
  transaction_id text unique not null,
  supporter_name text,
  supporter_message text,
  amount int,
  quantity int default 1,
  unit_name text,
  matched_user_id uuid references profiles(id) on delete set null,
  matched_email text,
  status text check (status in ('received','matched','activated','unmatched')) default 'received',
  raw_payload jsonb,
  created_at timestamp with time zone default now()
);

alter table trakteer_payments enable row level security;

-- Owner bisa lihat transaksi mereka sendiri
create policy "Users see own trakteer payments"
  on trakteer_payments for select
  using (auth.uid() = matched_user_id);

-- Index untuk pencarian cepat
create index if not exists idx_trakteer_tx_id on trakteer_payments(transaction_id);
create index if not exists idx_trakteer_user on trakteer_payments(matched_user_id);
create index if not exists idx_trakteer_email on trakteer_payments(matched_email);
create index if not exists idx_trakteer_status on trakteer_payments(status);
