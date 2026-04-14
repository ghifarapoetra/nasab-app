-- =============================================
-- SULALAH v3 — Multi-tree migration
-- Jalankan di Supabase SQL Editor
-- =============================================

-- 1. Tabel pohon keluarga
create table if not exists trees (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  description text,
  is_public boolean default false,
  created_at timestamp with time zone default now()
);

-- 2. Tambah kolom tree_id ke persons
alter table persons add column if not exists tree_id uuid references trees(id) on delete cascade;

-- 3. RLS untuk trees
alter table trees enable row level security;

create policy "Users can manage own trees"
  on trees for all using (auth.uid() = owner_id);

-- 4. Update policy persons agar filter by tree juga
drop policy if exists "Users can manage own persons" on persons;
create policy "Users can manage own persons"
  on persons for all using (auth.uid() = owner_id);

-- 5. Index untuk performa
create index if not exists idx_trees_owner on trees(owner_id);
create index if not exists idx_persons_tree on persons(tree_id);
