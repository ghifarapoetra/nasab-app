# 🌳 Sulalah — Panduan Deploy v10

## Perubahan di v10

- 🎨 **Ikon/Foto per Pohon** (FREE fitur untuk semua user)
  - 10 pilihan ikon Islami (🌳 🌴 🌲 🏡 🕌 📖 ⭐ ☪️ 🌙 🌿)
  - Upload foto custom (3MB max)
  - Muncul di dashboard card & topbar pohon

## Step Deploy

### 1. Jalankan migration di Supabase
SQL Editor → paste isi `migration-v10.sql` → Run.

Ini cuma tambah 2 kolom (`icon`, `cover_photo_url`) ke tabel `trees`. Data existing aman.

### 2. Push ZIP ke GitHub → Vercel auto deploy

### 3. Test
1. Buka dashboard → klik ikon 🎨 di salah satu pohon
2. Modal pilih ikon/foto muncul
3. Coba ganti ke ikon lain → Save → ikon baru muncul
4. Coba upload foto → ikon diganti dengan foto
5. Buka pohon → topbar dan empty state juga ikut berubah

## Catatan

- Foto cover pohon tersimpan di bucket `photos` di folder `trees/{tree-id}/cover-*.jpg`
- Nama file random 24 karakter (tidak bisa ditebak)
- Hanya **owner pohon** yang bisa ubah ikon/foto
- Ikon default saat bikin pohon baru: 🌳
