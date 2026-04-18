# 🌳 Sulalah — Panduan Deploy v11

## Perubahan di v11: Sulalah Poster Studio

Total overhaul fitur ekspor. Sekarang bukan "screenshot" tree view,
tapi **artwork baru** yang di-render dari data silsilah.

### Fitur Baru

- **Wizard 4 langkah**: Ukuran → Tema → Pengaturan → Preview & Ekspor
- **4 Ukuran**: Instagram Story, Instagram Post, A4 Portrait, A4 Landscape
- **5 Tema Gratis**:
  1. Bersih (minimalis modern)
  2. Kayu Jati (hangat pesantren)
  3. Hijau Daun (natural Islami)
  4. Langit Subuh (biru kalem)
  5. Coklat Kertas (kertas kuno)
- **Layout Klasik Horizontal** dengan auto-adaptive spacing per generasi
- **Statistik Keluarga**: total anggota, generasi, rentang tahun (toggle)
- **Watermark**: "🌳 sulalah.my.id" di pojok kanan bawah
- **Export PNG** (untuk share sosmed)
- **Export PDF** (untuk cetak)

## Step Deploy

### 1. Push ZIP ke GitHub → Vercel auto deploy

Tidak ada migration SQL baru di v11.

### 2. Test

1. Buka pohon apapun yang ada anggotanya
2. Klik tombol **🖼️ Ekspor** di topbar
3. Ikuti wizard:
   - Pilih ukuran (misal: IG Story)
   - Pilih tema (misal: Bersih)
   - Toggle statistik keluarga
   - Pilih format PNG
4. Preview tampil → klik **💾 Ekspor PNG**
5. File ter-download dengan nama `sulalah-[nama-pohon]-[timestamp].png`

### 3. Yang Harus Dicek

- ✅ Wizard step berjalan lancar (1→2→3→4)
- ✅ Preview muncul di step 4
- ✅ Semua 5 tema render dengan benar
- ✅ Semua 4 ukuran render dengan benar
- ✅ Anggota muncul di generasi yang tepat
- ✅ Garis penghubung antar generasi ada
- ✅ Watermark sulalah.my.id tampil di kanan bawah
- ✅ PNG download berhasil
- ✅ PDF download berhasil & bisa dibuka

## Rencana ke Depan

**v12 (setelah launch + dapat user):**
- Layout Radial (pohon center-out)
- Layout Kitab Nasab (list formal per generasi)
- 10 tema premium (Kaligrafi Emas, Batik Nusantara, Malam Berbintang, dll)
- Watermark halus untuk user premium
- Ukuran A3, A5, Custom
- Cover page dengan dalil

**File baru di v11:**
```
lib/
  posterEngine.js     → Canvas renderer utama (747 baris)
  posterThemes.js     → 5 tema + 4 ukuran
  posterStats.js      → Kalkulator statistik keluarga
components/
  PosterStudio.js     → Wizard modal (274 baris)
```

**File lama yang masih ada (belum dihapus, fallback):**
- `lib/pdfExport.js` — engine lama
- `components/PdfThemeModal.js` — modal lama

Kedua file lama masih ada di project tapi tidak dipakai lagi.
Aman untuk dihapus di v12 setelah yakin v11 stabil.
