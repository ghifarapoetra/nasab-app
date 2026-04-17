'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase'

export const dynamic = 'force-dynamic'

const TRAKTEER_URL = 'https://trakteer.id/sulalah/tip'

const FF = [
  { t:'1 pohon keluarga', ok:true },{ t:'Anggota unlimited', ok:true },
  { t:'Deteksi mahram otomatis', ok:true },{ t:'Foto & kontak keluarga', ok:true },
  { t:'5 tema ekspor poster', ok:true },{ t:'Panel doa & amalan wafat', ok:true },
  { t:'5 pohon keluarga', ok:false },{ t:'Undang kolaborator', ok:false },
  { t:'Notifikasi milad Islami', ok:false },{ t:'10 tema poster premium', ok:false },
]
const FP = [
  { t:'5 pohon keluarga', ok:true },{ t:'Anggota unlimited', ok:true },
  { t:'Deteksi mahram otomatis', ok:true },{ t:'Foto & kontak keluarga', ok:true },
  { t:'Semua 10 tema poster', ok:true },{ t:'Panel doa & amalan wafat', ok:true },
  { t:'Undang kolaborator keluarga', ok:true },{ t:'Notifikasi milad Islami', ok:true },
  { t:'Akses semua fitur mendatang', ok:true },{ t:'Bayar sekali, seumur hidup', ok:true },
]

