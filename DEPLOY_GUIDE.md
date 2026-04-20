# 🌳 Sulalah — Deploy v12 (Final)

## 📋 Ringkasan Perubahan

### 1. 📍 Field Alamat
Tambah kolom `address` di tabel `persons`. Muncul sebagai textarea di form edit profil.

### 2. 🔤 Dropdown Urut Abjad
Dropdown **Ayah**, **Ibu**, **Pasangan** semuanya sekarang diurut alphabetical (localeCompare ID).
Label dropdown menunjukkan jumlah kandidat: "Ayah (5)", "Ibu (8)", dll.

### 3. 💍 Dropdown Pasangan (Fitur Baru)
Di form edit profil, tambah selector "Pasangan (Istri/Suami)":
- Auto-filter berdasarkan gender opposite
- Urut alphabetical
- Pilih & save → otomatis insert ke tabel `marriages`
- Kalau sudah punya pasangan → tampil sebagai card dengan tombol "Lepas"
- Tombol lepas → hapus record marriage (tidak hapus person)

### 4. 🎨 Garis Canvas Dibalikin ke Curve Original
Feedback: L-shape rounded kurang oke. Sekarang garis kembali ke **bezier curve lembut** seperti versi awal. Warna & ketebalan original juga dipulihkan.

### 5. 📸 Ekspor Pakai Screenshot Canvas (Major Change)
Insight dari tester: hasil screenshot jauh lebih akurat dari engine custom.

Sekarang **Ekspor Langsung** menggunakan `html2canvas`:
- Capture canvas tree yang sudah ter-render
- Tambahkan header (nama pohon, tanggal, penyusun)
- Tambahkan footer (stats: total anggota, generasi, rentang tahun)
- Tambahkan watermark sulalah.my.id
- Export PNG atau PDF dengan ukuran A3/A4/Kuarto/IG

**Kelebihan:** hasil **pasti sesuai** dengan yang terlihat di canvas. Tidak ada lagi generasi yang salah posisi.

### 6. 🔍 Zoom di Canvas (dari v12-draft)
Tombol `+` / `%` / `−` di pojok kanan atas canvas + Ctrl+Scroll. Range 40% - 200%.

### 7. 🧠 Engine Generasi Smart Support Marriages
`calculateGenerationLevels()` sekarang menerima parameter `marriages`:
- Layer 1: parent → level
- Layer 2: pasangan via marriages table **ATAU** shared children
- Layer 3: punya anak
- Layer 4: leluhur sejati

## 🚨 WAJIB: Jalankan Migration

File: `migration-v12.sql`

Isi:
1. Tambah kolom `address` ke `persons`
2. **Create table `marriages`** (ternyata belum ada di Supabase kamu, meskipun di-mention di v7)
3. RLS policies untuk marriages

Jalankan di Supabase SQL Editor SEBELUM deploy.

## 📦 Install Dependency Baru

`html2canvas` ditambahkan di package.json.

Vercel akan auto-install saat build. Kalau development lokal:
```bash
npm install
```

## Step Deploy

### 1. Run Migration
Buka Supabase → SQL Editor → paste isi `migration-v12.sql` → Run

### 2. Push ZIP ke GitHub → Vercel auto deploy

### 3. Test Scenario

**A. Test Form Alamat:**
- Edit profil → scroll ke "📍 Alamat"
- Isi alamat → Save
- Buka lagi → alamat tersimpan

**B. Test Dropdown Urut Abjad:**
- Edit profil → lihat dropdown Ayah/Ibu
- Nama-nama harus urut A-Z

**C. Test Dropdown Pasangan:**
- Edit profil Rifamumza → scroll ke "💍 Pasangan"
- Pilih "Putri Artha Yusmika Dewi" → Save
- Edit lagi Rifamumza → sekarang tampil card "💖 Putri Artha" dengan tombol Lepas
- Di canvas, Putri Artha akan sejajar dengan Rifamumza (Gen IV)

**D. Test Canvas:**
- Garis koneksi kembali curve halus (bukan L-shape)
- Zoom tombol di pojok kanan atas canvas
- Ctrl + Scroll wheel di canvas → zoom

**E. Test Ekspor:**
- 🖼️ Ekspor → Ekspor Langsung
- Pilih ukuran (A3 Landscape cocok untuk pohon besar)
- Preview → hasilnya screenshot canvas + header/footer Sulalah
- Download PNG atau PDF

**F. Test Gemini Prompt:**
- 🖼️ Ekspor → Buat Prompt Gemini
- Prompt sekarang pakai data marriages juga untuk hierarki yang akurat

## File yang Berubah

```
migration-v12.sql         → BARU (wajib jalankan)
lib/
  generationLevel.js      → support marriages parameter
  canvasScreenshot.js     → BARU (html2canvas-based exporter)
  posterStats.js          → terima marriages param
  geminiPrompt.js         → terima marriages param
components/
  PersonForm.js           → alamat + sorted dropdowns + spouse selector
  FamilyTree.js           → curve original + zoom + marriages support
  PosterStudio.js         → switch ke screenshot mode
app/tree/[id]/page.js     → load marriages + auto-save on spouse select
package.json              → tambah html2canvas
```

## ⚠️ Catatan Penting

**Untuk pohon Martodimejo kamu:** setelah deploy & migration:
1. Edit Mbah Roko → set Ayah = Mudiyono Martodimejo
2. Edit Rifamumza → set Pasangan = Putri Artha Yusmika Dewi
3. Edit pasangan-pasangan lain (Mu'minah ↔ Arif, Jamilah ↔ Sutrisno, dll.) via dropdown Pasangan
4. Engine akan otomatis menempatkan mereka sejajar di canvas
5. Ekspor poster → hasil sekarang pasti akurat (screenshot canvas)

Jazakallah khayran atas kesabarannya testing. v12 ini insya Allah final untuk fitur poster. 🌳
