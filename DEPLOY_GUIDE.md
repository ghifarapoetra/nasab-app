# 🌳 Sulalah — Deploy v11.2

## Perubahan dari v11.1

### 🔧 Fix Favicon
- Problem: favicon globe default Chrome muncul lagi (bukan 🌳 Sulalah)
- Cause: layout.js tidak punya link/metadata icon eksplisit
- Fix:
  - Tambah `icons` metadata di `app/layout.js`
  - Tambah `<link rel="icon">` eksplisit di `<head>`
  - Copy favicon ke `app/icon.svg` (Next.js 14 auto-detect convention)

### 📐 Ukuran Baru — A3 & Kuarto
Sekarang tersedia 8 ukuran (sebelumnya 4):
- Instagram Story (1080×1920)
- Instagram Post (1080×1080)
- A4 Portrait / Landscape (2480×3508 / 3508×2480)
- **A3 Portrait / Landscape** (3508×4961 / 4961×3508) ⭐ BARU
- **Kuarto Portrait / Landscape** (2550×3300 / 3300×2550) ⭐ BARU

A3 cocok untuk pohon besar yang butuh ruang lega.
Kuarto (Letter US, 8.5"×11") umum dipakai untuk dokumen resmi Indonesia.

### ✨ Prompt Gemini Lebih Akurat

**Masalah sebelumnya:** Gemini ngarang data (menambah anggota, salah hubungan)

**Fix — prompt v2 sekarang:**
1. **Explicit "JANGAN DITAMBAH/DIKURANGI/DIUBAH"** di awal prompt
2. **Hierarki per generasi** lengkap dengan counter ("Generasi II — 4 orang")
3. **Daftar relationships eksplisit** ("Rifamumza anak dari ayah: Arif Agus")
4. **Daftar saudara kandung** untuk membantu AI tahu siapa yang sejajar
5. **Verifikasi akhir** — checklist yang AI harus confirm
6. **Larangan keras** tertulis jelas

Ini membuat AI jauh lebih disiplin mengikuti data, bukan mengarang.

## File yang Diupdate

- `app/layout.js` — favicon metadata
- `app/icon.svg` — BARU (copy dari public/favicon.svg)
- `lib/posterThemes.js` — tambah A3 & Kuarto
- `lib/posterEngine.js` — PDF export support A3 & Kuarto
- `lib/geminiPrompt.js` — rewrite untuk akurasi tinggi

## Step Deploy

### 1. Push ZIP ke GitHub → Vercel auto deploy

Tidak ada migration SQL baru.

### 2. Test Favicon

- Buka https://sulalah.my.id di Incognito (bypass cache)
- Lihat tab browser: harus muncul ikon pohon Sulalah, bukan globe
- Kalau masih globe, hard refresh (Ctrl+Shift+R)

### 3. Test Ukuran Baru

- Klik 🖼️ Ekspor → Ekspor Langsung
- Di Step 1 (pilih ukuran), sekarang ada 8 opsi termasuk A3 & Kuarto
- Pilih A3 Landscape, lanjutkan sampai preview
- Download PDF — harusnya ukuran A3 (297×420 mm)

### 4. Test Prompt Gemini

- Klik 🖼️ Ekspor → Buat Prompt Gemini
- Pilih ukuran & style
- Copy prompt → paste ke gemini.google.com
- Prompt sekarang punya **structured data lebih jelas**:
  - Hierarki generasi
  - Daftar relationships eksplisit
  - Daftar saudara kandung
  - Verifikasi checklist
- Hasil Gemini harus lebih akurat, tidak ngarang
