# 🌳 Sulalah — Panduan Deploy v11 (HYBRID EXPORT)

## Perubahan Besar di v11

**2 Mode Ekspor:**

### 1. Ekspor Langsung 💾
- Generate PNG/PDF dari Sulalah
- 5 tema (Bersih, Kayu Jati, Hijau Daun, Langit Subuh, Coklat Kertas)
- 4 ukuran (IG Story, IG Post, A4 Portrait, A4 Landscape)
- Layout horizontal klasik dengan **multi-row auto-wrap**
- Siap pakai, cepat, offline-capable

### 2. Prompt untuk Gemini AI 🎨 (FITUR UNIK)
- Generate prompt detail & siap pakai
- 5 style artistik:
  - 🕌 **Islami Klasik** — kaligrafi, arabesque, emas-hijau
  - ✨ **Modern Minimalis** — bersih, indigo, negative space
  - 📜 **Vintage Manuskrip** — sepia, ornamen floral Victorian
  - 🌸 **Nusantara Batik** — motif batik, sogan palette
  - 🌙 **Elegan Malam** — dark mode, emas, starfield
- User copy prompt → paste ke gemini.google.com → hasil studio-grade
- **Selling point unik Sulalah** — no family tree app lain yang punya ini!

## Fix Layout Bug dari v11-preview

- ✅ **Generasi urut dengan benar** (Gen I/tertua di ATAS, termuda di BAWAH)
- ✅ **Font loading fix** — Google Fonts pre-loaded via document.fonts.load()
- ✅ **Text wrapping** — nama panjang wrap ke 2 baris max
- ✅ **Multi-row per generation** — saat >N anggota, otomatis wrap ke baris baru
- ✅ **Adaptive scaling** — kalau pohon terlalu panjang, auto-scale down
- ✅ **Min card width** — tidak bakal mengecil ekstrim lagi

## Step Deploy

### 1. Push ZIP ke GitHub → Vercel auto deploy

Tidak ada migration SQL baru.

### 2. Test

**Direct Mode:**
1. Buka pohon apapun → klik **🖼️ Ekspor**
2. Pilih **💾 Ekspor Langsung**
3. Wizard 4 step: Ukuran → Tema → Pengaturan → Preview
4. Ekspor PNG atau PDF
5. Cek: generasi terurut benar, nama terbaca, layout rapi

**Gemini Mode:**
1. Klik **🖼️ Ekspor** → pilih **🎨 Buat Prompt Gemini**
2. Wizard 3 step: Ukuran → Style → Copy Prompt
3. Klik **Copy Prompt**
4. Buka https://gemini.google.com di tab baru
5. Paste prompt → submit
6. Hasil harusnya: poster artistic premium dengan gaya yang dipilih
7. (Kalau kurang pas, minta Gemini revisi: "buat lebih detail", "warna lebih gelap", dll)

## File Structure v11

```
lib/
  posterEngine.js       → Canvas renderer (FIXED layout)
  posterThemes.js       → 5 tema + 4 ukuran
  posterStats.js        → Stats calculator
  geminiPrompt.js       → NEW: Gemini prompt generator (5 style)
components/
  PosterStudio.js       → NEW: Hybrid export wizard (direct + gemini)
```

## Tip Marketing

Ini fitur yang bisa kamu highlight di landing page:

> **🎨 Tidak puas dengan tema default?**
> Sulalah punya fitur **Export to Gemini** — dapatkan prompt siap pakai
> untuk generate poster silsilah dengan AI. **Hasilnya kualitas studio**,
> gratis pakai Gemini.

Ini bakal jadi differentiator kuat dari app silsilah lain.
