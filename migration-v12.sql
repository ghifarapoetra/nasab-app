-- =============================================
-- SULALAH v12 — Form Alamat + Marriages Table Fix
-- Jalankan di Supabase SQL Editor
-- =============================================

-- ── STEP 1: Tambah kolom address ke persons ──
alter table persons add column if not exists address text;

-- ── STEP 2: Buat tabel marriages (yang seharusnya ada dari v7) ──
-- Ini kemungkinan tidak ke-create di migration v7 dulu.
-- Kita create sekarang biar bisa pakai fitur "pasangan/spouse"
create table if not exists marriages (
  id uuid default gen_random_uuid() primary key,
  tree_id uuid references trees(id) on delete cascade,
  person1_id uuid references persons(id) on delete cascade,
  person2_id uuid references persons(id) on delete cascade,
  marriage_year integer,
  status text default 'active' check (status in ('active','divorced','deceased')),
  notes text,
  created_at timestamp with time zone default now(),
  -- Pastikan tidak ada duplikat pasangan (urutan id tidak penting)
  constraint unique_marriage check (person1_id < person2_id)
);

create index if not exists idx_marriages_tree on marriages(tree_id);
create index if not exists idx_marriages_p1 on marriages(person1_id);
create index if not exists idx_marriages_p2 on marriages(person2_id);

-- RLS: hanya member tree yang bisa baca/edit
alter table marriages enable row level security;

drop policy if exists "tree members can read marriages" on marriages;
create policy "tree members can read marriages"
  on marriages for select
  using (
    tree_id in (
      select id from trees where owner_id = auth.uid()
      union
      select tree_id from tree_members where user_id = auth.uid()
    )
  );

drop policy if exists "tree editors can manage marriages" on marriages;
create policy "tree editors can manage marriages"
  on marriages for all
  using (
    tree_id in (
      select id from trees where owner_id = auth.uid()
      union
      select tree_id from tree_members where user_id = auth.uid() and role in ('editor','owner')
    )
  );

-- Selesai
