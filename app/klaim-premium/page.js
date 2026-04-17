'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase'

export const dynamic = 'force-dynamic'

export default function KlaimPremium() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [txId, setTxId] = useState('')
  const [supporterName, setSupporterName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/auth'); return }
      setUser(session.user)
      supabase.from('profiles').select('*').eq('id', session.user.id).single()
        .then(({ data }) => { setProfile(data); setLoading(false) })
    })
  }, [router])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!txId.trim() && !supporterName.trim()) {
      setErr('Isi salah satu: ID Transaksi atau Nama Supporter')
      return
    }
    setSubmitting(true); setErr(''); setMsg('')

    const supabase = createClient()
    // Cari di trakteer_payments yang belum ter-aktivasi
    let query = supabase.from('trakteer_payments')
      .select('*')
      .in('status', ['received', 'unmatched', 'matched'])
      .gte('amount', 29000)

    if (txId.trim()) query = query.eq('transaction_id', txId.trim())
    if (supporterName.trim() && !txId.trim()) query = query.ilike('supporter_name', `%${supporterName.trim()}%`)

    const { data: payments, error } = await query.order('created_at', { ascending: false }).limit(5)

    if (error) {
      setErr('Gagal mencari transaksi. Coba lagi.'); setSubmitting(false); return
    }

    if (!payments || payments.length === 0) {
      setErr('Transaksi tidak ditemukan. Pastikan ID Transaksi benar atau hubungi admin di WhatsApp.')
      setSubmitting(false); return
    }

    // Ambil yang terbaru
    const payment = payments[0]

    // Aktifkan premium via API (biar pakai service role)
    const res = await fetch('/api/klaim-premium', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        userEmail: user.email,
        paymentId: payment.id,
      })
    })

    const result = await res.json()

    if (result.success) {
      setMsg('🎉 Premium berhasil diaktifkan! Mengalihkan ke dashboard...')
      setTimeout(() => router.push('/dashboard'), 2500)
    } else {
      setErr(result.error || 'Gagal mengaktifkan premium. Hubungi admin.')
    }
    setSubmitting(false)
  }

  if (loading) return <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)',color:'var(--tx2)' }}>Memuat...</div>

  if (profile?.is_premium) return (
    <main style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:24,background:'var(--bg)' }}>
      <div style={{ maxWidth:400,width:'100%',textAlign:'center' }}>
        <div style={{ fontSize:52,marginBottom:16 }}>✨</div>
        <h2 style={{ fontSize:22,fontWeight:800,color:'var(--t5)',marginBottom:8 }}>Anda sudah Premium!</h2>
        <p style={{ fontSize:14,color:'var(--tx2)',marginBottom:24 }}>Tidak perlu klaim lagi.</p>
        <button className="btn btn-primary btn-pill" onClick={()=>router.push('/dashboard')} style={{ fontSize:14,padding:'10px 28px' }}>Ke Dashboard →</button>
      </div>
    </main>
  )

  return (
    <main style={{ maxWidth:540,margin:'0 auto',padding:'0 16px 40px' }}>
      <div className="topbar" style={{ borderRadius:'0 0 14px 14px',marginBottom:24 }}>
        <div>
          <div className="topbar-title">🌳 Sulalah</div>
          <div className="topbar-sub">Klaim Premium Manual</div>
        </div>
        <button onClick={()=>router.push('/upgrade')} style={{ background:'rgba(255,255,255,.15)',color:'#fff',border:'1px solid rgba(255,255,255,.3)',padding:'6px 12px',borderRadius:20,fontSize:12,cursor:'pointer' }}>← Kembali</button>
      </div>

      <div style={{ textAlign:'center',marginBottom:20 }}>
        <div style={{ fontSize:40,marginBottom:8 }}>🎫</div>
        <h1 style={{ fontSize:22,fontWeight:800,color:'var(--tx)',marginBottom:6 }}>Klaim Premium</h1>
        <p style={{ fontSize:13,color:'var(--tx2)',lineHeight:1.6 }}>
          Sudah bayar di Trakteer tapi Premium belum aktif?<br/>
          Klaim manual di sini — isi salah satu info di bawah.
        </p>
      </div>

      <div className="card" style={{ marginBottom:16 }}>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>ID Transaksi <span style={{ color:'var(--tx3)',fontWeight:400 }}>(dari email Trakteer)</span></label>
            <input
              value={txId}
              onChange={e=>setTxId(e.target.value)}
              placeholder="mis. TRKTR-ABC123..."
              disabled={submitting}
            />
            <div style={{ fontSize:11,color:'var(--tx3)',marginTop:4 }}>
              Cek email dari Trakteer, biasanya ada kode transaksi di sana.
            </div>
          </div>

          <div style={{ textAlign:'center',fontSize:11,color:'var(--tx3)',margin:'8px 0' }}>— ATAU —</div>

          <div className="field">
            <label>Nama Supporter <span style={{ color:'var(--tx3)',fontWeight:400 }}>(yang Anda ketik saat bayar)</span></label>
            <input
              value={supporterName}
              onChange={e=>setSupporterName(e.target.value)}
              placeholder="mis. Ahmad Ghifar"
              disabled={submitting}
            />
          </div>

          {err && <p style={{ color:'var(--rose-t)',fontSize:13,marginBottom:10 }}>⚠ {err}</p>}
          {msg && <p style={{ color:'var(--t5)',fontSize:13,marginBottom:10 }}>✓ {msg}</p>}

          <button type="submit" className="btn btn-primary btn-pill" disabled={submitting} style={{ width:'100%',justifyContent:'center',fontSize:14,padding:'12px' }}>
            {submitting ? 'Mencari transaksi...' : '🎫 Klaim Premium Saya'}
          </button>
        </form>
      </div>

      <div style={{ background:'var(--amber-bg)',border:'1px solid var(--amber-b)',borderRadius:10,padding:'10px 14px',fontSize:12,color:'var(--amber-t)',lineHeight:1.6 }}>
        💡 <strong>Tips:</strong> Webhook Trakteer biasanya butuh 1-5 menit untuk sinkron. Kalau baru saja bayar, tunggu 5 menit dulu sebelum klaim manual.
      </div>

      <p style={{ fontSize:11,color:'var(--tx3)',textAlign:'center',marginTop:16,lineHeight:1.7 }}>
        Tetap tidak bisa? Hubungi admin via WhatsApp dengan lampirkan screenshot bukti bayar.
      </p>
    </main>
  )
}
