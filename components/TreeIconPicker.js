'use client'
import { useState, useRef } from 'react'
import { createClient } from '../lib/supabase'

// 10 ikon pilihan Islami-friendly
export const TREE_ICONS = [
  { emoji: '🌳', label: 'Pohon' },
  { emoji: '🌴', label: 'Kurma' },
  { emoji: '🌲', label: 'Cemara' },
  { emoji: '🏡', label: 'Rumah' },
  { emoji: '🕌', label: 'Masjid' },
  { emoji: '📖', label: 'Kitab' },
  { emoji: '⭐', label: 'Bintang' },
  { emoji: '☪️', label: 'Bulan Bintang' },
  { emoji: '🌙', label: 'Bulan' },
  { emoji: '🌿', label: 'Daun' },
]

function randomId(len = 24) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let s = ''
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return s
}

export default function TreeIconPicker({ treeId, currentIcon = '🌳', currentCoverUrl = null, onSave, onClose }) {
  const [mode, setMode] = useState(currentCoverUrl ? 'photo' : 'icon')
  const [selectedIcon, setSelectedIcon] = useState(currentIcon)
  const [photoUrl, setPhotoUrl] = useState(currentCoverUrl)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const fileRef = useRef(null)

  async function handleUpload(e) {
    const file = e.target.files[0]; if (!file) return
    if (file.size > 3*1024*1024) { setErr('Ukuran foto maksimal 3MB.'); return }
    setUploading(true); setErr('')
    const supabase = createClient()
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const tid = treeId || 'new'
    const filename = `trees/${tid}/cover-${randomId(24)}-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('photos').upload(filename, file, { upsert: false })
    if (error) { setErr('Gagal upload: ' + error.message); setUploading(false); return }
    const { data:{ publicUrl } } = supabase.storage.from('photos').getPublicUrl(filename)
    setPhotoUrl(publicUrl); setMode('photo'); setUploading(false)
  }

  async function handleSave() {
    setSaving(true)
    const data = mode === 'photo' && photoUrl
      ? { icon: null, cover_photo_url: photoUrl }
      : { icon: selectedIcon, cover_photo_url: null }
    await onSave(data)
    setSaving(false)
  }

  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:16 }}>
      <div style={{ background:'var(--card)',borderRadius:16,padding:22,maxWidth:440,width:'100%',boxShadow:'0 20px 50px rgba(0,0,0,.3)' }}>

        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4 }}>
          <h3 style={{ fontSize:16,fontWeight:800,color:'var(--tx)' }}>🎨 Atur Tampilan Pohon</h3>
          <button onClick={onClose} style={{ background:'none',border:'none',fontSize:18,cursor:'pointer',color:'var(--tx3)' }}>✕</button>
        </div>
        <p style={{ fontSize:12,color:'var(--tx2)',marginBottom:14 }}>Pilih ikon atau upload foto untuk membedakan pohon ini.</p>

        {/* Mode tabs */}
        <div style={{ display:'flex',gap:6,marginBottom:14,background:'var(--surf)',padding:4,borderRadius:10 }}>
          <button
            onClick={()=>setMode('icon')}
            style={{ flex:1,padding:'8px',borderRadius:8,border:'none',background:mode==='icon'?'var(--t5)':'transparent',color:mode==='icon'?'#fff':'var(--tx2)',fontSize:13,fontWeight:600,cursor:'pointer',transition:'all .15s' }}>
            🎨 Pilih Ikon
          </button>
          <button
            onClick={()=>setMode('photo')}
            style={{ flex:1,padding:'8px',borderRadius:8,border:'none',background:mode==='photo'?'var(--t5)':'transparent',color:mode==='photo'?'#fff':'var(--tx2)',fontSize:13,fontWeight:600,cursor:'pointer',transition:'all .15s' }}>
            📷 Foto Custom
          </button>
        </div>

        {/* Preview */}
        <div style={{ textAlign:'center',marginBottom:14,padding:'16px',background:'var(--surf)',border:'1px solid var(--bd)',borderRadius:12 }}>
          <div style={{ width:80,height:80,borderRadius:16,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'center',fontSize:40,background:'var(--t2)',border:'2px solid var(--t3)',overflow:'hidden',position:'relative' }}>
            {mode==='photo' && photoUrl ? (
              <img src={photoUrl} style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover' }} alt="Cover" />
            ) : (
              <span>{mode==='icon' ? selectedIcon : '🌳'}</span>
            )}
          </div>
          <div style={{ fontSize:11,color:'var(--tx3)',marginTop:8 }}>Preview</div>
        </div>

        {/* Icon picker */}
        {mode === 'icon' && (
          <div>
            <div style={{ fontSize:11,fontWeight:700,color:'var(--tx3)',letterSpacing:'.8px',textTransform:'uppercase',marginBottom:10 }}>Pilih Ikon</div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(5, 1fr)',gap:8,marginBottom:14 }}>
              {TREE_ICONS.map(ic => (
                <button
                  key={ic.emoji}
                  onClick={()=>setSelectedIcon(ic.emoji)}
                  title={ic.label}
                  style={{
                    padding:'10px 4px',
                    borderRadius:10,
                    border:`2px solid ${selectedIcon===ic.emoji?'var(--t4)':'var(--bd)'}`,
                    background: selectedIcon===ic.emoji?'var(--t2)':'var(--card)',
                    cursor:'pointer',
                    transition:'all .15s',
                    fontSize:24,
                    display:'flex',
                    flexDirection:'column',
                    alignItems:'center',
                    gap:3
                  }}>
                  <span>{ic.emoji}</span>
                  <span style={{ fontSize:9,color:'var(--tx3)' }}>{ic.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Photo upload */}
        {mode === 'photo' && (
          <div>
            <div style={{ fontSize:11,fontWeight:700,color:'var(--tx3)',letterSpacing:'.8px',textTransform:'uppercase',marginBottom:10 }}>Upload Foto</div>
            <div style={{ border:'2px dashed var(--bd2)',borderRadius:12,padding:'18px',textAlign:'center',marginBottom:10,background:'var(--surf)' }}>
              <div style={{ fontSize:24,marginBottom:8 }}>📷</div>
              <div style={{ fontSize:12,color:'var(--tx2)',marginBottom:10,lineHeight:1.6 }}>
                Pilih foto keluarga, rumah leluhur, atau foto lain yang berkesan.
                <br/>Ukuran maks: 3MB · Format: JPG, PNG
              </div>
              <button
                onClick={()=>fileRef.current?.click()}
                disabled={uploading}
                className="btn btn-primary"
                style={{ fontSize:12,padding:'7px 16px' }}>
                {uploading ? 'Mengupload...' : (photoUrl ? '🔄 Ganti Foto' : '📷 Pilih Foto')}
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display:'none' }} />
            </div>
          </div>
        )}

        {err && <div style={{ fontSize:12,color:'var(--rose-t)',marginBottom:10 }}>⚠ {err}</div>}

        <div style={{ display:'flex',gap:8,justifyContent:'flex-end' }}>
          <button className="btn btn-ghost" onClick={onClose} disabled={saving}>Batal</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving || (mode==='photo' && !photoUrl)} style={{ minWidth:100 }}>
            {saving ? 'Menyimpan...' : '💾 Simpan'}
          </button>
        </div>
      </div>
    </div>
  )
}
