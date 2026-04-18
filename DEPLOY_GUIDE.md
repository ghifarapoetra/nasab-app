# 🌳 Sulalah — Panduan Deploy v8

## Urutan deploy

### 1. Supabase — Jalankan migration v8
Buka SQL Editor, jalankan:
- `migration-v8.sql` (privatisasi foto storage + audit log)

Migration v3-v7 sebelumnya tidak perlu diulang jika sudah dijalankan.

### 2. Push ke GitHub → Vercel auto deploy

### 3. Test upload foto
1. Login ke Sulalah, buka pohon apapun
2. Tambah anggota + upload foto
3. Verifikasi di Supabase → Storage → bucket `photos`
   - File baru harus punya path format: `{tree-id}/{random-32-char}-{timestamp}.jpg`
4. Cek tabel `photo_audit` di SQL Editor — harus ada row baru setiap upload

### 4. Foto lama tetap aman
Foto yang di-upload sebelumnya tetap bisa diakses. URL-nya tidak berubah.
Hanya upload BARU yang pakai path randomized.

## Prinsip Keamanan

- ✅ Bucket `photos` tetap public (untuk simplicity & performance)
- 🔒 Path file: UUID 32 karakter + timestamp — tidak bisa ditebak
- 🔒 Per-tree isolation: `photos/{tree-id}/...`
- 🔒 Audit log setiap upload (siapa, kapan, dari mana)
- 🔒 Auto-queue delete ketika person dihapus

## Skenario Aman

| Situasi | Hasil |
|---|---|
| User A upload foto | Hanya user A & member pohon A yang tahu URL-nya |
| URL tersebar di WA | Orang luar tidak akan menemukan URL ini kecuali dapat dari app |
| Hacker coba enumerasi URL | Tidak feasible — 36^32 = 63 miliar miliar kombinasi |
| User A hapus person | Foto masuk antrian cleanup, hilang dari storage |

