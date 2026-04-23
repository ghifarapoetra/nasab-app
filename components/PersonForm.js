'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '../lib/supabase'

const EMPTY = { name:'', gender:'male', photo_url:'', birth_year:'', birth_month:'', birth_day:'', death_year:'', phone:'', email:'', address:'', father_id:'', mother_id:'', spouse_id:'', notes:'', wafat_notes:'', notify_milad:false, is_self:false, birth_order:'' }
const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']

function randomId(len = 32) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let s = ''
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return s
}

// Sort by name ascending (case-insensitive, locale aware)
function sortByName(arr) {
  return [...arr].sort((a, b) => (a.name || '').localeCompare(b.name || '', 'id', { sensitivity: 'base' }))
}

export default function PersonForm({ person, persons, onSave, onDelete, onCancel, isFirst, treeId, radhaRelations = [] }) {
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState('')
  const [photoPreview, setPhotoPreview] = useState(null)
  const [existingSpouse, setExistingSpouse] = useState(null)
  const [existingRadha, setExistingRadha] = useState([]) // saudara sepersusuan yang sudah ada
  const [newRadhaSiblingId, setNewRadhaSiblingId] = useState('')
  const [newRadhaMilkMother, setNewRadhaMilkMother] = useState('')
  const [addingRadha, setAddingRadha] = useState(false)
  const fileRef = useRef(null)

  useEffect(()=>{
    if (person) {
      setForm({
        ...EMPTY, ...person,
        birth_year: person.birth_year||'',
        birth_month: person.birth_month||'',
        birth_day: person.birth_day||'',
        death_year: person.death_year||'',
        father_id: person.father_id||'',
        mother_id: person.mother_id||'',
        birth_order: person.birth_order||'',
        address: person.address||'',
        spouse_id: '',
      })
      setPhotoPreview(person.photo_url||null)
      // Load existing spouse
      loadSpouse(person.id)
    } else {
      setForm(EMPTY)
      setPhotoPreview(null)
      setExistingSpouse(null)
      setExistingRadha([])
    }
  }, [person])

  // Sync existingRadha dari props radhaRelations
  useEffect(() => {
    if (!person?.id) return
    const related = radhaRelations
      .filter(r => r.person1_id === person.id || r.person2_id === person.id)
      .map(r => ({ relationId: r.id, siblingId: r.person1_id === person.id ? r.person2_id : r.person1_id, milkMother: r.milk_mother || '' }))
    setExistingRadha(related)
  }, [person, radhaRelations])

  async function loadSpouse(personId) {
    if (!personId) return
    const supabase = createClient()
    const { data } = await supabase
      .from('marriages')
      .select('id, person1_id, person2_id, status')
      .or(`person1_id.eq.${personId},person2_id.eq.${personId}`)
      .eq('status', 'active')
      .maybeSingle()
    if (data) {
      const spouseId = data.person1_id === personId ? data.person2_id : data.person1_id
      const sp = persons.find(p => p.id === spouseId)
      if (sp) setExistingSpouse(sp)
    } else {
      setExistingSpouse(null)
    }
  }

  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  async function handlePhotoUpload(e) {
    const file = e.target.files[0]; if (!file) return
    if (file.size > 3*1024*1024) { setErr('Ukuran foto maksimal 3MB.'); return }
    setUploading(true); setErr('')
    const supabase = createClient()
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const tid = treeId || 'untreed'
    const filename = `${tid}/${randomId(32)}-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('photos').upload(filename, file, { upsert: false })
    if (error) { setErr('Gagal upload foto: ' + error.message); setUploading(false); return }
    const { data:{ publicUrl } } = supabase.storage.from('photos').getPublicUrl(filename)
    set('photo_url', publicUrl); setPhotoPreview(publicUrl); setUploading(false)
    try {
      const { data:{ session } } = await supabase.auth.getSession()
      if (session?.user && tid !== 'untreed') {
        supabase.from('photo_audit').insert({
          action: 'upload',
          user_id: session.user.id,
          tree_id: tid,
          photo_path: filename,
          user_agent: navigator.userAgent.substring(0, 200),
        })
      }
    } catch(_){}
  }

  async function handleSave() {
    if (!form.name.trim()) { setErr('Nama harus diisi.'); return }
    setErr(''); setLoading(true)
    const { spouse_id, ...rest } = form
    await onSave({
      ...rest,
      birth_year: form.birth_year ? parseInt(form.birth_year) : null,
      birth_month: form.birth_month ? parseInt(form.birth_month) : null,
      birth_day: form.birth_day ? parseInt(form.birth_day) : null,
      death_year: form.death_year ? parseInt(form.death_year) : null,
      birth_order: form.birth_order ? parseInt(form.birth_order) : null,
      father_id: form.father_id || null,
      mother_id: form.mother_id || null,
      address: form.address?.trim() || null,
      is_self: isFirst ? true : form.is_self,
      _spouse_id: spouse_id || null,  // Pass to handler for marriage save
    })
    setLoading(false)
  }

  async function unlinkSpouse() {
    if (!person?.id || !existingSpouse) return
    if (!confirm(`Lepas hubungan pernikahan dengan ${existingSpouse.name}?`)) return
    const supabase = createClient()
    await supabase.from('marriages').delete()
      .or(`and(person1_id.eq.${person.id},person2_id.eq.${existingSpouse.id}),and(person1_id.eq.${existingSpouse.id},person2_id.eq.${person.id})`)
    setExistingSpouse(null)
  }

  async function unlinkRadha(relationId, siblingName) {
    if (!confirm(`Hapus hubungan sepersusuan dengan ${siblingName}?`)) return
    const supabase = createClient()
    await supabase.from('radha_relations').delete().eq('id', relationId)
    setExistingRadha(prev => prev.filter(r => r.relationId !== relationId))
  }

  const ini = n => n.trim().split(/\s+/).slice(0,2).map(w=>w[0]||'').join('').toUpperCase()||'?'

  // Sorted dropdowns - alphabetically
  const fathers = sortByName(persons.filter(p => p.gender === 'male' && p.id !== person?.id))
  const mothers = sortByName(persons.filter(p => p.gender === 'female' && p.id !== person?.id))
  // Spouse: opposite gender, excluding self & existing spouse
  const spouseGender = form.gender === 'male' ? 'female' : 'male'
  const spouseCandidates = sortByName(persons.filter(p =>
    p.gender === spouseGender &&
    p.id !== person?.id &&
    p.id !== existingSpouse?.id
  ))
  const existingRadhaIds = new Set(existingRadha.map(r => r.siblingId))
  const radhaCandidates = sortByName(persons.filter(p => p.id !== person?.id && !existingRadhaIds.has(p.id)))

  async function handleAddRadha() {
    if (!newRadhaSiblingId || !person?.id) return
    setAddingRadha(true)
    const supabase = createClient()
    const [p1, p2] = [person.id, newRadhaSiblingId].sort()
    const { data: existing } = await supabase.from('radha_relations').select('id').eq('person1_id', p1).eq('person2_id', p2).maybeSingle()
    if (!existing) {
      const { data: inserted } = await supabase.from('radha_relations').insert({
        tree_id: treeId,
        person1_id: p1,
        person2_id: p2,
        milk_mother: newRadhaMilkMother.trim() || null,
      }).select('id').single()
      if (inserted) {
        const sibling = persons.find(p => p.id === newRadhaSiblingId)
        setExistingRadha(prev => [...prev, { relationId: inserted.id, siblingId: newRadhaSiblingId, milkMother: newRadhaMilkMother.trim() }])
      }
    }
    setNewRadhaSiblingId(''); setNewRadhaMilkMother(''); setAddingRadha(false)
  }

  const isDeceased = !!form.death_year

  return (
    <div>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18 }}>
        <h2 style={{ fontSize:17,fontWeight:700,color:'var(--tx)',letterSpacing:'-.3px' }}>
          {isFirst?'Siapa Anda dalam keluarga ini?':person?'Edit Profil':'Tambah Anggota'}
        </h2>
        {!isFirst && <button className="btn btn-ghost" onClick={onCancel} style={{ fontSize:12 }}>← Kembali</button>}
      </div>

      {/* Photo */}
      <div style={{ display:'flex',gap:14,alignItems:'center',marginBottom:16 }}>
        <div style={{ width:64,height:64,borderRadius:'50%',background:'var(--surf)',border:'1px solid var(--bd)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,fontWeight:700,color:'var(--tx2)',position:'relative',overflow:'hidden',flexShrink:0 }}>
          {photoPreview?<img src={photoPreview} style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover' }} onError={()=>setPhotoPreview(null)} />:(form.name?ini(form.name):'?')}
        </div>
        <div>
          <div style={{ fontSize:12,color:'var(--tx2)',marginBottom:3 }}>Foto profil</div>
          <div style={{ fontSize:10,color:'var(--tx3)',marginBottom:5,lineHeight:1.4 }}>🔒 Hanya member pohon yang bisa lihat</div>
          <button type="button" className="btn btn-ghost" style={{ fontSize:12,padding:'5px 12px' }} onClick={()=>fileRef.current?.click()} disabled={uploading}>
            {uploading?'Mengupload...':'📷 Upload Foto'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display:'none' }} />
        </div>
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 12px' }}>
        <div className="field" style={{ gridColumn:'1/-1' }}>
          <label>Nama Lengkap *</label>
          <input value={form.name} onChange={e=>set('name',e.target.value)} placeholder="mis. Ahmad bin Hasan Al-Jawi" />
        </div>
        <div className="field">
          <label>Jenis Kelamin</label>
          <select value={form.gender} onChange={e=>set('gender',e.target.value)}>
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
          </select>
        </div>
        <div className="field">
          <label>Tahun Lahir</label>
          <input type="number" value={form.birth_year} onChange={e=>set('birth_year',e.target.value)} placeholder="1975" min="1800" max="2035" />
        </div>
        <div className="field">
          <label>Bulan Lahir <span style={{ color:'var(--tx3)',fontWeight:400 }}>(untuk notifikasi milad)</span></label>
          <select value={form.birth_month} onChange={e=>set('birth_month',e.target.value)}>
            <option value="">— tidak diketahui</option>
            {MONTHS.map((m,i)=><option key={i} value={i+1}>{m}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Tanggal Lahir</label>
          <input type="number" value={form.birth_day} onChange={e=>set('birth_day',e.target.value)} placeholder="1–31" min="1" max="31" />
        </div>
        <div className="field">
          <label>Urutan Kelahiran <span style={{ color:'var(--tx3)',fontWeight:400 }}>(anak ke-)</span></label>
          <input type="number" value={form.birth_order} onChange={e=>set('birth_order',e.target.value)} placeholder="mis. 1 untuk sulung" min="1" max="30" />
        </div>
        <div className="field">
          <label>Tahun Wafat <span style={{ color:'var(--tx3)',fontWeight:400 }}>(kosong = masih hidup)</span></label>
          <input type="number" value={form.death_year} onChange={e=>set('death_year',e.target.value)} placeholder="2020" min="1800" max="2035" />
        </div>
        <div className="field">
          <label>No. HP / WhatsApp</label>
          <input value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+62 812 xxxx xxxx" />
        </div>
        <div className="field" style={{ gridColumn:'1/-1' }}>
          <label>Email</label>
          <input type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="nama@email.com" />
        </div>
        <div className="field" style={{ gridColumn:'1/-1' }}>
          <label>📍 Alamat</label>
          <textarea value={form.address} onChange={e=>set('address',e.target.value)} placeholder="mis. Jl. Pesantren No. 12, RT 03/02, Tengaran, Kab. Semarang, Jawa Tengah" style={{ minHeight:60 }} />
        </div>

        {!isFirst && <>
          <div className="field">
            <label>Ayah <span style={{ color:'var(--tx3)',fontWeight:400 }}>({fathers.length})</span></label>
            <select value={form.father_id} onChange={e=>set('father_id',e.target.value)}>
              <option value="">— tidak ada / tidak diketahui</option>
              {fathers.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Ibu <span style={{ color:'var(--tx3)',fontWeight:400 }}>({mothers.length})</span></label>
            <select value={form.mother_id} onChange={e=>set('mother_id',e.target.value)}>
              <option value="">— tidak ada / tidak diketahui</option>
              {mothers.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          {/* Spouse selector */}
          <div className="field" style={{ gridColumn:'1/-1' }}>
            <label>💍 Pasangan ({form.gender === 'male' ? 'Istri' : 'Suami'})</label>
            {existingSpouse ? (
              <div style={{ display:'flex',alignItems:'center',gap:8,padding:'8px 12px',background:'var(--t2)',border:'1px solid var(--t3)',borderRadius:8 }}>
                <span style={{ flex:1,fontSize:13,color:'var(--tx)' }}>
                  💖 <strong>{existingSpouse.name}</strong>
                  {existingSpouse.birth_year && <span style={{ color:'var(--tx3)',marginLeft:8,fontSize:11 }}>(lahir {existingSpouse.birth_year})</span>}
                </span>
                <button type="button" onClick={unlinkSpouse} style={{ background:'transparent',border:'1px solid var(--rose-b)',color:'var(--rose-t)',fontSize:11,padding:'4px 10px',borderRadius:6,cursor:'pointer' }}>
                  Lepas
                </button>
              </div>
            ) : (
              <>
                <select value={form.spouse_id} onChange={e=>set('spouse_id',e.target.value)}>
                  <option value="">— pilih pasangan untuk menghubungkan</option>
                  {spouseCandidates.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <div style={{ fontSize:10,color:'var(--tx3)',marginTop:4,lineHeight:1.5 }}>
                  💡 Pilih pasangan agar otomatis ditampilkan sejajar di pohon. Bisa diisi/diubah nanti.
                </div>
              </>
            )}
          </div>
        </>}

        {/* Radha'ah — Saudara Sepersusuan */}
          {!isFirst && (
            <div className="field" style={{ gridColumn:'1/-1' }}>
              <label>🤱 Saudara Sepersusuan <span style={{ color:'var(--tx3)',fontWeight:400 }}>(radha'ah)</span></label>
              {existingRadha.length > 0 && (
                <div style={{ display:'flex',flexDirection:'column',gap:6,marginBottom:8 }}>
                  {existingRadha.map(r => {
                    const sib = persons.find(p => p.id === r.siblingId)
                    return (
                      <div key={r.relationId} style={{ display:'flex',alignItems:'center',gap:8,padding:'7px 12px',background:'var(--blue-bg)',border:'1px solid var(--blue-b)',borderRadius:8 }}>
                        <span style={{ flex:1,fontSize:13,color:'var(--tx)' }}>
                          💙 <strong>{sib?.name || '—'}</strong>
                          {r.milkMother && <span style={{ color:'var(--tx3)',marginLeft:8,fontSize:11 }}>ibu susu: {r.milkMother}</span>}
                        </span>
                        <button type="button" onClick={()=>unlinkRadha(r.relationId, sib?.name||'?')} style={{ background:'transparent',border:'1px solid var(--rose-b)',color:'var(--rose-t)',fontSize:11,padding:'4px 10px',borderRadius:6,cursor:'pointer' }}>Hapus</button>
                      </div>
                    )
                  })}
                </div>
              )}
              <div style={{ display:'flex',gap:6,flexWrap:'wrap',alignItems:'flex-end' }}>
                <div style={{ flex:2,minWidth:140 }}>
                  <select value={newRadhaSiblingId} onChange={e=>setNewRadhaSiblingId(e.target.value)} style={{ width:'100%' }}>
                    <option value="">— pilih saudara sepersusuan</option>
                    {radhaCandidates.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div style={{ flex:1,minWidth:110 }}>
                  <input value={newRadhaMilkMother} onChange={e=>setNewRadhaMilkMother(e.target.value)} placeholder="Nama ibu susu (opt.)" style={{ width:'100%' }} />
                </div>
                <button type="button" onClick={handleAddRadha} disabled={!newRadhaSiblingId||addingRadha} className="btn btn-ghost" style={{ fontSize:12,padding:'7px 14px',whiteSpace:'nowrap' }}>
                  {addingRadha?'Menambah...':'+ Tambah'}
                </button>
              </div>
              <div style={{ fontSize:10,color:'var(--tx3)',marginTop:4,lineHeight:1.5 }}>💡 Hubungan sepersusuan otomatis jadi mahram (biru) di pohon. Bisa ditambah lebih dari satu.</div>
            </div>
          )}

        <div className="field" style={{ gridColumn:'1/-1' }}>
          <label>Catatan / Riwayat</label>
          <textarea value={form.notes} onChange={e=>set('notes',e.target.value)} placeholder="mis. Pengasuh Pesantren Al-Falah, lahir di Salatiga..." />
        </div>

        {isDeceased && (
          <div className="field" style={{ gridColumn:'1/-1' }}>
            <label>☪ Catatan untuk Almarhum/ah <span style={{ color:'var(--tx3)',fontWeight:400 }}>(tampil di panel peringatan)</span></label>
            <textarea value={form.wafat_notes} onChange={e=>set('wafat_notes',e.target.value)} placeholder="mis. Beliau adalah sosok yang penuh kasih..." style={{ minHeight:80 }} />
          </div>
        )}

        {!isDeceased && form.birth_month && (
          <div className="field" style={{ gridColumn:'1/-1' }}>
            <label style={{ display:'flex',alignItems:'center',gap:8,cursor:'pointer' }}>
              <input type="checkbox" checked={form.notify_milad} onChange={e=>set('notify_milad',e.target.checked)} style={{ width:'auto' }} />
              <span>🌙 Ingatkan saya saat milad {form.name||'anggota ini'}</span>
            </label>
            <div style={{ fontSize:11,color:'var(--tx3)',marginTop:4 }}>Notifikasi berisi pengingat spiritual Islami, bukan sekadar ucapan ulang tahun</div>
          </div>
        )}
      </div>

      {err && <p style={{ color:'var(--rose-t)',fontSize:13,marginBottom:8 }}>⚠ {err}</p>}
      <div style={{ display:'flex',gap:8,justifyContent:'flex-end',alignItems:'center',marginTop:4 }}>
        {person && <button className="btn btn-danger" onClick={onDelete} style={{ marginRight:'auto',fontSize:12 }}>Hapus</button>}
        {!isFirst && <button className="btn btn-ghost" onClick={onCancel} style={{ fontSize:13 }}>Batal</button>}
        <button className="btn btn-primary" onClick={handleSave} disabled={loading||uploading}>{loading?'Menyimpan...':'💾 Simpan'}</button>
      </div>
    </div>
  )
}
