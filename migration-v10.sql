-- =============================================
-- SULALAH v10 — Ikon/Foto per Pohon (Free Feature)
-- Jalankan di Supabase SQL Editor
-- =============================================

-- Tambah kolom icon & cover_photo_url ke trees
alter table trees add column if not exists icon text default '🌳';
alter table trees add column if not exists cover_photo_url text;

-- Policy storage: izinkan upload cover pohon
-- (sudah mengikuti policy yang ada dari migration-v8)
-- Path foto cover akan berformat: trees/{tree_id}/cover-{random}.jpg
