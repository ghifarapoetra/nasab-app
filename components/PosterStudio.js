'use client'
import { useState, useEffect, useRef } from 'react'
import { POSTER_SIZES, POSTER_THEMES } from '../lib/posterThemes'
import { renderPoster, canvasToPNG, canvasToPDF } from '../lib/posterEngine'
import { calculateFamilyStats } from '../lib/posterStats'

export default function PosterStudio({ treeName, treeDesc, persons = [], ownerName, onClose }) {
  const [step, setStep] = useState(1)
  const [sizeId, setSizeId] = useState(null)
  const [themeId, setThemeId] = useState(null)
  const [showStats, setShowStats] = useState(true)
  const [format, setFormat] = useState('png')
  const [previewUrl, setPreviewUrl] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [progress, setProgress] = useState('')
  const [err, setErr] = useState('')
  const canvasRef = useRef(null)

  const stats = calculateFamilyStats(persons)

  // Generate preview when reach step 4
  useEffect(() => {
    if (step === 4 && sizeId && themeId) {
      generatePreview()
    }
  }, [step, sizeId, themeId, showStats])

  async function generatePreview() {
    setGenerating(true); setErr('')
    try {
      const canvas = await renderPoster({
        persons, treeName, treeDesc, sizeId, themeId, ownerName,
        options: { showStats },
      })
      canvasRef.current = canvas
      setPreviewUrl(canvas.toDataURL('image/jpeg', 0.75))
    } catch (e) {
      console.error(e)
      setErr('Gagal membuat preview: ' + (e.message || 'unknown'))
    }
    setGenerating(false)
  }

  async function handleExport() {
    if (!canvasRef.current) return
    setExporting(true); setErr('')
    try {
      const filename = `sulalah-${slug(treeName)}-${Date.now()}.${format}`
      setProgress('Menyiapkan file...')
      await new Promise(r => setTimeout(r, 100))

      if (format === 'png') {
        setProgress('Menyimpan PNG...')
        canvasToPNG(canvasRef.current, filename)
      } else {
        setProgress('Menyimpan PDF...')
        await canvasToPDF(canvasRef.current, filename, sizeId)
      }

      setProgress('Selesai! ✓')
      setTimeout(() => { setExporting(false); setProgress('') }, 1500)
    } catch (e) {
      console.error(e)
      setErr('Gagal ekspor: ' + (e.message || 'unknown'))
      setExporting(false); setProgress('')
    }
  }

  function canNext() {
    if (step === 1) return !!sizeId
    if (step === 2) return !!themeId
    if (step === 3) return true
    return false
  }

  function nextStep() { if (canNext() && step < 4) setStep(step + 1) }
  function prevStep() { if (step > 1) setStep(step - 1) }

  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:16,backdropFilter:'blur(4px)' }}>
      <div style={{ background:'var(--card)',borderRadius:18,maxWidth:720,width:'100%',maxHeight:'94vh',overflowY:'auto',boxShadow:'0 24px 60px rgba(0,0,0,.4)' }}>

        {/* Header */}
        <div style={{ padding:'20px 24px 14px',borderBottom:'1px solid var(--bd)',position:'sticky',top:0,background:'var(--card)',zIndex:2 }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
            <div>
              <h3 style={{ fontSize:18,fontWeight:800,color:'var(--tx)' }}>🖼️ Studio Poster Silsilah</h3>
              <p style={{ fontSize:12,color:'var(--tx2)',marginTop:2 }}>Buat karya cantik dari silsilah Anda</p>
            </div>
            <button onClick={onClose} style={{ background:'none',border:'none',fontSize:22,cursor:'pointer',color:'var(--tx3)',padding:'4px 10px' }}>✕</button>
          </div>

          {/* Progress */}
          <div style={{ display:'flex',gap:6,marginTop:14 }}>
            {[1,2,3,4].map(n => (
              <div key={n} style={{ flex:1,height:4,borderRadius:2,background:n<=step?'var(--t4)':'var(--bd)',transition:'background .25s' }} />
            ))}
          </div>
          <div style={{ fontSize:11,color:'var(--tx3)',marginTop:6,textAlign:'center' }}>
            Langkah {step} dari 4 · {step===1?'Ukuran':step===2?'Tema':step===3?'Pengaturan':'Preview & Ekspor'}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding:'20px 24px' }}>

          {/* STEP 1: SIZE */}
          {step === 1 && (
            <>
              <h4 style={{ fontSize:15,fontWeight:700,color:'var(--tx)',marginBottom:4 }}>Pilih Ukuran</h4>
              <p style={{ fontSize:12,color:'var(--tx2)',marginBottom:16 }}>Ukuran menentukan layout dan kegunaan poster Anda.</p>

              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))',gap:10 }}>
                {POSTER_SIZES.map(s => (
                  <button key={s.id} onClick={()=>setSizeId(s.id)}
                    style={{ padding:'14px 14px',borderRadius:12,border:`2px solid ${sizeId===s.id?'var(--t4)':'var(--bd)'}`,background:sizeId===s.id?'var(--t2)':'var(--card)',cursor:'pointer',textAlign:'left',transition:'all .15s' }}>

                    {/* Mini preview */}
                    <div style={{ display:'flex',justifyContent:'center',marginBottom:10 }}>
                      <div style={{
                        width: s.orientation==='landscape'?70:s.orientation==='square'?50:40,
                        height: s.orientation==='landscape'?40:s.orientation==='square'?50:66,
                        background:'var(--surf)',
                        border:`1.5px solid ${sizeId===s.id?'var(--t4)':'var(--bd2)'}`,
                        borderRadius:4,
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'center',
                      }}>
                        <span style={{ fontSize:9,color:'var(--tx3)' }}>{s.category==='print'?'📄':'📱'}</span>
                      </div>
                    </div>

                    <div style={{ fontSize:13,fontWeight:700,color:sizeId===s.id?'var(--t6)':'var(--tx)',marginBottom:3 }}>{s.name}</div>
                    <div style={{ fontSize:10,color:'var(--tx3)',lineHeight:1.5 }}>{s.desc}</div>
                    <div style={{ fontSize:9,color:'var(--tx3)',marginTop:4,fontWeight:600 }}>{s.width} × {s.height}</div>
                  </button>
                ))}
              </div>

              <div style={{ marginTop:14,padding:'10px 12px',background:'var(--surf)',borderRadius:8,fontSize:11,color:'var(--tx2)',lineHeight:1.6 }}>
                💡 <strong>Tip:</strong> IG Story & Post untuk share ke sosmed. A4 untuk cetak di rumah atau print shop.
              </div>
            </>
          )}

          {/* STEP 2: THEME */}
          {step === 2 && (
            <>
              <h4 style={{ fontSize:15,fontWeight:700,color:'var(--tx)',marginBottom:4 }}>Pilih Tema</h4>
              <p style={{ fontSize:12,color:'var(--tx2)',marginBottom:16 }}>5 tema gratis yang bisa Anda pakai.</p>

              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:10 }}>
                {POSTER_THEMES.map(t => (
                  <button key={t.id} onClick={()=>setThemeId(t.id)}
                    style={{ padding:'14px 14px',borderRadius:12,border:`2px solid ${themeId===t.id?'var(--t4)':'var(--bd)'}`,background:themeId===t.id?'var(--t2)':'var(--card)',cursor:'pointer',textAlign:'left',transition:'all .15s' }}>

                    {/* Color preview */}
                    <div style={{ display:'flex',gap:4,marginBottom:10 }}>
                      {t.preview.map((c, i) => (
                        <div key={i} style={{ flex:1,height:24,borderRadius:6,background:c,border:'1px solid var(--bd)' }} />
                      ))}
                    </div>

                    <div style={{ fontSize:13,fontWeight:700,color:themeId===t.id?'var(--t6)':'var(--tx)',marginBottom:3 }}>{t.name}</div>
                    <div style={{ fontSize:10,color:'var(--tx3)',lineHeight:1.5 }}>{t.desc}</div>
                  </button>
                ))}
              </div>

              <div style={{ marginTop:14,padding:'10px 12px',background:'var(--amber-bg)',borderRadius:8,fontSize:11,color:'var(--amber-t)',lineHeight:1.6,border:'1px solid var(--amber-b)' }}>
                ✨ <strong>Segera hadir:</strong> 10 tema premium (Kaligrafi Emas, Batik Nusantara, Malam Berbintang, dll.) untuk user Premium.
              </div>
            </>
          )}

          {/* STEP 3: OPTIONS */}
          {step === 3 && (
            <>
              <h4 style={{ fontSize:15,fontWeight:700,color:'var(--tx)',marginBottom:4 }}>Pengaturan Poster</h4>
              <p style={{ fontSize:12,color:'var(--tx2)',marginBottom:16 }}>Atur konten & format export.</p>

              {/* Toggles */}
              <div style={{ display:'grid',gap:10,marginBottom:18 }}>
                <label style={{ display:'flex',alignItems:'center',gap:12,padding:'12px 14px',background:'var(--surf)',borderRadius:10,border:'1px solid var(--bd)',cursor:'pointer' }}>
                  <input type="checkbox" checked={showStats} onChange={e=>setShowStats(e.target.checked)} style={{ width:18,height:18 }} />
                  <div>
                    <div style={{ fontSize:13,fontWeight:700,color:'var(--tx)' }}>📊 Statistik Keluarga</div>
                    <div style={{ fontSize:11,color:'var(--tx2)',marginTop:2 }}>Total anggota, generasi, rentang tahun</div>
                  </div>
                </label>
              </div>

              {/* Summary */}
              <div style={{ padding:'14px 16px',background:'var(--surf)',borderRadius:10,border:'1px solid var(--bd)',marginBottom:18 }}>
                <div style={{ fontSize:11,fontWeight:700,color:'var(--tx3)',letterSpacing:'.8px',textTransform:'uppercase',marginBottom:8 }}>Info Poster</div>
                <div style={{ fontSize:12,color:'var(--tx)',lineHeight:1.8 }}>
                  <div>📛 Nama: <strong>{treeName}</strong></div>
                  <div>👥 Anggota: <strong>{stats.total} orang</strong></div>
                  <div>🌳 Generasi: <strong>{stats.generations}</strong></div>
                  {stats.yearRange && <div>📅 Rentang: <strong>{stats.yearRange}</strong></div>}
                </div>
              </div>

              {/* Format */}
              <div>
                <div style={{ fontSize:12,fontWeight:700,color:'var(--tx2)',marginBottom:8 }}>Format Export</div>
                <div style={{ display:'flex',gap:8 }}>
                  {[
                    {id:'png',label:'🖼️ PNG',desc:'Untuk share sosmed (IG, WA, dll)'},
                    {id:'pdf',label:'📄 PDF',desc:'Untuk cetak di printer'},
                  ].map(f=>(
                    <button key={f.id} onClick={()=>setFormat(f.id)}
                      style={{ flex:1,padding:'12px',borderRadius:10,border:`2px solid ${format===f.id?'var(--t4)':'var(--bd)'}`,background:format===f.id?'var(--t2)':'var(--card)',cursor:'pointer',transition:'all .15s' }}>
                      <div style={{ fontSize:14,fontWeight:700,color:format===f.id?'var(--t6)':'var(--tx)' }}>{f.label}</div>
                      <div style={{ fontSize:10,color:'var(--tx3)',marginTop:3 }}>{f.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* STEP 4: PREVIEW & EXPORT */}
          {step === 4 && (
            <>
              <h4 style={{ fontSize:15,fontWeight:700,color:'var(--tx)',marginBottom:4 }}>Preview Poster</h4>
              <p style={{ fontSize:12,color:'var(--tx2)',marginBottom:16 }}>Periksa tampilan sebelum export. Preview kualitas rendah, hasil export full HD.</p>

              <div style={{ display:'flex',justifyContent:'center',marginBottom:16,padding:20,background:'var(--surf)',borderRadius:12 }}>
                {generating ? (
                  <div style={{ padding:'60px 20px',textAlign:'center' }}>
                    <div style={{ fontSize:36,marginBottom:12 }}>🎨</div>
                    <div style={{ fontSize:13,color:'var(--tx2)' }}>Menggambar poster...</div>
                    <div style={{ fontSize:11,color:'var(--tx3)',marginTop:4 }}>Mohon tunggu beberapa detik</div>
                  </div>
                ) : previewUrl ? (
                  <img src={previewUrl} alt="Preview" style={{ maxWidth:'100%',maxHeight:400,boxShadow:'0 8px 24px rgba(0,0,0,.15)',borderRadius:4 }} />
                ) : (
                  <div style={{ padding:'60px 20px',textAlign:'center',color:'var(--rose-t)' }}>Gagal membuat preview</div>
                )}
              </div>

              {err && <div style={{ background:'var(--rose-bg)',border:'1px solid var(--rose-b)',color:'var(--rose-t)',padding:'10px 14px',borderRadius:8,fontSize:12,marginBottom:12 }}>⚠ {err}</div>}
              {progress && <div style={{ background:'var(--t2)',border:'1px solid var(--t3)',color:'var(--t6)',padding:'10px 14px',borderRadius:8,fontSize:12,marginBottom:12,textAlign:'center',fontWeight:600 }}>{progress}</div>}
            </>
          )}

        </div>

        {/* Footer actions */}
        <div style={{ padding:'14px 24px',borderTop:'1px solid var(--bd)',display:'flex',justifyContent:'space-between',gap:8,position:'sticky',bottom:0,background:'var(--card)' }}>
          <button className="btn btn-ghost" onClick={step===1?onClose:prevStep} disabled={exporting} style={{ fontSize:13 }}>
            {step===1?'Batal':'← Kembali'}
          </button>
          {step < 4 ? (
            <button className="btn btn-primary" onClick={nextStep} disabled={!canNext()} style={{ fontSize:13 }}>
              Lanjut →
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleExport} disabled={generating || exporting || !previewUrl} style={{ fontSize:13 }}>
              {exporting ? 'Mengekspor...' : `💾 Ekspor ${format.toUpperCase()}`}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function slug(s) {
  return (s || 'pohon').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)
}
