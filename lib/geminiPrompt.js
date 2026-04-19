// Gemini Prompt Generator
// Convert tree data into detailed image-generation prompts with style variations

import { calculateFamilyStats } from './posterStats'

export const PROMPT_STYLES = [
  {
    id: 'islami-klasik',
    name: 'Islami Klasik',
    emoji: '🕌',
    desc: 'Kaligrafi Arab, ornamen arabesque, warna emas-hijau',
    aesthetic: `style: traditional Islamic manuscript aesthetic with Arabic calligraphy elements, arabesque geometric patterns, gold leaf accents on deep forest green background, ornate borders inspired by Ottoman and Andalusian art, elegant serif and Arabic Naskh typography, warm candlelight tones`,
    extra: `Include subtle Islamic geometric patterns (8-pointed stars, interlocking polygons) in the background. Use deep emerald green (#0f5132), rich gold (#d4af37), and cream (#fef3d0) as primary colors. Arabic calligraphy header: "تَعَلَّمُوا مِنْ أَنْسَابِكُمْ" at the top in elegant Thuluth script`,
  },
  {
    id: 'modern-minimalis',
    name: 'Modern Minimalis',
    emoji: '✨',
    desc: 'Bersih, serif elegan, warna netral, negative space',
    aesthetic: `style: contemporary minimalist design, generous white space, precise geometric layout, clean sans-serif and modern serif typography pairing, subtle shadows, grid-based structure`,
    extra: `Use a restrained color palette: off-white background (#fafaf9), charcoal text (#1c1917), single accent color indigo (#4338ca). Typography: Playfair Display for names, Inter for meta. No ornamental patterns — rely on layout hierarchy and whitespace for visual impact`,
  },
  {
    id: 'vintage-manuskrip',
    name: 'Vintage Manuskrip',
    emoji: '📜',
    desc: 'Seperti naskah kuno, sepia, ornamen floral',
    aesthetic: `style: aged parchment manuscript aesthetic, sepia and brown tones, weathered paper texture with subtle stains and fiber details, ornate Victorian floral borders, hand-lettered calligraphy feel, nostalgic heritage document look`,
    extra: `Use aged paper background (#f5ecd9), dark brown text (#3f2a14), burnished gold accents (#b8935e). Add subtle paper texture with light staining at edges. Decorative Victorian-era scroll ornaments at corners. Typography: serif with calligraphic flourishes. Overall feel: "family heirloom document passed down generations"`,
  },
  {
    id: 'nusantara-batik',
    name: 'Nusantara Batik',
    emoji: '🌸',
    desc: 'Pattern batik Indonesia, warna khas Jawa',
    aesthetic: `style: Indonesian heritage design with traditional batik patterns (parang, kawung, or mega mendung motifs) as subtle background, warna sogan colors (deep brown, indigo, cream), wayang-inspired ornamental frames, blend of tradition and elegance`,
    extra: `Use traditional batik sogan palette: deep brown (#5d3a1a), indigo (#1e3a5f), cream (#f5ecd6). Incorporate subtle batik parang pattern as background texture (very low opacity, decorative). Ornamental wayang-style borders. Typography: serif with slight hand-drawn Javanese aksara influence for decorative elements`,
  },
  {
    id: 'elegan-malam',
    name: 'Elegan Malam',
    emoji: '🌙',
    desc: 'Dark mode premium, emas, starfield',
    aesthetic: `style: luxurious dark elegant design, deep navy or midnight black background with subtle starfield, gold metallic accents, modern serif typography, premium magazine aesthetic, celestial Islamic night sky feel`,
    extra: `Use rich dark palette: midnight navy background (#0b1437), burnished gold text and ornaments (#e0b849), soft cream highlights (#f5e9c8). Add subtle starfield or constellation pattern in background. Thin gold border frame. Header in gold serif with small crescent moon ornament. Feel: "premium heritage document under candlelight"`,
  },
]

export function getStyle(id) {
  return PROMPT_STYLES.find(s => s.id === id) || PROMPT_STYLES[0]
}

