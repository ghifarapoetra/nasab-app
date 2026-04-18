# 🌳 Sulalah — Panduan Deploy v9

## Perubahan di v9

- ✅ Privacy Policy (/privacy)
- ✅ Terms of Service (/terms)
- ✅ Hapus Akun dengan konfirmasi ketat (/hapus-akun)
- ✅ Checkbox setuju T&S di signup
- ✅ Footer legal di semua halaman utama
- ✅ SEO metadata improved

## Step Deploy

### 1. Push ZIP ke GitHub → Vercel auto deploy

Tidak ada migration SQL baru di v9. Hanya file halaman tambahan.

### 2. Setup Email `halo@sulalah.my.id`

Agar email kontak di dokumen legal berfungsi:

1. Login Hostinger → Email → sulalah.my.id
2. Buat akun: `halo@sulalah.my.id`
3. (Opsional tapi direkomendasikan) Setup forwarder ke Gmail pribadi

### 3. Test setelah deploy

- Buka https://sulalah.my.id → scroll ke footer → klik link legal
- Buka https://sulalah.my.id/privacy → pastikan tampil
- Buka https://sulalah.my.id/terms → pastikan tampil
- Coba signup akun baru → checkbox T&S harus muncul dan mandatory
- Login → Dashboard → footer harus muncul dengan link legal
- Test /hapus-akun (pakai akun test, JANGAN akun utama!)

## File Baru

```
app/
  privacy/page.js          → Kebijakan Privasi
  terms/page.js            → Syarat & Ketentuan
  hapus-akun/page.js       → Hapus Akun (UI)
  api/hapus-akun/route.js  → Hapus Akun (API)
components/
  LegalLayout.js           → Layout untuk halaman legal
```

## Catatan Hukum

Dokumen ini dibuat berdasarkan best practice untuk aplikasi indie di Indonesia.
Untuk kepastian hukum yang lebih kuat (khususnya kalau nanti Sulalah berkembang menjadi
PT/bisnis resmi), konsultasikan dengan pengacara spesialis teknologi.

