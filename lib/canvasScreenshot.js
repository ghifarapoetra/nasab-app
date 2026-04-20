// Screenshot-based exporter — pakai html2canvas untuk capture canvas tree view
// Insight dari tester: hasil screenshot lebih akurat dan visual lebih baik

import { calculateFamilyStats } from './posterStats'

/**
 * Capture the tree canvas as an image and add Sulalah header/footer
 * @param treeCanvasEl - the DOM element containing the tree (id="ci")
 * @param options - { treeName, treeDesc, ownerName, persons, sizeId, themeColor }
 */
export async function captureTreeCanvas(treeCanvasEl, options) {
  const html2canvas = (await import('html2canvas')).default

  // Capture the tree at high quality
  const treeCanvas = await html2canvas(treeCanvasEl, {
    backgroundColor: '#ffffff',
    scale: 2, // 2x for sharpness
    logging: false,
    useCORS: true,
    allowTaint: false,
  })

  // Build final canvas with header & footer
  return composePoster(treeCanvas, options)
}

function composePoster(treeImage, { treeName, treeDesc, ownerName, persons, sizeId, themeColor = '#0d9488' }) {
  const stats = calculateFamilyStats(persons || [])

  // Determine output canvas size based on sizeId
  const sizes = {
    'ig-story':       { w: 1080, h: 1920 },
    'ig-post':        { w: 1080, h: 1080 },
    'a4-portrait':    { w: 2480, h: 3508 },
    'a4-landscape':   { w: 3508, h: 2480 },
    'a3-portrait':    { w: 3508, h: 4961 },
    'a3-landscape':   { w: 4961, h: 3508 },
    'kuarto-portrait':  { w: 2550, h: 3300 },
    'kuarto-landscape': { w: 3300, h: 2550 },
  }
  const sz = sizes[sizeId] || sizes['a4-landscape']
  const W = sz.w, H = sz.h

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // White background with subtle paper feel
  ctx.fillStyle = '#fefefe'
  ctx.fillRect(0, 0, W, H)

  // Decorative border
  ctx.strokeStyle = themeColor
  ctx.globalAlpha = 0.25
  ctx.lineWidth = Math.max(3, W * 0.003)
  const margin = Math.min(W, H) * 0.025
  roundRect(ctx, margin, margin, W - margin*2, H - margin*2, 16)
  ctx.stroke()
  ctx.globalAlpha = 1

  // Header area
  const headerH = H * 0.12
  let y = H * 0.04

  // Small label
  ctx.fillStyle = '#94a3b8'
  ctx.font = `700 ${W * 0.012}px "Inter", sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText('SILSILAH KELUARGA', W / 2, y)
  y += W * 0.018

  // Tree name (big)
  ctx.fillStyle = '#0f172a'
  const titleSize = W * 0.032
  ctx.font = `900 ${titleSize}px "Playfair Display", "Times New Roman", serif`
  ctx.fillText(treeName || 'Keluarga Besar', W / 2, y)
  y += titleSize * 1.15

  // Description
  if (treeDesc) {
    ctx.fillStyle = '#475569'
    ctx.font = `italic ${W * 0.014}px "Merriweather", serif`
    ctx.fillText(treeDesc, W / 2, y)
    y += W * 0.022
  }

  // Meta
  ctx.fillStyle = '#94a3b8'
  ctx.font = `400 ${W * 0.011}px "Inter", sans-serif`
  const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  ctx.fillText(ownerName ? `Disusun oleh ${ownerName} · ${today}` : `Dicetak ${today}`, W / 2, y)
  y += W * 0.025

  // Calculate tree image area
  const footerH = H * 0.08
  const treeAreaY = y + W * 0.01
  const treeAreaH = H - footerH - treeAreaY - margin
  const treeAreaW = W - margin * 4
  const treeAreaX = margin * 2

  // Scale tree image to fit
  const treeRatio = treeImage.width / treeImage.height
  const areaRatio = treeAreaW / treeAreaH
  let drawW, drawH
  if (treeRatio > areaRatio) {
    // Tree wider than area — fit width
    drawW = treeAreaW
    drawH = drawW / treeRatio
  } else {
    drawH = treeAreaH
    drawW = drawH * treeRatio
  }
  const drawX = treeAreaX + (treeAreaW - drawW) / 2
  const drawY = treeAreaY + (treeAreaH - drawH) / 2

  // Draw tree image
  ctx.drawImage(treeImage, drawX, drawY, drawW, drawH)

  // Footer divider
  const footerY = H - footerH
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(W * 0.15, footerY)
  ctx.lineTo(W * 0.85, footerY)
  ctx.stroke()

  // Stats in footer
  const statsBoxes = [
    { label: 'Total Anggota', value: stats.total },
    { label: 'Generasi', value: stats.generations },
    { label: 'Rentang Tahun', value: stats.yearRange || '—' },
  ]
  const boxW = W / 3
  const yStat = footerY + W * 0.012
  statsBoxes.forEach((b, i) => {
    const cx = boxW * i + boxW / 2
    ctx.fillStyle = '#0f172a'
    ctx.font = `900 ${W * 0.018}px "Playfair Display", serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(String(b.value), cx, yStat)
    ctx.fillStyle = '#94a3b8'
    ctx.font = `600 ${W * 0.009}px "Inter", sans-serif`
    ctx.fillText(b.label.toUpperCase(), cx, yStat + W * 0.024)
  })

  // Watermark
  ctx.fillStyle = '#94a3b8'
  ctx.globalAlpha = 0.7
  ctx.font = `600 ${W * 0.011}px "Inter", sans-serif`
  ctx.textAlign = 'right'
  ctx.textBaseline = 'bottom'
  ctx.fillText('🌳 sulalah.my.id', W - margin - 10, H - margin - 8)
  ctx.globalAlpha = 1

  return canvas
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

export function downloadPNG(canvas, filename = 'sulalah-poster.png') {
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 'image/png')
}

export async function downloadPDF(canvas, filename = 'sulalah-poster.pdf', sizeId) {
  const { jsPDF } = await import('jspdf')
  let pdfW, pdfH, orientation
  if (sizeId === 'a4-portrait') { pdfW = 210; pdfH = 297; orientation = 'p' }
  else if (sizeId === 'a4-landscape') { pdfW = 297; pdfH = 210; orientation = 'l' }
  else if (sizeId === 'a3-portrait') { pdfW = 297; pdfH = 420; orientation = 'p' }
  else if (sizeId === 'a3-landscape') { pdfW = 420; pdfH = 297; orientation = 'l' }
  else if (sizeId === 'kuarto-portrait') { pdfW = 216; pdfH = 279; orientation = 'p' }
  else if (sizeId === 'kuarto-landscape') { pdfW = 279; pdfH = 216; orientation = 'l' }
  else if (sizeId === 'ig-story') { pdfW = 108; pdfH = 192; orientation = 'p' }
  else if (sizeId === 'ig-post') { pdfW = 108; pdfH = 108; orientation = 'p' }
  else { pdfW = 297; pdfH = 210; orientation = 'l' }

  const pdf = new jsPDF({ orientation, unit: 'mm', format: orientation === 'p' ? [pdfW, pdfH] : [pdfH, pdfW] })
  const imgData = canvas.toDataURL('image/jpeg', 0.92)
  pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH)
  pdf.save(filename)
}
