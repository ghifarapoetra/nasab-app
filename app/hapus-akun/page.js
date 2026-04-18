'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase'

export const dynamic = 'force-dynamic'

export default function HapusAkunPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState('info')
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [err, setErr] = useState('')
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/auth?redirect=/hapus-akun'); return }
      setUser(session.user)
      setLoading(false)
    })
  }, [router])

  async function handleDelete() {
    if (confirmText !== 'HAPUS AKUN SAYA') {
      setErr('Ketik persis: HAPUS AKUN SAYA')
      return
    }
    setDeleting(true); setErr('')

    const res = await fetch('/api/hapus-akun', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    })
    const result = await res.json()

    if (result.success) {
      const supabase = createClient()
      await supabase.auth.signOut()
      setStep('success')
    } else {
      setErr(result.error || 'Gagal menghapus akun. Hubungi admin.')
      setDeleting(false)
    }
  }

  if (loading) return <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)',color:'var(--tx2)' }}>Memuat...</div>

  if (step === 'success') return (
    <main style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:24,background:'var(--bg)' }}>
      <div style={{ maxWidth:420,width:'100%',textAlign:'center' }}>
        <div style={{ fontSize:52,marginBottom:16 }}>🙏</div>
        <h2 style={{ fontSize:22,fontWeight:800,color:'var(--tx)',marginBottom:8 }}>Akun telah dihapus</h2>
        <p style={{ fontSize:14,color:'var(--tx2)',lineHeight:1.7,marginBottom:20 }}>
          Seluruh data Anda akan dihapus permanen dalam 30 hari. Terima kasih telah menggunakan Sulalah.
        </p>
        <p style={{ fontSize:12,color:'var(--tx3)',fontStyle:'italic',marginBottom:24 }}>
          Semoga Allah senantiasa menjaga silaturahim keluarga Anda. 🌳
        </p>
        <a href="/" className="btn btn-primary btn-pill" style={{ textDecoration:'none',fontSize:13,padding:'10px 24px' }}>Kembali ke Beranda</a>
      </div>
    </main>
  )

  return (
    <main style={{ maxWidth:540,margin:'0 auto',padding:'0 16px 40px' }}>
      <div className="topbar" style={{ borderRadius:'0 0 14px 14px',marginBottom:24 }}>
        <div>
          <div className="topbar-title">🌳 Sulalah</div>
          <div className="topbar-sub">Hapus Akun & Data</div>
        </div>
        <button onClick={()=>router.push('/dashboard')} style={{ background:'rgba(255,255,255,.15)',color:'#fff',border:'1px solid rgba(255,255,255,.3)',padding:'6px 12px',borderRadius:20,fontSize:12,cursor:'pointer' }}>← Kembali</button>
      </div>

      {step === 'info' && (
        <div className="card">
          <div style={{ textAlign:'center',marginBottom:16 }}>
            <div style={{ fontSize:44,marginBottom:10 }}>⚠️</div>
            <h1 style={{ fontSize:20,fontWeight:800,color:'var(--tx)',marginBottom:6 }}>Hapus Akun Sulalah</h1>
            <p style={{ fontSize:13,color:'var(--tx2)' }}>Akun: <strong>{user?.email}</strong></p>
          </div>

          <div style={{ background:'var(--rose-bg)',border:'1px solid var(--rose-b)',borderRadius:10,padding:'12px 14px',marginBottom:16 }}>
            <div style={{ fontSize:13,fontWeight:700,color:'var(--rose-t)',marginBottom:8 }}>Yang akan dihapus:</div>
            <ul style={{ margin:'0 0 0 20px',fontSize:12,color:'var(--tx)',lineHeight:1.8 }}>
              <li>Seluruh pohon silsilah yang Anda miliki</li>
              <li>Seluruh anggota keluarga yang Anda catat</li>
              <li>Foto-foto yang Anda upload</li>
              <li>Undangan aktif yang Anda buat</li>
              <li>Data profil Anda</li>
              <li>Status Premium (tidak ada refund)</li>
            </ul>
          </div>

          <div style={{ background:'var(--amber-bg)',border:'1px solid var(--amber-b)',borderRadius:10,padding:'12px 14px',marginBottom:16 }}>
            <div style={{ fontSize:12,color:'var(--amber-t)',lineHeight:1.7 }}>
              <strong>⚠ Proses ini tidak dapat dibatalkan.</strong><br/>
              Data akan dihapus permanen dalam 30 hari. Setelah itu, tidak ada cara untuk memulihkannya.
            </div>
          </div>

          <div style={{ background:'var(--surf)',border:'1px solid var(--bd)',borderRadius:10,padding:'12px 14px',marginBottom:20 }}>
            <div style={{ fontSize:12,fontWeight:700,color:'var(--tx)',marginBottom:6 }}>💡 Sebelum hapus, pertimbangkan:</div>
            <ul style={{ margin:'0 0 0 20px',fontSize:11,color:'var(--tx2)',lineHeight:1.7 }}>
              <li>Ekspor pohon Anda ke PDF/poster dulu sebagai cadangan</li>
              <li>Jika masalah teknis, hubungi kami dulu — mungkin bisa dibantu</li>
              <li>Jika ingin hanya berhenti pakai, Anda bisa <em>logout</em> saja tanpa hapus akun</li>
            </ul>
          </div>

          <div style={{ display:'flex',gap:8,justifyContent:'space-between',flexWrap:'wrap' }}>
            <button className="btn btn-ghost" onClick={()=>router.push('/dashboard')} style={{ fontSize:13 }}>
              Batalkan — kembali ke dashboard
            </button>
            <button
              onClick={()=>setStep('confirm')}
              style={{ background:'var(--rose-bg)',color:'var(--rose-t)',border:'1px solid var(--rose-b)',borderRadius:20,padding:'8px 16px',fontSize:13,fontWeight:600,cursor:'pointer' }}>
              Saya mengerti, lanjut hapus →
            </button>
          </div>
        </div>
      )}

      {step === 'confirm' && (
        <div className="card">
          <h2 style={{ fontSize:18,fontWeight:800,color:'var(--rose-t)',marginBottom:10,textAlign:'center' }}>
            Konfirmasi Penghapusan Akun
          </h2>
          <p style={{ fontSize:13,color:'var(--tx2)',lineHeight:1.7,marginBottom:16,textAlign:'center' }}>
            Untuk memastikan Anda benar-benar yakin, ketik persis frasa di bawah ini:
          </p>
          <div style={{ background:'var(--surf)',border:'1px solid var(--bd)',borderRadius:8,padding:'12px',marginBottom:14,textAlign:'center' }}>
            <code style={{ fontSize:14,fontWeight:700,color:'var(--rose-t)',letterSpacing:'.5px' }}>HAPUS AKUN SAYA</code>
          </div>

          <div className="field">
            <input
              value={confirmText}
              onChange={e=>setConfirmText(e.target.value)}
              placeholder="Ketik frasa di atas persis sama..."
              disabled={deleting}
              autoFocus
            />
          </div>

          {err && <p style={{ color:'var(--rose-t)',fontSize:13,marginBottom:10 }}>⚠ {err}</p>}

          <div style={{ display:'flex',gap:8,justifyContent:'space-between',flexWrap:'wrap' }}>
            <button className="btn btn-ghost" onClick={()=>{ setStep('info'); setConfirmText(''); setErr('') }} disabled={deleting} style={{ fontSize:13 }}>
              ← Batalkan
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting || confirmText !== 'HAPUS AKUN SAYA'}
              style={{ background:confirmText==='HAPUS AKUN SAYA'?'var(--rose-t)':'var(--tx3)',color:'#fff',border:'none',borderRadius:20,padding:'8px 18px',fontSize:13,fontWeight:700,cursor:confirmText==='HAPUS AKUN SAYA'?'pointer':'not-allowed' }}>
              {deleting ? 'Menghapus...' : '🗑️ Hapus Akun Permanen'}
            </button>
          </div>
        </div>
      )}

      <div style={{ textAlign:'center',marginTop:20,fontSize:11,color:'var(--tx3)',lineHeight:1.7 }}>
        Ingin menghubungi admin sebelum memutuskan?<br/>
        📧 <a href="mailto:halo@sulalah.my.id" style={{ color:'var(--t5)' }}>halo@sulalah.my.id</a>
        {' · '}
        💬 <a href="https://wa.me/6285175132050" style={{ color:'var(--t5)' }}>WA Admin</a>
      </div>
    </main>
  )
}