// Main prompt builder
export function buildGeminiPrompt({ persons, treeName, treeDesc, sizeId, styleId, ownerName }) {
  const stats = calculateFamilyStats(persons)
  const style = getStyle(styleId)
  const sizeInfo = getSizeInfo(sizeId)

  const treeStructure = formatTreeStructure(persons)
  const memberCount = persons.length

  return `Buatkan poster silsilah keluarga Muslim yang indah dan artistik dengan spesifikasi berikut:

━━━━━━━━━━━━━━━━━━━━━━━━
📐 SPESIFIKASI OUTPUT
━━━━━━━━━━━━━━━━━━━━━━━━
Format: ${sizeInfo.label}
Aspect ratio: ${sizeInfo.ratio}
Orientasi: ${sizeInfo.orientation}

━━━━━━━━━━━━━━━━━━━━━━━━
🎨 GAYA VISUAL
━━━━━━━━━━━━━━━━━━━━━━━━
${style.aesthetic}

${style.extra}

━━━━━━━━━━━━━━━━━━━━━━━━
📛 JUDUL & META
━━━━━━━━━━━━━━━━━━━━━━━━
Nama pohon: "${treeName || 'Keluarga Besar'}"
${treeDesc ? `Deskripsi: ${treeDesc}` : ''}
Label kecil di atas judul: "SILSILAH KELUARGA"
${ownerName ? `Disusun oleh: ${ownerName}` : ''}
Tanggal: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}

━━━━━━━━━━━━━━━━━━━━━━━━
🌳 STRUKTUR POHON SILSILAH
━━━━━━━━━━━━━━━━━━━━━━━━
Total ${memberCount} anggota tersebar di ${stats.generations} generasi.
${stats.yearRange ? `Rentang tahun: ${stats.yearRange}` : ''}

${treeStructure}

━━━━━━━━━━━━━━━━━━━━━━━━
📐 LAYOUT & STRUKTUR
━━━━━━━━━━━━━━━━━━━━━━━━
- Layout horizontal (pohon dari atas ke bawah)
- Generasi TERTUA di ATAS (Gen I), generasi TERMUDA di BAWAH
- Setiap anggota dalam kartu persegi panjang dengan rounded corner
- Nama lengkap di atas, tahun lahir-wafat di bawah
- Tanda ☪ untuk anggota yang sudah wafat (almarhum/ah)
- Garis penghubung BERSIH dan GEOMETRIS (bukan diagonal) dari anak ke orangtua
- Laki-laki: aksen warna biru gelap. Perempuan: aksen warna pink/maroon lembut
- Label "GEN. I", "GEN. II", dst. di kiri setiap baris
- Jangan render nama saling tumpang tindih — berikan ruang napas yang cukup

━━━━━━━━━━━━━━━━━━━━━━━━
📊 FOOTER
━━━━━━━━━━━━━━━━━━━━━━━━
Tampilkan 3 statistik di bawah:
- Total Anggota: ${stats.total}
- Generasi: ${stats.generations}
- Rentang Tahun: ${stats.yearRange || '—'}

Watermark di pojok kanan bawah: "🌳 sulalah.my.id"

━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ PENTING
━━━━━━━━━━━━━━━━━━━━━━━━
- Pastikan SEMUA NAMA dari data di atas muncul dan TERBACA jelas
- Jangan menambah anggota yang tidak ada di struktur
- Jangan ubah hubungan keluarga (siapa anak siapa)
- Gaya ${style.name} harus terasa kuat dan konsisten
- Buat seperti karya seni yang layak dicetak dan dipajang di ruang keluarga

Terima kasih. Tolong buatkan dengan keindahan dan ketelitian.`
}

// Format tree into human-readable hierarchy
function formatTreeStructure(persons) {
  if (!persons || persons.length === 0) return '(pohon kosong)'

  const byId = {}
  persons.forEach(p => { byId[p.id] = p })

  const childrenMap = {}
  persons.forEach(p => {
    [p.father_id, p.mother_id].filter(pid => pid && byId[pid]).forEach(pid => {
      if (!childrenMap[pid]) childrenMap[pid] = []
      if (!childrenMap[pid].includes(p.id)) childrenMap[pid].push(p.id)
    })
  })

  const ids = new Set(persons.map(p => p.id))
  const roots = persons.filter(p =>
    (!p.father_id || !ids.has(p.father_id)) &&
    (!p.mother_id || !ids.has(p.mother_id))
  )

  // Compute level
  const level = {}
  const queue = roots.map(r => ({ id: r.id, lvl: 0 }))
  const seen = new Set()
  while (queue.length > 0) {
    const { id, lvl } = queue.shift()
    if (seen.has(id)) {
      if ((level[id] ?? 999) > lvl) level[id] = lvl
      continue
    }
    seen.add(id)
    level[id] = lvl
    const kids = childrenMap[id] || []
    kids.forEach(kid => queue.push({ id: kid, lvl: lvl + 1 }))
  }
  persons.forEach(p => { if (level[p.id] === undefined) level[p.id] = 0 })

  // Group
  const gens = {}
  persons.forEach(p => {
    const l = level[p.id]
    if (!gens[l]) gens[l] = []
    gens[l].push(p)
  })

  const genNumbers = Object.keys(gens).map(Number).sort((a, b) => a - b)

  const lines = []
  genNumbers.forEach(g => {
    lines.push(`\n▸ GENERASI ${toRoman(g + 1)} (${gens[g].length} orang):`)
    gens[g].forEach(p => {
      lines.push(`   • ${formatPerson(p, byId)}`)
    })
  })

  return lines.join('\n')
}

function formatPerson(p, byId) {
  const parts = [p.name]
  const gender = p.gender === 'female' ? 'P' : 'L'
  parts.push(`[${gender}]`)

  if (p.birth_year && p.death_year) parts.push(`(${p.birth_year}–${p.death_year})`)
  else if (p.birth_year) parts.push(`(lahir ${p.birth_year})`)
  else if (p.death_year) parts.push(`(wafat ${p.death_year})`)

  if (p.death_year) parts.push('almarhum')

  // Parent info
  const parents = []
  if (p.father_id && byId[p.father_id]) parents.push(`ayah: ${byId[p.father_id].name}`)
  if (p.mother_id && byId[p.mother_id]) parents.push(`ibu: ${byId[p.mother_id].name}`)
  if (parents.length > 0) parts.push(`— ${parents.join(', ')}`)

  return parts.join(' ')
}

function toRoman(n) {
  const map = [[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]
  let r = ''
  for (const [v,s] of map) while (n >= v) { r += s; n -= v }
  return r || 'I'
}

function getSizeInfo(sizeId) {
  switch (sizeId) {
    case 'ig-story':
      return { label: 'Instagram Story (1080×1920)', ratio: '9:16', orientation: 'portrait (vertikal)' }
    case 'ig-post':
      return { label: 'Instagram Post (1080×1080)', ratio: '1:1', orientation: 'square (persegi)' }
    case 'a4-portrait':
      return { label: 'A4 Portrait (2480×3508)', ratio: '210:297', orientation: 'portrait (vertikal)' }
    case 'a4-landscape':
      return { label: 'A4 Landscape (3508×2480)', ratio: '297:210', orientation: 'landscape (horisontal)' }
    default:
      return { label: 'A4 Portrait', ratio: '210:297', orientation: 'portrait' }
  }
}
