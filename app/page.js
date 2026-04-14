'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../lib/supabase'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/tree')
    })
  }, [router])

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--t2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 20px' }}>🌳</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--tx)', letterSpacing: '-.5px', marginBottom: 10 }}>Nasab</h1>
        <p style={{ fontSize: 15, color: 'var(--tx2)', lineHeight: 1.7, marginBottom: 32 }}>
          Pohon silsilah keluarga dengan deteksi mahram otomatis. Simpan kontak, foto, dan riwayat tiap anggota agar silaturahim tetap terjaga.
        </p>
        <a href="/auth" className="btn btn-primary btn-pill" style={{ fontSize: 15, padding: '12px 36px', textDecoration: 'none' }}>
          Mulai Sekarang →
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, maxWidth: 480, width: '100%', marginTop: 40 }}>
        {[
          { icon: '🌳', title: 'Pohon Silsilah', desc: 'Visualisasi lintas generasi' },
          { icon: '✦', title: 'Deteksi Mahram', desc: 'Otomatis, 7 golongan nasab' },
          { icon: '📇', title: 'Kontak Keluarga', desc: 'HP, email, foto tersimpan' },
        ].map(f => (
          <div key={f.title} className="card" style={{ borderTop: '3px solid var(--t4)', textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', marginBottom: 4 }}>{f.title}</div>
            <div style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.5 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </main>
  )
}
