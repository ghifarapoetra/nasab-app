# 🌳 Sulalah — Panduan Deploy v7

## Urutan deploy (WAJIB berurutan)

### 1. Supabase — Jalankan migration v7
Buka SQL Editor, jalankan:
- `migration-v7.sql` (tabel trakteer_payments)

Migration v3-v6 sebelumnya tidak perlu diulang kalau sudah dijalankan.

### 2. Trakteer — Setup Webhook

1. Login ke [trakteer.id](https://trakteer.id) → Dashboard
2. Menu: **Integrasi → Webhook**
3. Masukkan URL endpoint:
   ```
   https://sulalah.my.id/api/trakteer-webhook
   ```
4. Klik **Send Webhook Test** untuk verifikasi
5. **Aktifkan Webhook** (toggle ON)
6. **Salin Token Webhook** — akan dipakai di Vercel

### 3. Vercel — Environment Variables

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | https://XXXX.supabase.co |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | sb_publishable_XXXX |
| `SUPABASE_SERVICE_ROLE_KEY` | sb_secret_XXXX |
| `TRAKTEER_WEBHOOK_TOKEN` | token dari Trakteer (step 2) |
| `NEXT_PUBLIC_APP_URL` | https://sulalah.my.id |
| `NEXT_PUBLIC_UMROH_LINK` | https://wa.me/... |

Env var Midtrans lama boleh dihapus.

### 4. Push ke GitHub → Vercel auto deploy

### 5. Test Payment
1. Daftar akun baru di Sulalah
2. Buka `/upgrade`
3. Salin email → klik "Ke Trakteer"
4. Di Trakteer, pilih 1 Pohon (Rp 29.000)
5. **PENTING:** Paste email di kolom "Pesan dari Supporter"
6. Bayar via QRIS
7. Cek 1-3 menit — Premium harus aktif otomatis
8. Refresh dashboard, konfirmasi status Premium

Jika gagal: cek di `/klaim-premium` untuk klaim manual.
