'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase'
import FamilyTree from '../../components/FamilyTree'
import PersonForm from '../../components/PersonForm'
import DetailPanel from '../../components/DetailPanel'

export default function TreePage() {
  const [persons, setPersons] = useState([])
  const [selected, setSelected] = useState(null)
  const [view, setView] = useState('tree') // 'tree' | 'form'
  const [editPerson, setEditPerson] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/auth'); return }
      setUser(session.user)
      loadPersons(session.user.id)
    })
  }, [router])

  async function loadPersons(uid) {
    const supabase = createClient()
    const { data } = await supabase.from('persons').select('*').eq('owner_id', uid).order('created_at')
    setPersons(data || [])
    setLoading(false)
  }

  async function handleSave(formData) {
    const supabase = createClient()
    if (editPerson) {
      await supabase.from('persons').update(formData).eq('id', editPerson.id)
    } else {
      await supabase.from('persons').insert({ ...formData, owner_id: user.id })
    }
    await loadPersons(user.id)
    setView('tree'); setEditPerson(null)
  }

  async function handleDelete() {
    if (!editPerson) return
    const supabase = createClient()
    await supabase.from('persons').delete().eq('id', editPerson.id)
    if (selected === editPerson.id) setSelected(null)
    await loadPersons(user.id)
    setView('tree'); setEditPerson(null)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const selectedPerson = persons.find(p => p.id === selected)
  const selfPerson = persons.find(p => p.is_self)
  const isFirst = persons.length === 0

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tx2)' }}>
      Memuat silsilah...
    </div>
  )

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px 32px' }}>
      {/* Topbar */}
      <div className="topbar" style={{ borderRadius: '0 0 14px 14px', marginBottom: 16 }}>
        <div>
          <div className="topbar-title">🌳 Nasab</div>
          <div className="topbar-sub">
            {selfPerson ? `Silsilah keluarga ${selfPerson.name} · ${persons.length} anggota` : `${persons.length} anggota keluarga`}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {view === 'tree' && (
            <button onClick={() => { setEditPerson(null); setView('form') }}
              style={{ background: 'rgba(255,255,255,.15)', color: '#fff', border: '1px solid rgba(255,255,255,.3)', padding: '6px 16px', borderRadius: 20, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
              + Tambah Anggota
            </button>
          )}
          <button onClick={handleLogout} style={{ background: 'transparent', color: 'rgba(255,255,255,.7)', border: '1px solid rgba(255,255,255,.2)', padding: '6px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer' }}>
            Keluar
          </button>
        </div>
      </div>

      {/* Onboard state */}
      {isFirst && view === 'tree' && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌳</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--tx)', marginBottom: 8 }}>Pohon nasab Anda masih kosong</h2>
          <p style={{ fontSize: 14, color: 'var(--tx2)', marginBottom: 24 }}>Mulai dengan menambahkan diri Anda sendiri sebagai titik awal silsilah.</p>
          <button className="btn btn-primary btn-pill" onClick={() => { setEditPerson(null); setView('form') }} style={{ fontSize: 15, padding: '10px 32px' }}>
            Mulai Tambah Anggota →
          </button>
        </div>
      )}

      {/* Tree view */}
      {view === 'tree' && persons.length > 0 && (
        <>
          <FamilyTree persons={persons} selected={selected} onSelect={setSelected} />
          {selectedPerson && (
            <DetailPanel
              person={selectedPerson}
              persons={persons}
              onEdit={p => { setEditPerson(p); setView('form') }}
              onClose={() => setSelected(null)}
            />
          )}
        </>
      )}

      {/* Form view */}
      {view === 'form' && (
        <div className="card">
          <PersonForm
            person={editPerson}
            persons={persons}
            isFirst={isFirst}
            onSave={handleSave}
            onDelete={handleDelete}
            onCancel={() => { setView('tree'); setEditPerson(null) }}
          />
        </div>
      )}
    </main>
  )
}
