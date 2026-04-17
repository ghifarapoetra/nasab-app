// ═══════════════════════════════════════════════════════
// Sulalah — Poster Export Engine
// Menggunakan html2canvas + jsPDF
// Install: npm install html2canvas jspdf
// ═══════════════════════════════════════════════════════

// ── 10 Tema Poster ──────────────────────────────────────
export const POSTER_THEMES = [
  // ── FREE (5 tema) ──
  {
    id: 'clean', name: 'Bersih', premium: false,
    desc: 'Putih minimalis, profesional',
    previewBg: '#ffffff', previewAccent: '#0d9488', previewBorder: '#d1faf4',
    bg: ['#ffffff', '#f0fdfa'],
    border: '#d1faf4', accent: '#0d9488', text: '#0f2520', subtext: '#4b6b66',
    treeBg: 'rgba(240,253,250,0.9)', ornament: 'clean-frame',
  },
  {
    id: 'kayu', name: 'Kayu Jati', premium: false,
    desc: 'Hangat seperti ukiran kayu antik',
    previewBg: '#fdf6ee', previewAccent: '#a16207', previewBorder: '#d4a96a',
    bg: ['#fdf6ee', '#f0dfc0'],
    border: '#d4a96a', accent: '#a16207', text: '#3d2000', subtext: '#7a5c2e',
    treeBg: 'rgba(255,249,240,0.92)', ornament: 'corner-vines',
  },
  {
    id: 'islami', name: 'Islami Hijau', premium: false,
    desc: 'Hijau daun, nuansa pesantren & masjid',
    previewBg: '#f0f7f0', previewAccent: '#1b5e20', previewBorder: '#81c784',
    bg: ['#f0f7f0', '#e0f0e0'],
    border: '#81c784', accent: '#1b5e20', text: '#1a3a1a', subtext: '#4a7a4a',
    treeBg: 'rgba(240,247,240,0.92)', ornament: 'islamic-stars',
  },
  {
    id: 'elegan', name: 'Elegan Gelap', premium: false,
    desc: 'Navy & emas, abadi dan berkelas',
    previewBg: '#1a1a2e', previewAccent: '#e2c97e', previewBorder: '#4a4a6a',
    bg: ['#1a1a2e', '#0f0f1e'],
    border: '#4a4a6a', accent: '#e2c97e', text: '#f0e6d3', subtext: '#b8a98a',
    treeBg: 'rgba(22,33,62,0.9)', ornament: 'gold-lines',
  },
  {
    id: 'pesisir', name: 'Pesisir Biru', premium: false,
    desc: 'Gradasi laut biru jernih',
    previewBg: '#dbeafe', previewAccent: '#0284c7', previewBorder: '#93c5fd',
    bg: ['#dbeafe', '#e0f2fe'],
    border: '#93c5fd', accent: '#0284c7', text: '#0c2340', subtext: '#1e4a6a',
    treeBg: 'rgba(224,242,254,0.88)', ornament: 'wave-lines',
  },
  // ── PREMIUM (5 tema tambahan) ──
  {
    id: 'batik', name: 'Batik Nusantara', premium: true,
    desc: 'Ornamen batik, khas Nusantara',
    previewBg: '#fff8f0', previewAccent: '#922b21', previewBorder: '#c0392b',
    bg: ['#fff8f0', '#fdebd0'],
    border: '#c0392b', accent: '#922b21', text: '#1a0800', subtext: '#6e2c00',
    treeBg: 'rgba(255,252,245,0.92)', ornament: 'batik',
  },
  {
    id: 'emas', name: 'Emas Kerajaan', premium: true,
    desc: 'Hitam & emas mewah berkilau',
    previewBg: '#1c1008', previewAccent: '#ffd700', previewBorder: '#d4af37',
    bg: ['#1c1008', '#2d1b00'],
    border: '#d4af37', accent: '#ffd700', text: '#fef9e7', subtext: '#d4af37',
    treeBg: 'rgba(35,25,5,0.88)', ornament: 'royal-gold',
  },
  {
    id: 'taman', name: 'Taman Bunga', premium: true,
    desc: 'Pastel lembut & cantik',
    previewBg: '#fdf0f8', previewAccent: '#ad1457', previewBorder: '#f48fb1',
    bg: ['#fdf0f8', '#f3e5f5'],
    border: '#f48fb1', accent: '#ad1457', text: '#2d0d1f', subtext: '#7b3f6e',
    treeBg: 'rgba(253,240,248,0.9)', ornament: 'floral',
  },
  {
    id: 'langit', name: 'Langit Malam', premium: true,
    desc: 'Ungu tua & bintang-bintang',
    previewBg: '#0d0221', previewAccent: '#a78bfa', previewBorder: '#7c3aed',
    bg: ['#0d0221', '#120a2e'],
    border: '#7c3aed', accent: '#a78bfa', text: '#ede9fe', subtext: '#a78bfa',
    treeBg: 'rgba(18,10,46,0.9)', ornament: 'starfield',
  },
  {
    id: 'kaligrafi', name: 'Kaligrafi Emas', premium: true,
    desc: 'Krem & emas, nuansa mushaf Islam',
    previewBg: '#fffff0', previewAccent: '#8b6914', previewBorder: '#b8860b',
    bg: ['#fffff0', '#fdf5d0'],
    border: '#b8860b', accent: '#8b6914', text: '#2c1810', subtext: '#6b4226',
    treeBg: 'rgba(255,255,240,0.9)', ornament: 'kaligrafi',
  },
]

