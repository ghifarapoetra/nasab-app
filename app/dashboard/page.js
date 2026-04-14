'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase'

const PLANS = {
  free: { maxTrees: 1, maxPersons: 30, label: 'Gratis' },
  pro:  { maxTrees: 5, maxPersons: 99999, label: 'Keluarga' },
}

export default function Dashboard() {
  const [trees, setTrees] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const router = useRouter()
  const plan = PLANS.free // nanti connect ke payment

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/auth'); return }
      setUser(session.user)
      loadTrees(session.user.id)
    })
  }, [router])

  async function loadTrees(uid) {
    const supabase = createClient()
    const { data: treesData } = await supabase
      .from('trees').select('*').eq('owner_id', uid).order('created_at')
    // Hitung anggota per pohon
    const { data: counts } = await supabase
      .from('persons').select('tree_id').eq('owner_id', uid)
    const countMap = {}
    counts?.forEach(p => { countMap[p.tree_id] = (countMap[p.tree_id] || 0) + 1 })
    setTrees((treesData || []).map(t => ({ ...t, memberCount: countMap[t.id] || 0 })))
    setLoading(false)
  }

  async function createTree() {
    if (!newName.trim()) { setErr('Nama pohon harus diisi.'); return }
    if (trees.length >= plan.maxTrees) { setErr(`Paket Gratis hanya bisa membuat ${plan.maxTrees} pohon keluarga.`); return }
    setSaving(true); setErr('')
    const supabase = createClient()
    const { data, error } = await supabase.from('trees')
      .insert({ name: newName.trim(), description: newDesc.trim(), owner_id: user.id })
      .select().single()
    if (error) { setErr('Gagal membuat pohon. Coba lagi.'); setSaving(false); return }
    setSaving(false); setShowNew(false); setNewName(''); setNewDesc('')
    router.push(`/tree/${data.id}`)
  }

  async function deleteTree(id) {
    if (!confirm('Hapus pohon keluarga ini beserta semua anggotanya? Tindakan ini tidak bisa dibatalkan.')) return
    const supabase = createClient()
    await supabase.from('trees').delete().eq('id', id)
    loadTrees(user.id)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut(); router.push('/')
  }

  if (loading) return (
    <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--tx2)' }}>
      Memuat dashboard...
    </div>
  )

  const canCreate = trees.length < plan.maxTrees

  return (
    <main style={{ maxWidth:700, margin:'0 auto', padding:'0 16px 40px' }}>
      {/* Topbar */}
      <div className="topbar" style={{ borderRadius:'0 0 14px 14px', marginBottom:24 }}>
        <div>
          <div className="topbar-title">🌳 Sulalah</div>
          <div className="topbar-sub">Pohon Silsilah Keluarga</div>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <span style={{ fontSize:11, background:'rgba(255,255,255,.2)', padding:'3px 10px', borderRadius:20, color:'#fff' }}>
            {plan.label}
          </span>
          <button onClick={handleLogout} style={{ background:'transparent',color:'rgba(255,255,255,.7)',border:'1px solid rgba(255,255,255,.2)',padding:'6px 12px',borderRadius:20,fontSize:12,cursor:'pointer' }}>
            Keluar
          </button>
        </div>
      </div>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <div>
          <h2 style={{ fontSize:18, fontWeight:700, color:'var(--tx)', letterSpacing:'-.3px' }}>Pohon Keluarga Saya</h2>
          <p style={{ fontSize:12, color:'var(--tx2)', marginTop:2 }}>{trees.length} dari {plan.maxTrees} pohon digunakan</p>
        </div>
        {canCreate && (
          <button className="btn btn-primary" onClick={() => setShowNew(true)} style={{ fontSize:13 }}>
            + Pohon Baru
          </button>
        )}
      </div>

      {/* Upgrade banner */}
      {!canCreate && (
        <div style={{ background:'var(--amber-bg)', border:'1px solid var(--amber-b)', borderRadius:12, padding:'12px 16px', marginBottom:16, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:'var(--amber-t)' }}>Batas pohon gratis tercapai</div>
            <div style={{ fontSize:12, color:'var(--tx2)', marginTop:2 }}>Upgrade ke Paket Keluarga untuk membuat hingga 5 pohon silsilah.</div>
          </div>
          <button className="btn btn-primary btn-pill" style={{ fontSize:12, whiteSpace:'nowrap', background:'var(--amber-t)', borderColor:'var(--amber-t)' }}>
            Upgrade Rp 29k/bln
          </button>
        </div>
      )}

      {/* Form buat pohon baru */}
      {showNew && (
        <div className="card" style={{ marginBottom:16 }}>
          <div style={{ fontSize:15, fontWeight:700, color:'var(--tx)', marginBottom:14 }}>🌱 Buat Pohon Keluarga Baru</div>
          <div className="field">
            <label>Nama Pohon Keluarga *</label>
            <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="mis. Keluarga Besar H. Mashudi, Silsilah Ayah, dll." autoFocus />
          </div>
          <div className="field">
            <label>Deskripsi <span style={{ color:'var(--tx3)', fontWeight:400 }}>(opsional)</span></label>
            <input value={newDesc} onChange={e=>setNewDesc(e.target.value)} placeholder="mis. Garis keturunan dari Salatiga" />
          </div>
          {err && <p style={{ color:'var(--rose-t)', fontSize:13, marginBottom:8 }}>⚠ {err}</p>}
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
            <button className="btn btn-ghost" onClick={()=>{ setShowNew(false); setErr('') }}>Batal</button>
            <button className="btn btn-primary" onClick={createTree} disabled={saving}>{saving?'Membuat...':'Buat Pohon'}</button>
          </div>
        </div>
      )}

      {/* Daftar pohon */}
      {trees.length === 0 && !showNew ? (
        <div style={{ textAlign:'center', padding:'60px 20px' }}>
          <div style={{ fontSize:52, marginBottom:16 }}>🌱</div>
          <h3 style={{ fontSize:18, fontWeight:700, color:'var(--tx)', marginBottom:8 }}>Belum ada pohon silsilah</h3>
          <p style={{ fontSize:14, color:'var(--tx2)', marginBottom:24 }}>Mulai dengan membuat pohon keluarga pertama Anda.</p>
          <button className="btn btn-primary btn-pill" onClick={()=>setShowNew(true)} style={{ fontSize:15, padding:'10px 32px' }}>
            + Buat Pohon Pertama
          </button>
        </div>
      ) : (
        <div style={{ display:'grid', gap:12 }}>
          {trees.map(tree => (
            <div key={tree.id} className="card" style={{ display:'flex', alignItems:'center', gap:14, cursor:'pointer', transition:'border-color .15s' }}
              onClick={() => router.push(`/tree/${tree.id}`)}>
              <div style={{ width:52, height:52, borderRadius:12, background:'var(--t2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>🌳</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:15, fontWeight:700, color:'var(--tx)', marginBottom:2 }}>{tree.name}</div>
                {tree.description && <div style={{ fontSize:12, color:'var(--tx2)', marginBottom:4 }}>{tree.description}</div>}
                <div style={{ fontSize:11, color:'var(--tx3)' }}>
                  {tree.memberCount} anggota · Dibuat {new Date(tree.created_at).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })}
                </div>
              </div>
              <div style={{ display:'flex', gap:6, flexShrink:0 }} onClick={e=>e.stopPropagation()}>
                <button className="btn btn-ghost" style={{ fontSize:12, padding:'5px 10px' }} onClick={()=>router.push(`/tree/${tree.id}`)}>Buka →</button>
                <button className="btn btn-danger" style={{ fontSize:12, padding:'5px 10px' }} onClick={()=>deleteTree(tree.id)}>Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paket info */}
      <div style={{ marginTop:32, background:'var(--surf)', border:'1px solid var(--bd)', borderRadius:12, padding:'14px 18px' }}>
        <div style={{ fontSize:11, fontWeight:700, color:'var(--tx3)', letterSpacing:'.8px', textTransform:'uppercase', marginBottom:10 }}>Paket Saat Ini: Gratis</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          {[
            ['🌳 Pohon keluarga', `${trees.length}/${plan.maxTrees}`],
            ['👥 Maks. anggota/pohon', '30 orang'],
            ['🎨 Tema PDF', 'Basic saja'],
            ['📊 Generasi', 'Maks. 4 generasi'],
          ].map(([l,v]) => (
            <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize:12, padding:'4px 0', borderBottom:'1px solid var(--bd)' }}>
              <span style={{ color:'var(--tx2)' }}>{l}</span>
              <span style={{ fontWeight:600, color:'var(--tx)' }}>{v}</span>
            </div>
          ))}
        </div>
        <button className="btn btn-primary btn-pill" style={{ marginTop:14, width:'100%', justifyContent:'center', fontSize:13 }}>
          ✨ Upgrade ke Paket Keluarga — Rp 29.000/bulan
        </button>
      </div>
    </main>
  )
}
