// Sulalah Poster Engine v1
// Render canvas artwork dari data pohon — bukan screenshot tree view

import { getTheme, getSize } from './posterThemes'
import { calculateFamilyStats } from './posterStats'

const DALIL_OPTIONS = [
  {
    arabic: 'تَعَلَّمُوا مِنْ أَنْسَابِكُمْ مَا تَصِلُونَ بِهِ أَرْحَامَكُمْ',
    terjemah: 'Pelajarilah nasab-nasab kalian yang dengannya kalian dapat menyambung tali silaturahmi.',
    sumber: 'HR. Tirmidzi',
  },
  {
    arabic: 'صِلَةُ الرَّحِمِ تَزِيدُ فِي الْعُمُرِ',
    terjemah: 'Menyambung silaturahmi menambah umur dan menolak kematian yang buruk.',
    sumber: 'HR. Thabrani',
  },
]

export async function renderPoster({
  persons,
  treeName,
  treeDesc,
  sizeId,
  themeId,
  ownerName,
  options = {},
}) {
  const size = getSize(sizeId)
  const theme = getTheme(themeId)
  const stats = calculateFamilyStats(persons)
  const { showCover = false, showStats = true } = options

  const canvas = document.createElement('canvas')
  canvas.width = size.width
  canvas.height = size.height
  const ctx = canvas.getContext('2d')

  // Pre-load font (Google Fonts)
  await loadWebFonts()

  // Scale factor: untuk sosmed render 1x, untuk print render 2x untuk sharpness
  const dpi = size.category === 'print' ? 1 : 1
  const W = size.width
  const H = size.height

  // ────────── LAYER 1: BACKGROUND ──────────
  drawBackground(ctx, W, H, theme)

  // ────────── LAYER 2: ORNAMENTS ──────────
  drawOrnaments(ctx, W, H, theme, size.orientation)

  // ────────── LAYER 3: HEADER ──────────
  const headerH = drawHeader(ctx, W, H, theme, {
    treeName,
    treeDesc,
    stats,
    ownerName,
    size,
  })

  // ────────── LAYER 4: FAMILY TREE ──────────
  const treeTop = headerH + pad(size, 40)
  const footerH = drawFooter(ctx, W, H, theme, { stats, showStats, size })
  const treeBottom = H - footerH - pad(size, 30)

  drawTree(ctx, {
    persons,
    stats,
    top: treeTop,
    bottom: treeBottom,
    width: W,
    theme,
    size,
  })

  // ────────── LAYER 5: WATERMARK ──────────
  drawWatermark(ctx, W, H, theme, size)

  return canvas
}

// ═════════════════════════════════════════════════════════
// UTILITY
// ═════════════════════════════════════════════════════════

function pad(size, base) {
  // Scale padding based on size
  if (size.category === 'print') return base * 2
  return base
}

function fontSize(size, base) {
  if (size.category === 'print') return base * 2
  return base
}

async function loadWebFonts() {
  if (typeof document === 'undefined') return
  if (document.getElementById('sulalah-poster-fonts')) return
  const link = document.createElement('link')
  link.id = 'sulalah-poster-fonts'
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Amiri:wght@400;700&family=Merriweather:wght@400;700&family=Inter:wght@400;500;700&display=swap'
  document.head.appendChild(link)
  // Wait for fonts to load
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready
  }
  await new Promise(r => setTimeout(r, 300))
}

// ═════════════════════════════════════════════════════════
// LAYER 1 — BACKGROUND
// ═════════════════════════════════════════════════════════