// ── Ornament Drawing Functions ──────────────────────────

function drawBackground(ctx, W, H, t) {
  const grad = ctx.createLinearGradient(0, 0, W, H)
  grad.addColorStop(0, t.bg[0])
  grad.addColorStop(1, t.bg[1])
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)
}

function draw8Star(ctx, cx, cy, r1, r2) {
  ctx.beginPath()
  for (let i = 0; i < 16; i++) {
    const angle = (i * Math.PI / 8) - Math.PI / 2
    const r = i % 2 === 0 ? r1 : r2
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  ctx.closePath()
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

// 1. Clean Frame — double border + corner dots
function oCleanFrame(ctx, W, H, t) {
  const m = 48
  ctx.strokeStyle = t.border; ctx.lineWidth = 5
  ctx.strokeRect(m, m, W - m * 2, H - m * 2)
  ctx.lineWidth = 1.5
  ctx.strokeRect(m + 16, m + 16, W - (m + 16) * 2, H - (m + 16) * 2)
  ctx.fillStyle = t.accent
  [[m,m],[W-m,m],[m,H-m],[W-m,H-m]].forEach(([x,y]) => {
    ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI*2); ctx.fill()
  })
  // mid-edge diamonds
  ctx.save(); ctx.translate(W/2, m); ctx.rotate(Math.PI/4); ctx.fillRect(-7,-7,14,14); ctx.restore()
  ctx.save(); ctx.translate(W/2, H-m); ctx.rotate(Math.PI/4); ctx.fillRect(-7,-7,14,14); ctx.restore()
  ctx.save(); ctx.translate(m, H/2); ctx.rotate(Math.PI/4); ctx.fillRect(-7,-7,14,14); ctx.restore()
  ctx.save(); ctx.translate(W-m, H/2); ctx.rotate(Math.PI/4); ctx.fillRect(-7,-7,14,14); ctx.restore()
}

// 2. Corner Vines — decorative corner L-shapes
function oCornerVines(ctx, W, H, t) {
  const m = 45, arm = 140
  ctx.strokeStyle = t.border; ctx.lineWidth = 3
  ctx.strokeRect(m, m, W - m*2, H - m*2)
  ctx.strokeStyle = t.accent; ctx.lineWidth = 1.5
  ctx.strokeRect(m+14, m+14, W-(m+14)*2, H-(m+14)*2)
  // L-shaped corner ornaments
  const corners = [[m,m,1,1],[W-m,m,-1,1],[m,H-m,1,-1],[W-m,H-m,-1,-1]]
  ctx.lineWidth = 4; ctx.strokeStyle = t.accent
  corners.forEach(([cx,cy,dx,dy]) => {
    ctx.beginPath(); ctx.moveTo(cx+dx*arm,cy); ctx.lineTo(cx,cy); ctx.lineTo(cx,cy+dy*arm); ctx.stroke()
    // small dots along arm
    for (let i = 20; i < arm-20; i += 30) {
      ctx.beginPath(); ctx.arc(cx+dx*i, cy, 3, 0, Math.PI*2)
      ctx.fillStyle = t.accent; ctx.globalAlpha=0.4; ctx.fill(); ctx.globalAlpha=1
    }
    ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI*2); ctx.fillStyle=t.accent; ctx.fill()
  })
}

