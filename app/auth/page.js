'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    if (mode === 'signup' && !agreed) {
      setErr('Anda harus menyetujui Syarat & Kebijakan Privasi untuk mendaftar.')
      return
    }
    setLoading(true); setErr(''); setMsg('')
    const supabase = createClient()

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setErr('Email atau password salah. Coba lagi.')
      else router.push('/dashboard')
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } }
      })
      if (error) setErr(error.message)
      else setMsg('Berhasil daftar! Cek email Anda untuk konfirmasi, lalu login.')
    }
    setLoading(false)
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <a href="/" style={{ fontSize: 28, textDecoration: 'none' }}>🌳</a>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--tx)', marginTop: 8, letterSpacing: '-.4px' }}>
            {mode === 'login' ? 'Masuk ke Sulalah' : 'Daftar ke Sulalah'}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--tx2)', marginTop: 4 }}>
            {mode === 'login' ? 'Lanjutkan silsilah keluarga Anda di Sulalah' : 'Buat akun untuk mulai membangun pohon silsilah'}
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="field">
                <label>Nama Lengkap</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="mis. Ahmad Ghifarapoetra" required />
              </div>
            )}
            <div className="field">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" required />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimal 6 karakter" required minLength={6} />
            </div>

            {mode === 'signup' && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', fontSize: 12, lineHeight: 1.6, color: 'var(--tx2)' }}>
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                    style={{ width: 'auto', marginTop: 2, flexShrink: 0 }}
                  />
                  <span>
                    Saya menyetujui{' '}
                    <a href="/terms" target="_blank" style={{ color: 'var(--t5)', textDecoration: 'underline' }}>Syarat & Ketentuan</a>
                    {' '}dan{' '}
                    <a href="/privacy" target="_blank" style={{ color: 'var(--t5)', textDecoration: 'underline' }}>Kebijakan Privasi</a>
                    {' '}Sulalah.
                  </span>
                </label>
              </div>
            )}

            {err && <p style={{ color: 'var(--rose-t)', fontSize: 13, marginBottom: 10 }}>⚠ {err}</p>}
            {msg && <p style={{ color: 'var(--t5)', fontSize: 13, marginBottom: 10 }}>✓ {msg}</p>}

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
              {loading ? 'Mohon tunggu...' : mode === 'login' ? 'Masuk' : 'Daftar Sekarang'}
            </button>
          </form>

          <div style={{ borderTop: '1px solid var(--bd)', marginTop: 16, paddingTop: 14, textAlign: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--tx2)' }}>
              {mode === 'login' ? 'Belum punya akun? ' : 'Sudah punya akun? '}
            </span>
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErr(''); setMsg(''); setAgreed(false) }}
              style={{ background: 'none', border: 'none', color: 'var(--t5)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              {mode === 'login' ? 'Daftar' : 'Masuk'}
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: 'var(--tx3)' }}>
          <a href="/privacy" style={{ color: 'var(--tx3)', textDecoration: 'none', marginRight: 10 }}>Kebijakan Privasi</a>
          ·
          <a href="/terms" style={{ color: 'var(--tx3)', textDecoration: 'none', margin: '0 10px' }}>Syarat & Ketentuan</a>
        </div>
      </div>
    </main>
  )
}