function drawBackground(ctx, W, H, theme) {
  // Base fill
  ctx.fillStyle = theme.colors.bg
  ctx.fillRect(0, 0, W, H)

  // Paper texture — subtle
  if (theme.paperTexture === 'aged' || theme.paperTexture === 'wood') {
    addPaperTexture(ctx, W, H, theme)
  }

  // Soft vignette corners
  const grad = ctx.createRadialGradient(W/2, H/2, Math.min(W,H)*0.3, W/2, H/2, Math.max(W,H)*0.7)
  grad.addColorStop(0, 'rgba(0,0,0,0)')
  grad.addColorStop(1, 'rgba(0,0,0,0.04)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)
}

function addPaperTexture(ctx, W, H, theme) {
  // Noise-like dots untuk kesan kertas tua
  const density = theme.paperTexture === 'aged' ? 2500 : 1500
  ctx.save()
  ctx.globalAlpha = 0.08
  ctx.fillStyle = theme.colors.textMuted
  for (let i = 0; i < density; i++) {
    const x = Math.random() * W
    const y = Math.random() * H
    const r = Math.random() * 1.2 + 0.2
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

// ═════════════════════════════════════════════════════════
// LAYER 2 — ORNAMENTS (border & corner)
// ═════════════════════════════════════════════════════════

function drawOrnaments(ctx, W, H, theme, orientation) {
  const m = Math.min(W, H) * 0.04  // margin from edge

  ctx.save()
  ctx.strokeStyle = theme.colors.border
  ctx.lineWidth = Math.max(2, Math.min(W, H) * 0.002)

  // Double border frame
  const outer = m * 0.8
  const inner = m * 1.3
  strokeRoundedRect(ctx, outer, outer, W - outer*2, H - outer*2, 20)

  ctx.lineWidth = Math.max(1, Math.min(W, H) * 0.0008)
  ctx.strokeStyle = theme.colors.ornament
  strokeRoundedRect(ctx, inner, inner, W - inner*2, H - inner*2, 14)
  ctx.restore()

  // Corner ornaments based on style
  drawCornerOrnaments(ctx, W, H, theme, m * 1.3)
}

function strokeRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
  ctx.stroke()
}

function drawCornerOrnaments(ctx, W, H, theme, offset) {
  const size = Math.min(W, H) * 0.05
  ctx.save()
  ctx.strokeStyle = theme.colors.ornament
  ctx.fillStyle = theme.colors.ornament
  ctx.lineWidth = Math.max(1.5, Math.min(W, H) * 0.0012)

  const corners = [
    { x: offset, y: offset, rot: 0 },
    { x: W - offset, y: offset, rot: Math.PI / 2 },
    { x: W - offset, y: H - offset, rot: Math.PI },
    { x: offset, y: H - offset, rot: -Math.PI / 2 },
  ]

  corners.forEach(c => {
    ctx.save()
    ctx.translate(c.x, c.y)
    ctx.rotate(c.rot)
    drawCornerShape(ctx, size, theme.ornamentStyle)
    ctx.restore()
  })
  ctx.restore()
}

function drawCornerShape(ctx, size, style) {
  if (style === 'leaves') {
    // Daun kecil
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(size * 0.5, -size * 0.3, size, 0)
    ctx.quadraticCurveTo(size * 0.5, size * 0.3, 0, 0)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(-size * 0.3, size * 0.5, 0, size)
    ctx.quadraticCurveTo(size * 0.3, size * 0.5, 0, 0)
    ctx.fill()
  } else if (style === 'stars') {
    // Bintang kecil
    drawStar(ctx, size * 0.6, 5, size * 0.4, size * 0.2)
  } else if (style === 'vintage') {
    // Floral scroll sederhana
    ctx.beginPath()
    ctx.arc(size * 0.5, size * 0.5, size * 0.3, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(size * 0.5, size * 0.5, size * 0.15, 0, Math.PI * 2)
    ctx.fill()
  } else {
    // dots — simple geometric
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      ctx.arc(size * 0.3 + i * size * 0.2, size * 0.3, 3, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

function drawStar(ctx, cx, spikes, outerR, innerR) {
  let rot = Math.PI / 2 * 3
  const step = Math.PI / spikes
  ctx.beginPath()
  ctx.moveTo(cx, -outerR)
  for (let i = 0; i < spikes; i++) {
    let x = cx + Math.cos(rot) * outerR
    let y = Math.sin(rot) * outerR
    ctx.lineTo(x, y)
    rot += step
    x = cx + Math.cos(rot) * innerR
    y = Math.sin(rot) * innerR
    ctx.lineTo(x, y)
    rot += step
  }
  ctx.lineTo(cx, -outerR)
  ctx.closePath()
  ctx.fill()
}

// ═════════════════════════════════════════════════════════
// LAYER 3 — HEADER (title area)
// ═════════════════════════════════════════════════════════

function drawHeader(ctx, W, H, theme, { treeName, treeDesc, stats, ownerName, size }) {
  const startY = pad(size, 140)
  let y = startY

  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'

  // Small label "SILSILAH KELUARGA"
  ctx.fillStyle = theme.colors.textMuted
  ctx.font = `700 ${fontSize(size, 14)}px ${theme.font.body}`
  ctx.letterSpacing = '3px'
  const labelText = 'SILSILAH KELUARGA'
  drawTextWithSpacing(ctx, labelText, W / 2, y, 3)
  y += fontSize(size, 24)

  // Ornamental divider
  drawOrnamentalLine(ctx, W / 2, y + fontSize(size, 8), W * 0.15, theme)
  y += fontSize(size, 30)

  // Tree Name (big)
  ctx.fillStyle = theme.colors.text
  const treeNameSize = size.orientation === 'portrait'
    ? fontSize(size, 52)
    : fontSize(size, 48)
  ctx.font = `900 ${treeNameSize}px ${theme.font.heading}`

  // Handle multi-line if too long
  const maxWidth = W * 0.8
  const lines = wrapText(ctx, treeName || 'Keluarga Besar', maxWidth)
  lines.forEach(line => {
    ctx.fillText(line, W / 2, y)
    y += treeNameSize * 1.1
  })

  // Tree description
  if (treeDesc) {
    y += fontSize(size, 10)
    ctx.fillStyle = theme.colors.textSoft
    ctx.font = `italic ${fontSize(size, 18)}px ${theme.font.body}`
    const descLines = wrapText(ctx, treeDesc, W * 0.7)
    descLines.slice(0, 2).forEach(line => {
      ctx.fillText(line, W / 2, y)
      y += fontSize(size, 24)
    })
  }

  // Meta (owner name + date)
  y += fontSize(size, 12)
  const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  const metaText = ownerName
    ? `Disusun oleh ${ownerName} · ${today}`
    : `Dicetak pada ${today}`
  ctx.fillStyle = theme.colors.textMuted
  ctx.font = `400 ${fontSize(size, 14)}px ${theme.font.body}`
  ctx.fillText(metaText, W / 2, y)
  y += fontSize(size, 24)

  return y
}

function drawTextWithSpacing(ctx, text, x, y, spacing) {
  const chars = text.split('')
  const totalWidth = chars.reduce((w, ch, i) => w + ctx.measureText(ch).width + (i < chars.length - 1 ? spacing : 0), 0)
  let cursorX = x - totalWidth / 2
  chars.forEach(ch => {
    ctx.textAlign = 'left'
    ctx.fillText(ch, cursorX, y)
    cursorX += ctx.measureText(ch).width + spacing
  })
  ctx.textAlign = 'center'
}

function drawOrnamentalLine(ctx, cx, cy, halfWidth, theme) {
  ctx.save()
  ctx.strokeStyle = theme.colors.ornament
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(cx - halfWidth, cy)
  ctx.lineTo(cx - 12, cy)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + 12, cy)
  ctx.lineTo(cx + halfWidth, cy)
  ctx.stroke()

  // Diamond center
  ctx.fillStyle = theme.colors.ornament
  ctx.beginPath()
  ctx.moveTo(cx, cy - 5)
  ctx.lineTo(cx + 5, cy)
  ctx.lineTo(cx, cy + 5)
  ctx.lineTo(cx - 5, cy)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ')
  const lines = []
  let current = ''
  words.forEach(word => {
    const test = current ? current + ' ' + word : word
    if (ctx.measureText(test).width <= maxWidth) {
      current = test
    } else {
      if (current) lines.push(current)
      current = word
    }
  })
  if (current) lines.push(current)
  return lines
}

// ═════════════════════════════════════════════════════════
// LAYER 4 — FAMILY TREE (classic horizontal layout)
// ═════════════════════════════════════════════════════════

function drawTree(ctx, { persons, stats, top, bottom, width, theme, size }) {
  if (!persons || persons.length === 0) return

  // Build generation map
  const byId = {}
  persons.forEach(p => { byId[p.id] = p })

  const childrenMap = {}
  persons.forEach(p => {
    [p.father_id, p.mother_id].filter(Boolean).forEach(pid => {
      if (byId[pid]) {
        if (!childrenMap[pid]) childrenMap[pid] = []
        if (!childrenMap[pid].includes(p.id)) childrenMap[pid].push(p.id)
      }
    })
  })

  const ids = new Set(persons.map(p => p.id))
  const roots = persons.filter(p =>
    (!p.father_id || !ids.has(p.father_id)) &&
    (!p.mother_id || !ids.has(p.mother_id))
  )

  // Assign generation levels via BFS
  const level = {}
  const queue = roots.map(r => ({ id: r.id, lvl: 0 }))
  while (queue.length > 0) {
    const { id, lvl } = queue.shift()
    if (level[id] !== undefined && level[id] <= lvl) continue
    level[id] = lvl
    const kids = childrenMap[id] || []
    kids.forEach(kid => queue.push({ id: kid, lvl: lvl + 1 }))
  }

  // Group by level
  const gens = {}
  persons.forEach(p => {
    const l = level[p.id] ?? 0
    if (!gens[l]) gens[l] = []
    gens[l].push(p)
  })

  const maxGen = Math.max(...Object.keys(gens).map(Number))
  const genCount = maxGen + 1

  // Calculate available space
  const m = Math.min(ctx.canvas.width, ctx.canvas.height) * 0.08
  const treeX = m
  const treeWidth = width - m * 2
  const treeY = top
  const treeHeight = bottom - top

  // Draw generation labels
  const genLabelSize = fontSize(size, 13)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'

  // Vertical spacing per generation
  const genSpacing = treeHeight / genCount

  // Draw each generation
  for (let g = 0; g <= maxGen; g++) {
    const gPersons = gens[g] || []
    if (gPersons.length === 0) continue

    const yCenter = treeY + genSpacing * g + genSpacing * 0.5

    // Generation label on left
    ctx.save()
    ctx.fillStyle = theme.colors.textMuted
    ctx.font = `700 ${genLabelSize}px ${theme.font.body}`
    ctx.textAlign = 'left'
    ctx.fillText(`GEN. ${toRoman(g + 1)}`, pad(size, 30), yCenter)
    ctx.restore()

    // Horizontal line connecting generation
    ctx.save()
    ctx.strokeStyle = theme.colors.border
    ctx.lineWidth = 0.8
    ctx.setLineDash([4, 6])
    ctx.beginPath()
    ctx.moveTo(pad(size, 30) + ctx.measureText(`GEN. ${toRoman(g + 1)}`).width + 16, yCenter)
    ctx.lineTo(width - pad(size, 30), yCenter)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.restore()

    // Draw person cards in this generation
    drawGenerationCards(ctx, {
      persons: gPersons,
      y: yCenter,
      leftX: treeX,
      width: treeWidth,
      theme,
      size,
    })
  }

  // Draw connection lines between generations
  drawConnectionLines(ctx, {
    persons,
    byId,
    childrenMap,
    level,
    gens,
    treeY,
    genSpacing,
    treeX,
    treeWidth,
    theme,
    size,
  })
}

function drawGenerationCards(ctx, { persons, y, leftX, width, theme, size }) {
  const n = persons.length
  const cardMaxW = fontSize(size, 170)
  const cardMinW = fontSize(size, 100)

  // Calculate card width based on available space
  const totalGap = (n - 1) * fontSize(size, 20)
  const availablePerCard = (width - totalGap) / n
  const cardW = Math.max(cardMinW, Math.min(cardMaxW, availablePerCard))
  const cardH = fontSize(size, 62)
  const gap = (width - cardW * n) / Math.max(1, n - 1)

  persons.forEach((p, i) => {
    const x = n === 1
      ? leftX + width / 2 - cardW / 2
      : leftX + i * (cardW + gap)
    drawPersonCard(ctx, p, x, y - cardH / 2, cardW, cardH, theme, size)
    // Store position for connection lines
    p._cardX = x + cardW / 2
    p._cardY = y
    p._cardTop = y - cardH / 2
    p._cardBottom = y + cardH / 2
  })
}

function drawPersonCard(ctx, person, x, y, w, h, theme, size) {
  const isDeceased = !!person.death_year
  const isFemale = person.gender === 'female'

  ctx.save()

  // Card background
  const bgColor = isDeceased ? theme.colors.bgAccent : theme.colors.paper
  roundRect(ctx, x, y, w, h, 8)
  ctx.fillStyle = bgColor
  ctx.fill()

  // Card border — accent for female, subtle for male, muted for deceased
  ctx.strokeStyle = isDeceased ? theme.colors.textMuted : theme.colors.accent
  ctx.lineWidth = isDeceased ? 1 : 1.5
  if (isDeceased) ctx.setLineDash([3, 3])
  roundRect(ctx, x, y, w, h, 8)
  ctx.stroke()
  ctx.setLineDash([])

  // Gender indicator on left
  ctx.fillStyle = isFemale ? '#ec4899' : theme.colors.accent
  ctx.fillRect(x, y + 4, 3, h - 8)

  // Star for deceased
  if (isDeceased) {
    ctx.fillStyle = theme.colors.textMuted
    ctx.font = `${fontSize(size, 11)}px serif`
    ctx.textAlign = 'right'
    ctx.textBaseline = 'top'
    ctx.fillText('☪', x + w - 8, y + 6)
  }

  // Name
  ctx.fillStyle = theme.colors.text
  ctx.font = `700 ${fontSize(size, 13)}px ${theme.font.body}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  const nameText = truncate(person.name, 22)
  ctx.fillText(nameText, x + w / 2, y + fontSize(size, 11))

  // Year info
  ctx.fillStyle = theme.colors.textMuted
  ctx.font = `400 ${fontSize(size, 11)}px ${theme.font.body}`
  let yearText = ''
  if (person.birth_year && person.death_year) {
    yearText = `${person.birth_year} – ${person.death_year}`
  } else if (person.birth_year) {
    yearText = `lahir ${person.birth_year}`
  } else if (person.death_year) {
    yearText = `wafat ${person.death_year}`
  }
  if (yearText) {
    ctx.fillText(yearText, x + w / 2, y + h - fontSize(size, 20))
  }

  ctx.restore()
}

function drawConnectionLines(ctx, { persons, childrenMap, level, gens, treeY, genSpacing, treeX, treeWidth, theme, size }) {
  ctx.save()
  ctx.strokeStyle = theme.colors.textMuted
  ctx.lineWidth = 1.2
  ctx.globalAlpha = 0.5

  persons.forEach(p => {
    const kids = childrenMap[p.id] || []
    kids.forEach(kidId => {
      const kid = persons.find(x => x.id === kidId)
      if (!kid || !p._cardX || !kid._cardX) return
      // Draw L-shaped connector
      const fromX = p._cardX
      const fromY = p._cardBottom
      const toX = kid._cardX
      const toY = kid._cardTop
      const midY = (fromY + toY) / 2

      ctx.beginPath()
      ctx.moveTo(fromX, fromY)
      ctx.lineTo(fromX, midY)
      ctx.lineTo(toX, midY)
      ctx.lineTo(toX, toY)
      ctx.stroke()
    })
  })

  ctx.restore()
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function truncate(text, n) {
  if (!text) return ''
  return text.length > n ? text.slice(0, n - 1) + '…' : text
}

function toRoman(n) {
  const map = [
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ]
  let result = ''
  for (const [v, s] of map) {
    while (n >= v) { result += s; n -= v }
  }
  return result
}

// ═════════════════════════════════════════════════════════
// LAYER 5 — FOOTER
// ═════════════════════════════════════════════════════════

function drawFooter(ctx, W, H, theme, { stats, showStats, size }) {
  if (!showStats) return pad(size, 60)

  const footerH = fontSize(size, 120)
  const footerY = H - footerH - pad(size, 60)

  // Divider
  ctx.save()
  ctx.strokeStyle = theme.colors.border
  ctx.lineWidth = 0.8
  ctx.beginPath()
  ctx.moveTo(W * 0.15, footerY)
  ctx.lineTo(W * 0.85, footerY)
  ctx.stroke()
  ctx.restore()

  // Stats
  const boxes = [
    { label: 'Total Anggota', value: stats.total },
    { label: 'Generasi', value: stats.generations },
    { label: 'Rentang Tahun', value: stats.yearRange || '—' },
  ]

  const boxW = W / 3
  const yBox = footerY + fontSize(size, 30)

  boxes.forEach((box, i) => {
    const cx = boxW * i + boxW / 2

    ctx.fillStyle = theme.colors.text
    ctx.font = `900 ${fontSize(size, 26)}px ${theme.font.heading}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(String(box.value), cx, yBox)

    ctx.fillStyle = theme.colors.textMuted
    ctx.font = `500 ${fontSize(size, 11)}px ${theme.font.body}`
    ctx.fillText(box.label.toUpperCase(), cx, yBox + fontSize(size, 36))
  })

  return footerH + pad(size, 60)
}

// ═════════════════════════════════════════════════════════
// LAYER 6 — WATERMARK
// ═════════════════════════════════════════════════════════

function drawWatermark(ctx, W, H, theme, size) {
  const text = 'sulalah.my.id'
  const fs = fontSize(size, 14)
  ctx.save()
  ctx.fillStyle = theme.colors.textMuted
  ctx.globalAlpha = 0.6
  ctx.font = `600 ${fs}px ${theme.font.body}`
  ctx.textAlign = 'right'
  ctx.textBaseline = 'bottom'
  ctx.fillText(`🌳 ${text}`, W - pad(size, 50), H - pad(size, 25))
  ctx.restore()
}

// ═════════════════════════════════════════════════════════
// EXPORT HELPERS
// ═════════════════════════════════════════════════════════

export function canvasToPNG(canvas, filename = 'sulalah-poster.png') {
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 'image/png')
}

export async function canvasToPDF(canvas, filename = 'sulalah-poster.pdf', sizeId) {
  const { jsPDF } = await import('jspdf')
  const size = getSize(sizeId)

  // PDF dimensions in mm
  let pdfW, pdfH, orientation
  if (size.id === 'a4-portrait') { pdfW = 210; pdfH = 297; orientation = 'p' }
  else if (size.id === 'a4-landscape') { pdfW = 297; pdfH = 210; orientation = 'l' }
  else if (size.id === 'ig-story') { pdfW = 108; pdfH = 192; orientation = 'p' }
  else if (size.id === 'ig-post') { pdfW = 108; pdfH = 108; orientation = 'p' }
  else { pdfW = 210; pdfH = 297; orientation = 'p' }

  const pdf = new jsPDF({ orientation, unit: 'mm', format: orientation === 'p' ? [pdfW, pdfH] : [pdfH, pdfW] })
  const imgData = canvas.toDataURL('image/jpeg', 0.92)
  pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH)
  pdf.save(filename)
}