// 3. Islamic 8-pointed stars border
function oIslamicStars(ctx, W, H, t) {
  const m = 44
  ctx.strokeStyle = t.border; ctx.lineWidth = 3
  ctx.strokeRect(m, m, W-m*2, H-m*2)
  ctx.strokeStyle = t.border; ctx.lineWidth = 1
  ctx.strokeRect(m+14, m+14, W-(m+14)*2, H-(m+14)*2)

  const r1=22, r2=9, spacing=68
  ctx.fillStyle=t.accent; ctx.strokeStyle=t.border; ctx.lineWidth=0.8

  const star = (x, y, big) => {
    const sr1 = big?32:r1, sr2=big?13:r2
    draw8Star(ctx, x, y, sr1, sr2)
    ctx.globalAlpha = big ? 0.9 : 0.65; ctx.fill()
    ctx.globalAlpha = 1; ctx.stroke()
  }
  // edges
  for (let x = m+spacing; x < W-m-spacing/2; x+=spacing) { star(x,m,false); star(x,H-m,false) }
  for (let y = m+spacing; y < H-m-spacing/2; y+=spacing) { star(m,y,false); star(W-m,y,false) }
  // corners
  [[m,m],[W-m,m],[m,H-m],[W-m,H-m]].forEach(([x,y])=>star(x,y,true))
}

// 4. Gold Lines — glowing frame + L corners
function oGoldLines(ctx, W, H, t) {
  const m = 44
  ctx.shadowColor = t.accent; ctx.shadowBlur = 18
  ctx.strokeStyle = t.accent; ctx.lineWidth = 3
  ctx.strokeRect(m, m, W-m*2, H-m*2)
  ctx.shadowBlur = 0
  ctx.strokeStyle = t.border; ctx.lineWidth = 1
  ctx.strokeRect(m+14, m+14, W-(m+14)*2, H-(m+14)*2)
  ctx.strokeRect(m+22, m+22, W-(m+22)*2, H-(m+22)*2)
  // L-corners gold
  const arm = 120
  ctx.strokeStyle = t.accent; ctx.lineWidth = 3
  [[m,m,1,1],[W-m,m,-1,1],[m,H-m,1,-1],[W-m,H-m,-1,-1]].forEach(([cx,cy,dx,dy]) => {
    ctx.beginPath(); ctx.moveTo(cx+dx*arm,cy); ctx.lineTo(cx,cy); ctx.lineTo(cx,cy+dy*arm); ctx.stroke()
    draw8Star(ctx, cx, cy, 18, 7)
    ctx.fillStyle=t.accent; ctx.globalAlpha=0.85; ctx.fill(); ctx.globalAlpha=1
  })
}

