-- =============================================
-- SULALAH v13 — Radha'ah (Saudara Sepersusuan) + Mahram Mushaharah
-- Jalankan di Supabase SQL Editor
-- =============================================

-- Tabel relasi saudara sepersusuan (radha'ah)
-- Satu baris = dua orang yang pernah disusui ibu yang sama
create table if not exists radha_relations (
  id uuid default gen_random_uuid() primary key,
  tree_id uuid references trees(id) on delete cascade,
  person1_id uuid references persons(id) on delete cascade,
  person2_id uuid references persons(id) on delete cascade,
  milk_mother text,         -- nama ibu susu (opsional, bisa tidak ada di pohon)
  notes text,
  created_at timestamp with time zone default now(),
  -- Pastikan tidak ada duplikat (urutan id tidak penting)
  constraint unique_radha check (person1_id < person2_id),
  constraint no_self_radha check (person1_id <> person2_id)
);

create index if not exists idx_radha_tree on radha_relations(tree_id);
create index if not exists idx_radha_p1 on radha_relations(person1_id);
create index if not exists idx_radha_p2 on radha_relations(person2_id);

-- RLS
alter table radha_relations enable row level security;

drop policy if exists "tree members can read radha" on radha_relations;
create policy "tree members can read radha"
  on radha_relations for select
  using (
    tree_id in (
      select id from trees where owner_id = auth.uid()
      union
      select tree_id from tree_members where user_id = auth.uid()
    )
  );

drop policy if exists "tree editors can manage radha" on radha_relations;
create policy "tree editors can manage radha"
  on radha_relations for all
  using (
    tree_id in (
      select id from trees where owner_id = auth.uid()
      union
      select tree_id from tree_members where user_id = auth.uid() and role in ('editor','owner')
    )
  );

-- Selesai
