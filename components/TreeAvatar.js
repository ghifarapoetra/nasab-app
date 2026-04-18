'use client'

// Reusable avatar komponen untuk tampilkan ikon atau foto pohon
// Dipakai di dashboard card, topbar, header poster
export default function TreeAvatar({ tree, size = 48, rounded = 'md', style = {} }) {
  const sizes = {
    md: { wh: size, br: 10, fs: size * 0.5 },
    lg: { wh: size, br: 14, fs: size * 0.5 },
  }
  const s = sizes[rounded] || sizes.md
  const photoUrl = tree?.cover_photo_url
  const icon = tree?.icon || '🌳'

  return (
    <div style={{
      width: s.wh,
      height: s.wh,
      borderRadius: s.br,
      background: photoUrl ? 'var(--surf)' : 'var(--t2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: s.fs,
      flexShrink: 0,
      overflow: 'hidden',
      position: 'relative',
      border: photoUrl ? '1px solid var(--bd)' : 'none',
      ...style
    }}>
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={tree?.name || 'Tree'}
          style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover' }}
          onError={e => { e.target.remove() }}
        />
      ) : (
        <span>{icon}</span>
      )}
    </div>
  )
}