// 5. Wave Lines
function oWaveLines(ctx, W, H, t) {
  const m = 44
  ctx.strokeStyle = t.border; ctx.lineWidth = 3
  ctx.strokeRect(m, m, W-m*2, H-m*2)
  ctx.strokeStyle = t.accent; ctx.lineWidth = 1
  const segments = 80
  const wave = (yBase, flip) => {
    ctx.beginPath()
    for (let i = 0; i <= segments; i++) {
      const x = m + (i/segments)*(W-m*2)
      const y = yBase + Math.sin((i/segments)*Math.PI*12)*10*(flip?-1:1)
      i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y)
    }
    ctx.stroke()
  }
  ctx.globalAlpha=0.5; wave(m+18,false); wave(H-m-18,true); ctx.globalAlpha=1
  // side dots
  for (let y=m+40; y<H-m; y+=50) {
    ctx.beginPath(); ctx.arc(m+8,y,2,0,Math.PI*2); ctx.fillStyle=t.accent; ctx.fill()
    ctx.beginPath(); ctx.arc(W-m-8,y,2,0,Math.PI*2); ctx.fill()
  }
}

// 6. Batik — thick border + diamond chain
function oBatik(ctx, W, H, t) {
  const m = 40
  ctx.strokeStyle = t.border; ctx.lineWidth = 10; ctx.strokeRect(m,m,W-m*2,H-m*2)
  ctx.strokeStyle = t.accent; ctx.lineWidth = 2; ctx.strokeRect(m+20,m+20,W-(m+20)*2,H-(m+20)*2)
  ctx.strokeStyle = t.border; ctx.lineWidth = 1; ctx.strokeRect(m+30,m+30,W-(m+30)*2,H-(m+30)*2)
  // Diamond chain
  const ds=22, sp=52
  ctx.fillStyle=t.accent; ctx.globalAlpha=0.55
  const diamond=(x,y,size)=>{ ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI/4);ctx.fillRect(-size/2,-size/2,size,size);ctx.restore() }
  for (let x=m+sp; x<W-m; x+=sp) { diamond(x,m+10,ds*0.6); diamond(x,H-m-10,ds*0.6) }
  for (let y=m+sp; y<H-m; y+=sp) { diamond(m+10,y,ds*0.6); diamond(W-m-10,y,ds*0.6) }
  ctx.globalAlpha=1
  [[m,m],[W-m,m],[m,H-m],[W-m,H-m]].forEach(([x,y])=>{ diamond(x,y,ds*1.3) })
}

// 7. Royal Gold — layered frames + big stars
function oRoyalGold(ctx, W, H, t) {
  [44,56,66].forEach((m,i) => {
    ctx.shadowColor=t.accent; ctx.shadowBlur=i===0?24:0
    ctx.strokeStyle=i%2===0?t.accent:t.border; ctx.lineWidth=i===0?4:1
    ctx.strokeRect(m,m,W-m*2,H-m*2); ctx.shadowBlur=0
  })
  // Big stars at corners + midpoints
  const pts=[[66,66],[W-66,66],[66,H-66],[W-66,H-66],[W/2,66],[W/2,H-66],[66,H/2],[W-66,H/2]]
  pts.forEach(([x,y],i) => {
    const big=i<4; draw8Star(ctx,x,y,big?32:20,big?13:8)
    ctx.fillStyle=t.accent; ctx.globalAlpha=big?0.9:0.6; ctx.fill(); ctx.globalAlpha=1
  })
}

// 8. Floral — flower motifs at corners & midpoints
function oFloral(ctx, W, H, t) {
  const m = 44
  ctx.strokeStyle = t.border; ctx.lineWidth = 2; ctx.strokeRect(m,m,W-m*2,H-m*2)
  ctx.strokeRect(m+12,m+12,W-(m+12)*2,H-(m+12)*2)
  const flower=(x,y,r)=>{
    for (let i=0;i<6;i++) {
      const a=(i*Math.PI)/3
      ctx.beginPath(); ctx.arc(x+r*0.65*Math.cos(a),y+r*0.65*Math.sin(a),r*0.45,0,Math.PI*2)
      ctx.fillStyle=t.accent; ctx.globalAlpha=0.4; ctx.fill(); ctx.globalAlpha=1
    }
    ctx.beginPath(); ctx.arc(x,y,r*0.35,0,Math.PI*2); ctx.fillStyle=t.accent; ctx.fill()
  }
  [[m,m],[W-m,m],[m,H-m],[W-m,H-m],[W/2,m],[W/2,H-m],[m,H/2],[W-m,H/2]].forEach(([x,y])=>flower(x,y,32))
}

