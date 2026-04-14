'use client'
import { useState } from 'react'

const THEMES = [
  {
    id: 'clean',
    name: 'Clean',
    desc: 'Putih bersih, minimalis',
    preview: { bg: '#ffffff', card: '#f0fdfa', accent: '#14b8a6', text: '#0f2520', border: '#d1faf4' },
  },
  {
    id: 'woody',
    name: 'Woody',
    desc: 'Hangat seperti kayu & alam',
    preview: { bg: '#fdf6ee', card: '#fef9f0', accent: '#a16207', text: '#3d2000', border: '#d4a96a' },
  },
  {
    id: 'elegant',
    name: 'Elegant',
    desc: 'Gelap, mewah, berkesan',
    preview: { bg: '#1a1a2e', card: '#16213e', accent: '#e2c97e', text: '#f0e6d3', border: '#4a4a6a' },
  },
  {
    id: 'islamic',
    name: 'Islamic',
    desc: 'Hijau & gold, bernuansa Islami',
    preview: { bg: '#f0f7f0', card: '#e8f5e8', accent: '#1b5e20', text: '#1a3a1a', border: '#81c784' },
  },
  {
    id: 'gradient',
    name: 'Gradient',
    desc: 'Modern dengan gradasi teal',
    preview: { bg: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)', card: '#ffffff', accent: '#0d9488', text: '#0f2520', border: '#5eead4' },
  },
]

export default function PdfThemeModal({ treeName, onPrint, onClose }) {
  const [selected, setSelected] = useState('clean')

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:16 }}>
      <div style={{ background:'var(--card)', borderRadius:16, padding:24, maxWidth:480, width:'100%', maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <h3 style={{ fontSize:17, fontWeight:700, color:'var(--tx)' }}>🖨️ Pilih Tema Cetak</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:18, cursor:'pointer', color:'var(--tx2)' }}>✕</button>
        </div>
        <p style={{ fontSize:13, color:'var(--tx2)', marginBottom:16 }}>
          Pilih nuansa tampilan untuk dicetak atau disimpan sebagai PDF. Cocok dipajang di rumah!
        </p>

        <div style={{ display:'grid', gap:10, marginBottom:20 }}>
          {THEMES.map(t => (
            <div key={t.id}
              onClick={() => setSelected(t.id)}
              style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderRadius:10, border:`2px solid ${selected===t.id?'var(--t4)':'var(--bd)'}`, background: selected===t.id?'var(--surf)':'transparent', cursor:'pointer', transition:'all .15s' }}>
              {/* Preview swatch */}
              <div style={{ width:48, height:36, borderRadius:6, background:t.preview.bg, border:`1px solid ${t.preview.border}`, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', gap:3 }}>
                {[...Array(3)].map((_,i) => (
                  <div key={i} style={{ width:10, height:i===1?28:22, borderRadius:3, background:t.preview.card, border:`1px solid ${t.preview.border}` }}></div>
                ))}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:600, color:'var(--tx)' }}>{t.name}</div>
                <div style={{ fontSize:11, color:'var(--tx2)' }}>{t.desc}</div>
              </div>
              {selected===t.id && <span style={{ color:'var(--t4)', fontSize:18 }}>✓</span>}
            </div>
          ))}
        </div>

        <div style={{ background:'var(--surf)', border:'1px solid var(--bd)', borderRadius:8, padding:'10px 12px', marginBottom:16, fontSize:12, color:'var(--tx2)', lineHeight:1.6 }}>
          💡 Watermark <strong>Sulalah</strong> akan muncul kecil di pojok kanan bawah. Orientasi landscape disarankan untuk pohon yang besar.
        </div>

        <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
          <button className="btn btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn btn-primary" onClick={() => onPrint(selected)}>
            🖨️ Cetak / Simpan PDF
          </button>
        </div>
      </div>
    </div>
  )
}

export { THEMES }