export default function UpgradePage() {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/auth'); return }
      setUser(session.user)
      supabase.from('profiles').select('*').eq('id', session.user.id).single()
        .then(({ data }) => { setProfile(data); setLoading(false) })
    })
  }, [mounted, router])

  async function copyEmail() {
    await navigator.clipboard.writeText(user.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function goToTrakteer() {
    window.open(TRAKTEER_URL, '_blank')
  }

  if (!mounted) return null
  if (loading) return <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)',color:'var(--tx2)' }}>Memuat...</div>

  if (profile?.is_premium) return (
    <main style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:24,background:'var(--bg)' }}>
      <div style={{ maxWidth:400,width:'100%',textAlign:'center' }}>
        <div style={{ fontSize:52,marginBottom:16 }}>✨</div>
        <h2 style={{ fontSize:22,fontWeight:800,color:'var(--t5)',marginBottom:8 }}>Anda sudah Premium!</h2>
        <p style={{ fontSize:14,color:'var(--tx2)',marginBottom:24 }}>Semua fitur premium sudah aktif. Jazakumullahu khayran!</p>
        <button className="btn btn-primary btn-pill" onClick={()=>router.push('/dashboard')} style={{ fontSize:14,padding:'10px 28px' }}>Ke Dashboard →</button>
      </div>
    </main>
  )

  return (
    <main style={{ maxWidth:680,margin:'0 auto',padding:'0 16px 40px' }}>
      <div className="topbar" style={{ borderRadius:'0 0 14px 14px',marginBottom:24 }}>
        <div>
          <div className="topbar-title">🌳 Sulalah</div>
          <div className="topbar-sub">Upgrade ke Premium</div>
        </div>
        <button onClick={()=>router.push('/dashboard')} style={{ background:'rgba(255,255,255,.15)',color:'#fff',border:'1px solid rgba(255,255,255,.3)',padding:'6px 12px',borderRadius:20,fontSize:12,cursor:'pointer' }}>← Kembali</button>
      </div>

      <div style={{ textAlign:'center',marginBottom:24 }}>
        <div style={{ fontSize:40,marginBottom:8 }}>✨</div>
        <h1 style={{ fontSize:26,fontWeight:800,color:'var(--tx)',letterSpacing:'-.5px',marginBottom:8 }}>Sulalah Premium</h1>
        <p style={{ fontSize:15,color:'var(--tx2)',lineHeight:1.7,marginBottom:12 }}>Bayar sekali, nikmati seumur hidup.<br/>Dukung pengembangan aplikasi silsilah Islami ini.</p>
        <div style={{ display:'inline-flex',alignItems:'baseline',gap:6 }}>
          <span style={{ fontSize:40,fontWeight:800,color:'var(--t5)' }}>Rp 29.000</span>
          <span style={{ fontSize:14,color:'var(--tx3)' }}>/ seumur hidup</span>
        </div>
      </div>

      {/* Fitur comparison */}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:24 }}>
        <div className="card">
          <div style={{ fontSize:13,fontWeight:700,color:'var(--tx3)',marginBottom:12 }}>Gratis</div>
          {FF.map((f,i) => (
            <div key={i} style={{ display:'flex',alignItems:'center',gap:6,padding:'5px 0',borderBottom:'1px solid var(--bd)',fontSize:12 }}>
              <span style={{ color:f.ok?'var(--t5)':'var(--tx3)',flexShrink:0 }}>{f.ok?'✓':'✗'}</span>
              <span style={{ color:f.ok?'var(--tx)':'var(--tx3)' }}>{f.t}</span>
            </div>
          ))}
        </div>
        <div className="card" style={{ border:'2px solid var(--t4)',position:'relative' }}>
          <div style={{ position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',background:'var(--t5)',color:'#fff',fontSize:10,fontWeight:700,padding:'3px 12px',borderRadius:20,whiteSpace:'nowrap' }}>DIREKOMENDASIKAN</div>
          <div style={{ fontSize:13,fontWeight:700,color:'var(--t5)',marginBottom:12 }}>Premium ✨</div>
          {FP.map((f,i) => (
            <div key={i} style={{ display:'flex',alignItems:'center',gap:6,padding:'5px 0',borderBottom:'1px solid var(--bd)',fontSize:12 }}>
              <span style={{ color:'var(--t5)',flexShrink:0 }}>✓</span>
              <span style={{ color:'var(--tx)',fontWeight:500 }}>{f.t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── INSTRUKSI PEMBAYARAN TRAKTEER ── */}
      <div style={{ background:'var(--surf)',border:'2px solid var(--t4)',borderRadius:14,padding:'18px 20px',marginBottom:20 }}>
        <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:12 }}>
          <span style={{ fontSize:24 }}>🌳</span>
          <div>
            <div style={{ fontSize:14,fontWeight:700,color:'var(--tx)' }}>Cara Upgrade Premium</div>
            <div style={{ fontSize:11,color:'var(--tx3)' }}>Pembayaran via Trakteer — QRIS, e-wallet, transfer bank</div>
          </div>
        </div>

        {/* Step 1 */}
        <div style={{ display:'flex',gap:10,marginBottom:12,paddingBottom:12,borderBottom:'1px solid var(--bd)' }}>
          <div style={{ width:26,height:26,borderRadius:'50%',background:'var(--t5)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0 }}>1</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13,fontWeight:600,color:'var(--tx)',marginBottom:4 }}>Salin email Anda</div>
            <div style={{ fontSize:11,color:'var(--tx2)',marginBottom:6 }}>Email ini harus ditulis di kolom pesan saat bayar, agar Premium aktif otomatis.</div>
            <div style={{ display:'flex',gap:6,alignItems:'center' }}>
              <code style={{ flex:1,background:'var(--card)',border:'1px solid var(--bd)',borderRadius:6,padding:'6px 10px',fontSize:12,color:'var(--t5)',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{user?.email}</code>
              <button onClick={copyEmail} style={{ background:'var(--t5)',color:'#fff',border:'none',borderRadius:6,padding:'6px 12px',fontSize:11,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap' }}>
                {copied ? '✓ Tersalin!' : '📋 Salin'}
              </button>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div style={{ display:'flex',gap:10,marginBottom:12,paddingBottom:12,borderBottom:'1px solid var(--bd)' }}>
          <div style={{ width:26,height:26,borderRadius:'50%',background:'var(--t5)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0 }}>2</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13,fontWeight:600,color:'var(--tx)',marginBottom:4 }}>Buka halaman pembayaran</div>
            <div style={{ fontSize:11,color:'var(--tx2)',marginBottom:8 }}>Pilih <strong>1 Pohon</strong> (Rp 29.000), lalu <strong>tempel email Anda di kolom "Pesan dari Supporter"</strong>. Bayar lewat QRIS, GoPay, OVO, Dana, atau transfer.</div>
            <button onClick={goToTrakteer} style={{ background:'var(--t5)',color:'#fff',border:'none',borderRadius:24,padding:'10px 20px',fontSize:13,fontWeight:700,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:6 }}>
              🌳 Ke Trakteer — Bayar Sekarang →
            </button>
          </div>
        </div>

        {/* Step 3 */}
        <div style={{ display:'flex',gap:10 }}>
          <div style={{ width:26,height:26,borderRadius:'50%',background:'var(--t5)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0 }}>3</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13,fontWeight:600,color:'var(--tx)',marginBottom:4 }}>Premium aktif otomatis</div>
            <div style={{ fontSize:11,color:'var(--tx2)' }}>Setelah pembayaran berhasil, Premium Anda aktif dalam 1-5 menit. Refresh halaman dashboard untuk melihat perubahan.</div>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div style={{ background:'var(--amber-bg)',border:'1px solid var(--amber-b)',borderRadius:10,padding:'10px 14px',marginBottom:16,fontSize:12,color:'var(--amber-t)',lineHeight:1.6 }}>
        ⚠️ <strong>Penting:</strong> Pastikan email Anda ({user?.email}) tertulis jelas di kolom pesan saat bayar. Kalau lupa, tidak perlu khawatir — Anda bisa klaim manual di halaman <a href="/klaim-premium" style={{ color:'var(--amber-t)',textDecoration:'underline',fontWeight:700 }}>Klaim Premium</a>.
      </div>

      {/* Dalil */}
      <div style={{ background:'var(--surf)',border:'1px solid var(--bd)',borderLeft:'4px solid var(--t4)',borderRadius:12,padding:'14px 18px',marginBottom:16 }}>
        <p style={{ fontSize:16,textAlign:'right',direction:'rtl',lineHeight:2,color:'var(--tx)',fontFamily:'serif',marginBottom:8 }}>مَنْ يَشْفَعْ شَفَاعَةً حَسَنَةً يَكُنْ لَهُ نَصِيبٌ مِنْهَا</p>
        <p style={{ fontSize:12,color:'var(--tx2)',fontStyle:'italic',marginBottom:4 }}>"Barang siapa yang memberikan syafaat yang baik, maka ia akan mendapatkan bagian dari kebaikan tersebut." — QS. An-Nisa: 85</p>
        <p style={{ fontSize:12,color:'var(--tx3)',marginTop:8,lineHeight:1.6 }}>Dengan upgrade Premium, Anda turut mendukung pengembangan aplikasi yang membantu keluarga Muslim menjaga nasab dan silaturahim. Semoga menjadi amal jariyah.</p>
      </div>

      <p style={{ fontSize:11,color:'var(--tx3)',textAlign:'center',lineHeight:1.7 }}>
        Pembayaran diproses oleh <strong>Trakteer.id</strong> — platform apresiasi kreator Indonesia.<br/>
        Premium aktif otomatis setelah pembayaran dikonfirmasi.
      </p>
    </main>
  )
}
