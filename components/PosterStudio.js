'use client'
import { useState, useEffect, useRef } from 'react'
import { POSTER_SIZES, POSTER_THEMES } from '../lib/posterThemes'
import { captureTreeCanvas, downloadPNG, downloadPDF } from '../lib/canvasScreenshot'
import { calculateFamilyStats } from '../lib/posterStats'
import { PROMPT_STYLES, buildGeminiPrompt } from '../lib/geminiPrompt'

export default function PosterStudio({ treeName, treeDesc, persons = [], marriages = [], ownerName, onClose }) {
  const [mode, setMode] = useState(null) // null | 'direct' | 'gemini'
  const [step, setStep] = useState(1)
  const [sizeId, setSizeId] = useState(null)
  const [themeId, setThemeId] = useState(null)
  const [styleId, setStyleId] = useState(null)
  const [showStats, setShowStats] = useState(true)
  const [format, setFormat] = useState('png')
  const [previewUrl, setPreviewUrl] = useState(null)
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [progress, setProgress] = useState('')
  const [copied, setCopied] = useState(false)
  const [err, setErr] = useState('')
  const canvasRef = useRef(null)
  const stats = calculateFamilyStats(persons, marriages)

  // Generate preview when reaching final step of direct mode
  useEffect(() => {
    if (mode === 'direct' && step === 3 && sizeId) generatePreview()
  }, [mode, step, sizeId, showStats])

  // Generate prompt when reaching final step of gemini mode
  useEffect(() => {
    if (mode === 'gemini' && step === 3 && sizeId && styleId) {
      const p = buildGeminiPrompt({ persons, marriages, treeName, treeDesc, sizeId, styleId, ownerName })
      setGeneratedPrompt(p)
    }
  }, [mode, step, sizeId, styleId])

  async function generatePreview() {
    setGenerating(true); setErr('')
    try {
      // Find tree canvas element in DOM
      const treeCanvasEl = document.getElementById('ci')
      if (!treeCanvasEl) {
        throw new Error('Canvas pohon tidak ditemukan. Pastikan Anda membuka halaman pohon terlebih dahulu.')
      }
      const canvas = await captureTreeCanvas(treeCanvasEl, {
        treeName, treeDesc, ownerName, persons, sizeId,
      })
      canvasRef.current = canvas
      setPreviewUrl(canvas.toDataURL('image/jpeg', 0.7))
    } catch (e) {
      console.error(e)
      setErr('Gagal preview: ' + (e.message || 'unknown'))
    }
    setGenerating(false)
  }

  async function handleExport() {
    if (!canvasRef.current) return
    setExporting(true); setErr('')
    try {
      const filename = `sulalah-${slug(treeName)}-${Date.now()}.${format}`
      setProgress(`Menyimpan ${format.toUpperCase()}...`)
      if (format === 'png') downloadPNG(canvasRef.current, filename)
      else await downloadPDF(canvasRef.current, filename, sizeId)
      setProgress('Selesai! ✓')
      setTimeout(() => { setExporting(false); setProgress('') }, 1500)
    } catch (e) {
      setErr('Gagal ekspor: ' + (e.message || 'unknown'))
      setExporting(false); setProgress('')
    }
  }

  function copyPrompt() {
    navigator.clipboard.writeText(generatedPrompt).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  function resetAndChangeMode(newMode) {
    setMode(newMode); setStep(1); setSizeId(null); setThemeId(null); setStyleId(null)
    setPreviewUrl(null); setGeneratedPrompt(''); setErr(''); setCopied(false)
  }

  function canNext() {
    if (mode === 'direct') {
      if (step === 1) return !!sizeId
      if (step === 2) return true
    } else if (mode === 'gemini') {
      if (step === 1) return !!sizeId
      if (step === 2) return !!styleId
    }
    return false
  }

  const maxStep = mode === 'direct' ? 3 : 3

  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:16,backdropFilter:'blur(4px)' }}>
      <div style={{ background:'var(--card)',borderRadius:18,maxWidth:760,width:'100%',maxHeight:'94vh',overflowY:'auto',boxShadow:'0 24px 60px rgba(0,0,0,.4)' }}>

        {/* Header */}
        <div style={{ padding:'18px 24px 12px',borderBottom:'1px solid var(--bd)',position:'sticky',top:0,background:'var(--card)',zIndex:2 }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
            <div>
              <h3 style={{ fontSize:18,fontWeight:800,color:'var(--tx)' }}>🖼️ Studio Poster Silsilah</h3>
              <p style={{ fontSize:12,color:'var(--tx2)',marginTop:2 }}>
                {!mode ? 'Pilih cara ekspor yang Anda inginkan' :
                 mode === 'direct' ? 'Ekspor langsung dari Sulalah' :
                 'Hasilkan prompt untuk AI Gemini'}
              </p>
            </div>
            <button onClick={onClose} style={{ background:'none',border:'none',fontSize:22,cursor:'pointer',color:'var(--tx3)',padding:'4px 10px' }}>✕</button>
          </div>

          {mode && (
            <>
              <div style={{ display:'flex',gap:6,marginTop:14 }}>
                {Array.from({ length: maxStep }, (_, i) => i + 1).map(n => (
                  <div key={n} style={{ flex:1,height:4,borderRadius:2,background:n<=step?'var(--t4)':'var(--bd)',transition:'background .25s' }} />
                ))}
              </div>
              <div style={{ fontSize:11,color:'var(--tx3)',marginTop:6,textAlign:'center' }}>
                Langkah {step} dari {maxStep}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div style={{ padding:'20px 24px' }}>

          {/* ─── MODE SELECTION ─── */}
          {!mode && (
            <>
              <div style={{ textAlign:'center',marginBottom:20 }}>
                <div style={{ fontSize:42,marginBottom:10 }}>✨</div>
                <h4 style={{ fontSize:17,fontWeight:700,color:'var(--tx)',marginBottom:6 }}>Bagaimana Anda ingin mengekspor?</h4>
                <p style={{ fontSize:13,color:'var(--tx2)',lineHeight:1.6 }}>Sulalah menawarkan 2 cara — pilih sesuai kebutuhan Anda.</p>
              </div>

              <div style={{ display:'grid',gap:12,gridTemplateColumns:'1fr 1fr',marginBottom:12 }}>
                {/* Direct export */}
                <button onClick={()=>resetAndChangeMode('direct')}
                  style={{ padding:'20px 18px',borderRadius:14,border:'2px solid var(--bd)',background:'var(--card)',cursor:'pointer',textAlign:'left',transition:'all .2s' }}
                  onMouseOver={e=>{e.currentTarget.style.borderColor='var(--t4)';e.currentTarget.style.background='var(--t2)'}}
                  onMouseOut={e=>{e.currentTarget.style.borderColor='var(--bd)';e.currentTarget.style.background='var(--card)'}}>
                  <div style={{ fontSize:30,marginBottom:10 }}>💾</div>
                  <div style={{ fontSize:15,fontWeight:700,color:'var(--tx)',marginBottom:6 }}>Ekspor Langsung</div>
                  <div style={{ fontSize:11,color:'var(--tx2)',lineHeight:1.6 }}>Generate PNG/PDF langsung dari Sulalah. Cepat & siap pakai.</div>
                  <div style={{ fontSize:10,color:'var(--t5)',marginTop:10,fontWeight:600 }}>✓ 5 tema · ✓ 4 ukuran · ✓ Tidak perlu app lain</div>
                </button>

                {/* Gemini prompt */}
                <button onClick={()=>resetAndChangeMode('gemini')}
                  style={{ padding:'20px 18px',borderRadius:14,border:'2px solid var(--amber-b)',background:'var(--amber-bg)',cursor:'pointer',textAlign:'left',transition:'all .2s',position:'relative' }}>
                  <div style={{ position:'absolute',top:10,right:10,fontSize:9,background:'var(--amber-t)',color:'#fff',padding:'3px 8px',borderRadius:20,fontWeight:700 }}>✨ AI</div>
                  <div style={{ fontSize:30,marginBottom:10 }}>🎨</div>
                  <div style={{ fontSize:15,fontWeight:700,color:'var(--amber-t)',marginBottom:6 }}>Buat Prompt Gemini</div>
                  <div style={{ fontSize:11,color:'var(--tx2)',lineHeight:1.6 }}>Generate prompt detail untuk Gemini AI. Hasilnya jauh lebih artistik & premium.</div>
                  <div style={{ fontSize:10,color:'var(--amber-t)',marginTop:10,fontWeight:600 }}>✓ 5 style unik · ✓ Hasil studio-grade · ✓ Gratis via Gemini</div>
                </button>
              </div>

              <div style={{ padding:'10px 12px',background:'var(--surf)',borderRadius:8,fontSize:11,color:'var(--tx2)',lineHeight:1.6,textAlign:'center' }}>
                💡 <strong>Tip:</strong> Prompt Gemini akan memberi Anda hasil jauh lebih cantik, cocok untuk dipajang atau dibagikan ke keluarga.
              </div>
            </>
          )}

          {/* ══════════ DIRECT MODE ══════════ */}

          {/* STEP 1 (DIRECT): SIZE */}
          {mode === 'direct' && step === 1 && (
            <>
              <h4 style={{ fontSize:15,fontWeight:700,color:'var(--tx)',marginBottom:4 }}>1. Pilih Ukuran</h4>
              <p style={{ fontSize:12,color:'var(--tx2)',marginBottom:14 }}>Pilih ukuran sesuai kebutuhan.</p>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:10 }}>
                {POSTER_SIZES.map(s => (
                  <button key={s.id} onClick={()=>setSizeId(s.id)}
                    style={{ padding:'14px',borderRadius:12,border:`2px solid ${sizeId===s.id?'var(--t4)':'var(--bd)'}`,background:sizeId===s.id?'var(--t2)':'var(--card)',cursor:'pointer',textAlign:'left' }}>
                    <div style={{ display:'flex',justifyContent:'center',marginBottom:8 }}>
                      <div style={{ width:s.orientation==='landscape'?60:s.orientation==='square'?42:36,height:s.orientation==='landscape'?36:s.orientation==='square'?42:58,background:'var(--surf)',border:`1.5px solid ${sizeId===s.id?'var(--t4)':'var(--bd2)'}`,borderRadius:4 }} />
                    </div>
                    <div style={{ fontSize:13,fontWeight:700,color:sizeId===s.id?'var(--t6)':'var(--tx)' }}>{s.name}</div>
                    <div style={{ fontSize:10,color:'var(--tx3)',marginTop:2,lineHeight:1.5 }}>{s.desc}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* STEP 2 (DIRECT): OPTIONS — theme skipped karena pakai screenshot canvas */}
          {mode === 'direct' && step === 2 && (
            <>
              <h4 style={{ fontSize:15,fontWeight:700,color:'var(--tx)',marginBottom:4 }}>2. Pengaturan</h4>
              <p style={{ fontSize:12,color:'var(--tx2)',marginBottom:14 }}>Poster akan dibuat dari tampilan pohon di layar dengan header & footer elegan.</p>

              <div style={{ display:'grid',gap:10,marginBottom:16 }}>
                <label style={{ display:'flex',alignItems:'center',gap:12,padding:'12px 14px',background:'var(--surf)',borderRadius:10,border:'1px solid var(--bd)',cursor:'pointer' }}>
                  <input type="checkbox" checked={showStats} onChange={e=>setShowStats(e.target.checked)} style={{ width:18,height:18 }} />
                  <div>
                    <div style={{ fontSize:13,fontWeight:700,color:'var(--tx)' }}>📊 Statistik Keluarga di Footer</div>
                    <div style={{ fontSize:11,color:'var(--tx2)',marginTop:2 }}>Total anggota, generasi, rentang tahun</div>
                  </div>
                </label>
              </div>

              <div style={{ fontSize:12,fontWeight:700,color:'var(--tx2)',marginBottom:8 }}>Format Export</div>
              <div style={{ display:'flex',gap:8,marginBottom:14 }}>
                {[{id:'png',label:'🖼️ PNG',desc:'Share sosmed'},{id:'pdf',label:'📄 PDF',desc:'Cetak printer'}].map(f=>(
                  <button key={f.id} onClick={()=>setFormat(f.id)}
                    style={{ flex:1,padding:'12px',borderRadius:10,border:`2px solid ${format===f.id?'var(--t4)':'var(--bd)'}`,background:format===f.id?'var(--t2)':'var(--card)',cursor:'pointer' }}>
                    <div style={{ fontSize:14,fontWeight:700,color:format===f.id?'var(--t6)':'var(--tx)' }}>{f.label}</div>
                    <div style={{ fontSize:10,color:'var(--tx3)',marginTop:3 }}>{f.desc}</div>
                  </button>
                ))}
              </div>

              <div style={{ padding:'10px 12px',background:'var(--t2)',border:'1px solid var(--t3)',borderRadius:8,fontSize:11,color:'var(--tx2)',lineHeight:1.6 }}>
                💡 <strong>Tip:</strong> Atur zoom pohon di canvas sebelum ekspor untuk hasil terbaik. Gunakan tombol zoom di pojok kanan canvas.
              </div>
            </>
          )}

          {/* STEP 3 (DIRECT): PREVIEW & EXPORT */}
          {mode === 'direct' && step === 3 && (
            <>
              <h4 style={{ fontSize:15,fontWeight:700,color:'var(--tx)',marginBottom:4 }}>3. Preview & Ekspor</h4>
              <div style={{ display:'flex',justifyContent:'center',marginBottom:16,padding:20,background:'var(--surf)',borderRadius:12 }}>
                {generating ? (
                  <div style={{ padding:'60px 20px',textAlign:'center' }}>
                    <div style={{ fontSize:36,marginBottom:10 }}>📸</div>
                    <div style={{ fontSize:13,color:'var(--tx2)' }}>Memotret pohon & menyusun poster...</div>
                  </div>
                ) : previewUrl ? (
                  <img src={previewUrl} alt="Preview" style={{ maxWidth:'100%',maxHeight:420,boxShadow:'0 8px 24px rgba(0,0,0,.15)',borderRadius:4 }} />
                ) : null}
              </div>
              {err && <div style={{ background:'var(--rose-bg)',border:'1px solid var(--rose-b)',color:'var(--rose-t)',padding:'10px 14px',borderRadius:8,fontSize:12,marginBottom:12 }}>⚠ {err}</div>}
              {progress && <div style={{ background:'var(--t2)',border:'1px solid var(--t3)',color:'var(--t6)',padding:'10px 14px',borderRadius:8,fontSize:12,marginBottom:12,textAlign:'center',fontWeight:600 }}>{progress}</div>}
            </>
          )}

          {/* ══════════ GEMINI MODE ══════════ */}

          {/* STEP 1 (GEMINI): SIZE */}
          {mode === 'gemini' && step === 1 && (
            <>
              <h4 style={{ fontSize:15,fontWeight:700,color:'var(--tx)',marginBottom:4 }}>1. Pilih Ukuran</h4>
              <p style={{ fontSize:12,color:'var(--tx2)',marginBottom:14 }}>Ukuran mempengaruhi rasio output dari Gemini.</p>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:10 }}>
                {POSTER_SIZES.map(s => (
                  <button key={s.id} onClick={()=>setSizeId(s.id)}
                    style={{ padding:'14px',borderRadius:12,border:`2px solid ${sizeId===s.id?'var(--amber-t)':'var(--bd)'}`,background:sizeId===s.id?'var(--amber-bg)':'var(--card)',cursor:'pointer',textAlign:'left' }}>
                    <div style={{ display:'flex',justifyContent:'center',marginBottom:8 }}>
                      <div style={{ width:s.orientation==='landscape'?60:s.orientation==='square'?42:36,height:s.orientation==='landscape'?36:s.orientation==='square'?42:58,background:'var(--surf)',border:`1.5px solid ${sizeId===s.id?'var(--amber-t)':'var(--bd2)'}`,borderRadius:4 }} />
                    </div>
                    <div style={{ fontSize:13,fontWeight:700,color:sizeId===s.id?'var(--amber-t)':'var(--tx)' }}>{s.name}</div>
                    <div style={{ fontSize:10,color:'var(--tx3)',marginTop:2 }}>{s.desc}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* STEP 2 (GEMINI): STYLE */}
          {mode === 'gemini' && step === 2 && (
            <>
              <h4 style={{ fontSize:15,fontWeight:700,color:'var(--tx)',marginBottom:4 }}>2. Pilih Style AI</h4>
              <p style={{ fontSize:12,color:'var(--tx2)',marginBottom:14 }}>5 style artistik yang bisa Anda minta ke Gemini.</p>
              <div style={{ display:'grid',gap:10 }}>
                {PROMPT_STYLES.map(s => (
                  <button key={s.id} onClick={()=>setStyleId(s.id)}
                    style={{ padding:'14px 16px',borderRadius:12,border:`2px solid ${styleId===s.id?'var(--amber-t)':'var(--bd)'}`,background:styleId===s.id?'var(--amber-bg)':'var(--card)',cursor:'pointer',textAlign:'left',display:'flex',gap:14,alignItems:'center' }}>
                    <div style={{ fontSize:28,flexShrink:0 }}>{s.emoji}</div>
                    <div>
                      <div style={{ fontSize:14,fontWeight:700,color:styleId===s.id?'var(--amber-t)':'var(--tx)' }}>{s.name}</div>
                      <div style={{ fontSize:11,color:'var(--tx2)',marginTop:2,lineHeight:1.5 }}>{s.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* STEP 3 (GEMINI): PROMPT RESULT */}
          {mode === 'gemini' && step === 3 && (
            <>
              <h4 style={{ fontSize:15,fontWeight:700,color:'var(--tx)',marginBottom:4 }}>3. Prompt Siap Pakai ✨</h4>
              <p style={{ fontSize:12,color:'var(--tx2)',marginBottom:14 }}>Copy prompt ini dan paste ke <strong style={{ color:'var(--amber-t)' }}>gemini.google.com</strong> untuk mendapat hasil artistik premium.</p>

              {/* How to use */}
              <div style={{ background:'var(--amber-bg)',border:'1px solid var(--amber-b)',borderRadius:10,padding:'12px 14px',marginBottom:14 }}>
                <div style={{ fontSize:12,fontWeight:700,color:'var(--amber-t)',marginBottom:6 }}>📖 Cara Pakai:</div>
                <ol style={{ margin:'0 0 0 18px',fontSize:11,color:'var(--tx)',lineHeight:1.7 }}>
                  <li>Klik tombol <strong>Copy Prompt</strong> di bawah</li>
                  <li>Buka <a href="https://gemini.google.com" target="_blank" rel="noreferrer" style={{ color:'var(--amber-t)' }}>gemini.google.com</a> (login dengan akun Google)</li>
                  <li>Paste prompt & kirim</li>
                  <li>Tunggu Gemini generate gambar (~10–30 detik)</li>
                  <li>Minta revisi kalau perlu: "buat lebih detail", "tambah ornamen", dll</li>
                  <li>Download & share! 🎉</li>
                </ol>
              </div>

              {/* Prompt box */}
              <div style={{ position:'relative',marginBottom:14 }}>
                <textarea
                  readOnly
                  value={generatedPrompt}
                  style={{ width:'100%',minHeight:280,maxHeight:360,fontFamily:'monospace',fontSize:11,padding:'12px 14px',borderRadius:10,border:'1px solid var(--bd)',background:'var(--surf)',color:'var(--tx)',lineHeight:1.5,resize:'vertical' }}
                />
              </div>

              <button onClick={copyPrompt} className="btn btn-primary"
                style={{ width:'100%',justifyContent:'center',fontSize:14,padding:'12px',background:copied?'var(--t5)':'var(--amber-t)',borderColor:copied?'var(--t5)':'var(--amber-t)' }}>
                {copied ? '✓ Berhasil di-copy! Buka Gemini →' : '📋 Copy Prompt'}
              </button>

              {copied && (
                <a href="https://gemini.google.com" target="_blank" rel="noreferrer" style={{ display:'block',textAlign:'center',marginTop:10,fontSize:12,color:'var(--amber-t)',fontWeight:600 }}>
                  🚀 Buka Gemini di tab baru
                </a>
              )}

              {err && <div style={{ background:'var(--rose-bg)',border:'1px solid var(--rose-b)',color:'var(--rose-t)',padding:'10px 14px',borderRadius:8,fontSize:12,marginTop:12 }}>⚠ {err}</div>}
            </>
          )}

        </div>

        {/* Footer actions */}
        {mode && (
          <div style={{ padding:'14px 24px',borderTop:'1px solid var(--bd)',display:'flex',justifyContent:'space-between',gap:8,position:'sticky',bottom:0,background:'var(--card)' }}>
            <button className="btn btn-ghost" onClick={step===1?()=>setMode(null):()=>setStep(step-1)} disabled={exporting} style={{ fontSize:13 }}>
              {step===1?'← Ganti Mode':'← Kembali'}
            </button>
            {mode === 'direct' && step < 3 && (
              <button className="btn btn-primary" onClick={()=>setStep(step+1)} disabled={!canNext()} style={{ fontSize:13 }}>
                Lanjut →
              </button>
            )}
            {mode === 'direct' && step === 3 && (
              <button className="btn btn-primary" onClick={handleExport} disabled={generating || exporting || !previewUrl} style={{ fontSize:13 }}>
                {exporting ? 'Mengekspor...' : `💾 Ekspor ${format.toUpperCase()}`}
              </button>
            )}
            {mode === 'gemini' && step < 3 && (
              <button className="btn btn-primary" onClick={()=>setStep(step+1)} disabled={!canNext()} style={{ fontSize:13,background:'var(--amber-t)',borderColor:'var(--amber-t)' }}>
                Lanjut →
              </button>
            )}
            {mode === 'gemini' && step === 3 && (
              <button className="btn btn-primary" onClick={onClose} style={{ fontSize:13 }}>
                Selesai ✓
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function slug(s) {
  return (s || 'pohon').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)
}
