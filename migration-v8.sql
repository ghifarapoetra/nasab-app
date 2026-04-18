-- =============================================
-- SULALAH v8 — Privatisasi Foto Storage
-- Jalankan di Supabase SQL Editor
-- =============================================

-- ── STEP 1: Hapus policy lama yang terlalu permisif ──
-- Policy lama: "Public photos" → semua orang bisa lihat
drop policy if exists "Public photos" on storage.objects;
drop policy if exists "Users can upload photos" on storage.objects;

-- ── STEP 2: Policy baru — lebih terkontrol ──
-- User yang login bisa upload foto ke bucket photos
create policy "Authenticated users can upload photos"
  on storage.objects for insert
  with check (
    bucket_id = 'photos'
    and auth.role() = 'authenticated'
  );

-- Baca foto: tetap bisa via public URL, TAPI nama file adalah UUID
-- yang tidak bisa ditebak (security by obscurity), plus foto lama
-- yang URL-nya terlanjur tersebar di luar akan kita migrate ke path
-- baru yang randomized.
create policy "Public read via obscure path"
  on storage.objects for select
  using (bucket_id = 'photos');

-- User bisa hapus foto yang mereka upload (via app logic)
create policy "Users can delete own uploads"
  on storage.objects for delete
  using (
    bucket_id = 'photos'
    and auth.role() = 'authenticated'
    and owner = auth.uid()
  );

-- ── STEP 3: Tabel audit log untuk foto ──
-- Track siapa upload/delete foto, dari mana, kapan
create table if not exists photo_audit (
  id uuid default gen_random_uuid() primary key,
  action text check (action in ('upload','delete','access')) not null,
  user_id uuid references profiles(id) on delete set null,
  tree_id uuid references trees(id) on delete cascade,
  person_id uuid references persons(id) on delete set null,
  photo_path text,
  user_agent text,
  ip_address text,
  created_at timestamp with time zone default now()
);

alter table photo_audit enable row level security;

-- Owner pohon bisa lihat audit log pohonnya
create policy "Tree owners view photo audit"
  on photo_audit for select
  using (tree_id in (select id from trees where owner_id = auth.uid()));

-- Semua user bisa insert audit (via app)
create policy "Authenticated users can insert audit"
  on photo_audit for insert
  with check (auth.uid() = user_id);

create index if not exists idx_photo_audit_tree on photo_audit(tree_id);
create index if not exists idx_photo_audit_user on photo_audit(user_id);
create index if not exists idx_photo_audit_date on photo_audit(created_at desc);

-- ── STEP 4: Cleanup trigger ──
-- Kalau person di-delete, foto-nya otomatis dihapus juga dari storage
-- Ini HANYA menyimpan path foto ke tabel untuk di-cleanup oleh cron nanti
create table if not exists photos_to_delete (
  id uuid default gen_random_uuid() primary key,
  photo_path text not null,
  queued_at timestamp with time zone default now()
);

create or replace function queue_photo_delete()
returns trigger as $$
begin
  if OLD.photo_url is not null and OLD.photo_url != '' then
    -- Extract path dari URL (setelah 'photos/')
    insert into photos_to_delete (photo_path)
    values (regexp_replace(OLD.photo_url, '^.*/photos/', ''));
  end if;
  return OLD;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_queue_photo_delete on persons;
create trigger trg_queue_photo_delete
  before delete on persons
  for each row execute function queue_photo_delete();

-- Selesai. Foto existing tidak dihapus, tetap bisa diakses.
-- Upload baru akan pakai path randomized.