// 9. Starfield — random stars + glowing frame
function oStarfield(ctx, W, H, t) {
  const rng=s=>{ let x=Math.sin(s)*10000; return x-Math.floor(x) }
  ctx.fillStyle=t.accent
  for (let i=0;i<300;i++) {
    const x=rng(i*2.1)*W, y=rng(i*3.7)*H
    const sz=rng(i*5.3)*2.5+0.5
    ctx.globalAlpha=rng(i*7.1)*0.5+0.1
    ctx.beginPath(); ctx.arc(x,y,sz,0,Math.PI*2); ctx.fill()
  }
  ctx.globalAlpha=1
  const m=44; ctx.shadowColor=t.accent; ctx.shadowBlur=16
  ctx.strokeStyle=t.accent; ctx.lineWidth=2; ctx.strokeRect(m,m,W-m*2,H-m*2); ctx.shadowBlur=0
  ctx.strokeStyle=t.border; ctx.lineWidth=1; ctx.strokeRect(m+16,m+16,W-(m+16)*2,H-(m+16)*2)
  // small constellation dots
  [[m,m],[W-m,m],[m,H-m],[W-m,H-m]].forEach(([x,y])=>{
    draw8Star(ctx,x,y,22,9); ctx.fillStyle=t.accent; ctx.globalAlpha=0.8; ctx.fill(); ctx.globalAlpha=1
  })
}

// 10. Kaligrafi — geometric diamond chain border
function oKaligrafi(ctx, W, H, t) {
  const m=44
  ctx.strokeStyle=t.border; ctx.lineWidth=5; ctx.strokeRect(m,m,W-m*2,H-m*2)
  ctx.lineWidth=1; ctx.strokeRect(m+16,m+16,W-(m+16)*2,H-(m+16)*2)
  const ds=18, sp=44
  ctx.fillStyle=t.accent; ctx.globalAlpha=0.45
  const d=(x,y)=>{ ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI/4);ctx.fillRect(-ds/2,-ds/2,ds,ds);ctx.restore() }
  for (let x=m+sp;x<W-m;x+=sp) { d(x,m+8); d(x,H-m-8) }
  for (let y=m+sp;y<H-m;y+=sp) { d(m+8,y); d(W-m-8,y) }
  ctx.globalAlpha=1
  // Corner roundels
  [[m,m],[W-m,m],[m,H-m],[W-m,H-m]].forEach(([x,y])=>{
    ctx.beginPath(); ctx.arc(x,y,20,0,Math.PI*2)
    ctx.fillStyle=t.accent; ctx.fill()
    ctx.beginPath(); ctx.arc(x,y,14,0,Math.PI*2)
    ctx.strokeStyle=t.bg[0]; ctx.lineWidth=2; ctx.stroke()
  })
}

function drawOrnament(ctx, W, H, t) {
  switch(t.ornament) {
    case 'clean-frame':   oCleanFrame(ctx,W,H,t); break
    case 'corner-vines':  oCornerVines(ctx,W,H,t); break
    case 'islamic-stars': oIslamicStars(ctx,W,H,t); break
    case 'gold-lines':    oGoldLines(ctx,W,H,t); break
    case 'wave-lines':    oWaveLines(ctx,W,H,t); break
    case 'batik':         oBatik(ctx,W,H,t); break
    case 'royal-gold':    oRoyalGold(ctx,W,H,t); break
    case 'floral':        oFloral(ctx,W,H,t); break
    case 'starfield':     oStarfield(ctx,W,H,t); break
    case 'kaligrafi':     oKaligrafi(ctx,W,H,t); break
  }
}

// ── Main Export Function ────────────────────────────────

