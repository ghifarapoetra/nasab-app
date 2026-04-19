// 5 Tema Poster — All Free
export const POSTER_THEMES = [
  {
    id: 'bersih',
    name: 'Bersih',
    desc: 'Minimalis modern · Putih bersih',
    preview: ['#ffffff', '#1a1a1a', '#6366f1'],
    colors: {
      bg: '#ffffff', bgAccent: '#f8fafc', paper: '#fefefe',
      text: '#0f172a', textSoft: '#475569', textMuted: '#94a3b8',
      accent: '#6366f1', accentSoft: '#e0e7ff',
      border: '#e2e8f0', ornament: '#cbd5e1',
    },
    font: {
      heading: '"Playfair Display", "Times New Roman", serif',
      body: '"Inter", sans-serif',
      arabic: '"Amiri", "Scheherazade New", serif',
    },
    ornamentStyle: 'dots',
    paperTexture: 'clean',
  },
  {
    id: 'kayu-jati',
    name: 'Kayu Jati',
    desc: 'Hangat natural · Vibe pesantren',
    preview: ['#3d2817', '#c9a578', '#faf6ed'],
    colors: {
      bg: '#faf6ed', bgAccent: '#f3eadb', paper: '#fcf9f2',
      text: '#3d2817', textSoft: '#6b4a2b', textMuted: '#9b8568',
      accent: '#8b5e34', accentSoft: '#e8d7bf',
      border: '#c9a578', ornament: '#b38c5f',
    },
    font: {
      heading: '"Playfair Display", "Times New Roman", serif',
      body: '"Merriweather", serif',
      arabic: '"Amiri", serif',
    },
    ornamentStyle: 'leaves',
    paperTexture: 'wood',
  },
  {
    id: 'hijau-daun',
    name: 'Hijau Daun',
    desc: 'Natural Islami · Segar & hidup',
    preview: ['#14532d', '#86efac', '#f0fdf4'],
    colors: {
      bg: '#f0fdf4', bgAccent: '#dcfce7', paper: '#f7fef9',
      text: '#14532d', textSoft: '#166534', textMuted: '#4d7c5a',
      accent: '#16a34a', accentSoft: '#bbf7d0',
      border: '#86efac', ornament: '#4ade80',
    },
    font: {
      heading: '"Playfair Display", "Times New Roman", serif',
      body: '"Inter", sans-serif',
      arabic: '"Amiri", serif',
    },
    ornamentStyle: 'leaves',
    paperTexture: 'natural',
  },
  {
    id: 'langit-subuh',
    name: 'Langit Subuh',
    desc: 'Biru kalem · Tenang syahdu',
    preview: ['#1e3a8a', '#93c5fd', '#eff6ff'],
    colors: {
      bg: '#eff6ff', bgAccent: '#dbeafe', paper: '#f5f9ff',
      text: '#1e3a8a', textSoft: '#1e40af', textMuted: '#6b7fa9',
      accent: '#2563eb', accentSoft: '#bfdbfe',
      border: '#93c5fd', ornament: '#60a5fa',
    },
    font: {
      heading: '"Playfair Display", "Times New Roman", serif',
      body: '"Inter", sans-serif',
      arabic: '"Amiri", serif',
    },
    ornamentStyle: 'stars',
    paperTexture: 'clean',
  },
  {
    id: 'coklat-kertas',
    name: 'Coklat Kertas',
    desc: 'Kertas kuno · Kesan pusaka',
    preview: ['#3f2a14', '#b8935e', '#f5ecd9'],
    colors: {
      bg: '#f5ecd9', bgAccent: '#ede0c4', paper: '#f8f0dd',
      text: '#3f2a14', textSoft: '#5d421f', textMuted: '#8a6f4a',
      accent: '#8b5e2a', accentSoft: '#d9bf8a',
      border: '#b8935e', ornament: '#a07d46',
    },
    font: {
      heading: '"Playfair Display", "Times New Roman", serif',
      body: '"Merriweather", serif',
      arabic: '"Amiri", serif',
    },
    ornamentStyle: 'vintage',
    paperTexture: 'aged',
  },
]

export function getTheme(id) {
  return POSTER_THEMES.find(t => t.id === id) || POSTER_THEMES[0]
}

// Ukuran yang tersedia - tambah A3 & Kuarto (Letter)
export const POSTER_SIZES = [
  // Social media
  {
    id: 'ig-story',
    name: 'Instagram Story',
    desc: 'Untuk share IG Story, WA Status',
    width: 1080, height: 1920,
    orientation: 'portrait',
    category: 'sosmed',
    aspectRatio: 9 / 16,
  },
  {
    id: 'ig-post',
    name: 'Instagram Post',
    desc: 'Untuk feed IG & WhatsApp',
    width: 1080, height: 1080,
    orientation: 'square',
    category: 'sosmed',
    aspectRatio: 1,
  },
  // Print A4
  {
    id: 'a4-portrait',
    name: 'A4 Portrait',
    desc: 'Kertas biasa, vertikal',
    width: 2480, height: 3508,
    orientation: 'portrait',
    category: 'print',
    aspectRatio: 210 / 297,
  },
  {
    id: 'a4-landscape',
    name: 'A4 Landscape',
    desc: 'Kertas biasa, horizontal',
    width: 3508, height: 2480,
    orientation: 'landscape',
    category: 'print',
    aspectRatio: 297 / 210,
  },
  // Print A3 — lebih besar, ruang lega untuk pohon banyak
  {
    id: 'a3-portrait',
    name: 'A3 Portrait',
    desc: 'Besar vertikal, cocok pohon panjang',
    width: 3508, height: 4961,
    orientation: 'portrait',
    category: 'print',
    aspectRatio: 297 / 420,
  },
  {
    id: 'a3-landscape',
    name: 'A3 Landscape',
    desc: 'Besar horizontal, cocok pohon lebar',
    width: 4961, height: 3508,
    orientation: 'landscape',
    category: 'print',
    aspectRatio: 420 / 297,
  },
  // Print Kuarto (Letter US) — banyak dipakai di Indonesia untuk dokumen resmi
  {
    id: 'kuarto-portrait',
    name: 'Kuarto Portrait',
    desc: 'Kertas kuarto (Letter), vertikal',
    width: 2550, height: 3300,
    orientation: 'portrait',
    category: 'print',
    aspectRatio: 8.5 / 11,
  },
  {
    id: 'kuarto-landscape',
    name: 'Kuarto Landscape',
    desc: 'Kertas kuarto (Letter), horizontal',
    width: 3300, height: 2550,
    orientation: 'landscape',
    category: 'print',
    aspectRatio: 11 / 8.5,
  },
]

export function getSize(id) {
  return POSTER_SIZES.find(s => s.id === id) || POSTER_SIZES[0]
}