export async function exportPoster({ themeId, treeName, memberCount, isPremium, format = 'pdf' }) {
  const theme = POSTER_THEMES.find(t => t.id === themeId) || POSTER_THEMES[0]
  if (theme.premium && !isPremium) throw new Error('Tema ini khusus untuk pengguna Premium.')

  // Capture tree DOM
  const { default: html2canvas } = await import('html2canvas')
  const ci = document.getElementById('ci')
  const cw = document.getElementById('cw')
  if (!ci || !cw) throw new Error('Pohon tidak ditemukan.')

  // Expand container so full tree is captured (not just visible portion)
  const origH = cw.style.height, origO = cw.style.overflow
  cw.style.height = 'auto'; cw.style.overflow = 'visible'

  let treeCanvas
  try {
    treeCanvas = await html2canvas(ci, {
      scale: 2.5,
      backgroundColor: null,
      useCORS: true,
      allowTaint: true,
      logging: false,
    })
  } finally {
    cw.style.height = origH; cw.style.overflow = origO
  }

  // Poster canvas — A3 landscape equivalent (high quality)
  const W = 3508, H = 2480
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')

  // 1. Background
  drawBackground(ctx, W, H, theme)

  // 2. Decorative ornaments
  drawOrnament(ctx, W, H, theme)

  // 3. Header
  const HEADER_TOP = 130
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'

  ctx.fillStyle = theme.accent
  ctx.font = `700 64px Georgia, "Times New Roman", serif`
  ctx.fillText('Silsilah Keluarga', W / 2, HEADER_TOP)

  ctx.fillStyle = theme.text
  ctx.font = `700 108px Georgia, "Times New Roman", serif`
  ctx.fillText(treeName || 'Keluarga', W / 2, HEADER_TOP + 118, W - 240)

  ctx.fillStyle = theme.subtext
  ctx.font = `38px Georgia, serif`
  ctx.fillText(`${memberCount || ''} anggota · sulalah.my.id`, W / 2, HEADER_TOP + 198)

  // Divider
  ctx.strokeStyle = theme.accent; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.4
  ctx.beginPath(); ctx.moveTo(W/2-320, HEADER_TOP+235); ctx.lineTo(W/2+320, HEADER_TOP+235); ctx.stroke()
  ctx.globalAlpha = 1

  // 4. Tree area — light translucent panel for readability
  const TREE_Y = HEADER_TOP + 265
  const FOOTER_H = 90
  const areaX = 90, areaW = W - 180
  const areaH = H - TREE_Y - FOOTER_H - 30

  ctx.fillStyle = theme.treeBg
  roundRect(ctx, areaX, TREE_Y - 8, areaW, areaH + 16, 20); ctx.fill()
  ctx.strokeStyle = theme.border; ctx.lineWidth = 1.5
  roundRect(ctx, areaX, TREE_Y - 8, areaW, areaH + 16, 20); ctx.stroke()

  // Draw tree — scale to fit
  const scale = Math.min(
    (areaW - 60) / treeCanvas.width,
    (areaH - 40) / treeCanvas.height
  )
  const tw = treeCanvas.width * scale, th = treeCanvas.height * scale
  const tx = areaX + (areaW - tw) / 2
  const ty = TREE_Y + (areaH - th) / 2
  ctx.drawImage(treeCanvas, tx, ty, tw, th)

  // 5. Footer
  ctx.fillStyle = theme.subtext; ctx.font = `30px Georgia, serif`
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText('Sulalah — sulalah.my.id  |  Pohon Silsilah Keluarga Muslim', W / 2, H - 54)

  // 6. Export
  const filename = `silsilah-${(treeName||'keluarga').toLowerCase().replace(/\s+/g,'-')}`
  const imgData = canvas.toDataURL('image/jpeg', 0.93)

  if (format === 'pdf') {
    const { jsPDF } = await import('jspdf')
    const pdf = new jsPDF({ orientation:'landscape', unit:'px', format:[W,H], hotfixes:['px_scaling'] })
    pdf.addImage(imgData, 'JPEG', 0, 0, W, H)
    pdf.save(`${filename}.pdf`)
  } else {
    // PNG — better for print shop
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `${filename}.png`
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
  }
}
