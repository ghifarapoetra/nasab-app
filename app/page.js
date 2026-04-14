'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../lib/supabase'

const DALIL = [
  {
    arabic: 'يَٰٓأَيُّهَا ٱلنَّاسُ إِنَّا خَلَقْنَٰكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَٰكُمْ شُعُوبًا وَقَبَآئِلَ لِتَعَارَفُوٓا۟',
    terjemah: '"Wahai manusia! Kami telah menciptakan kamu dari seorang laki-laki dan perempuan, kemudian Kami jadikan kamu berbangsa-bangsa dan bersuku-suku agar kamu saling mengenal."',
    sumber: 'QS. Al-Hujurat: 13',
    type: 'quran'
  },
  {
    arabic: 'تَعَلَّمُوا مِنْ أَنْسَابِكُمْ مَا تَصِلُونَ بِهِ أَرْحَامَكُمْ',
    terjemah: '"Pelajarilah nasab-nasab kalian yang dengannya kalian dapat menyambung tali silaturahmi."',
    sumber: 'HR. Tirmidzi — dari Abu Hurairah',
    type: 'hadith'
  },
  {
    arabic: 'صِلَةُ الرَّحِمِ تَزِيدُ فِي الْعُمُرِ وَتَدْفَعُ مِيتَةَ السُّوءِ',
    terjemah: '"Menyambung silaturahmi menambah umur dan menolak kematian yang buruk."',
    sumber: 'HR. Thabrani',
    type: 'hadith'
  },
]

export default function Home() {
  const router = useRouter()
  const [slide, setSlide] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/dashboard')
    })
  }, [router])

  useEffect(() => {
    const t = setInterval(() => {
      setFading(true)
      setTimeout(() => { setSlide(s => (s + 1) % DALIL.length); setFading(false) }, 400)
    }, 5000)
    return () => clearInterval(t)
  }, [])

  function goSlide(i) {
    setFading(true)
    setTimeout(() => { setSlide(i); setFading(false) }, 300)
  }

  const d = DALIL[slide]

  return (
    <>
      {/* Google Font — Amiri for Arabic */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Lateef&display=swap');
        .arabic-text { font-family: 'Amiri', 'Lateef', serif; }
        .dalil-fade { transition: opacity .4s ease; }
        .ornament { position:absolute; opacity:.07; pointer-events:none; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .float { animation: float 4s ease-in-out infinite; }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      <main style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'28px 16px', background:'var(--bg)', position:'relative', overflow:'hidden' }}>

        {/* Corner ornaments */}
        <svg className="ornament" style={{ top:0, left:0, width:220, height:220 }} viewBox="0 0 200 200">
          <path d="M0 0 Q100 0 100 100 Q100 0 200 0" fill="none" stroke="#14b8a6" strokeWidth="1"/>
          <path d="M0 0 Q80 0 80 80 Q80 0 160 0" fill="none" stroke="#14b8a6" strokeWidth="0.8"/>
          <path d="M0 0 Q50 0 50 50 Q50 0 100 0" fill="none" stroke="#14b8a6" strokeWidth="0.6"/>
          <circle cx="0" cy="0" r="3" fill="#14b8a6"/>
          <circle cx="0" cy="0" r="60" fill="none" stroke="#14b8a6" strokeWidth="0.4" strokeDasharray="4 8"/>
          <circle cx="0" cy="0" r="110" fill="none" stroke="#14b8a6" strokeWidth="0.3" strokeDasharray="3 12"/>
        </svg>
        <svg className="ornament" style={{ bottom:0, right:0, width:220, height:220, transform:'rotate(180deg)' }} viewBox="0 0 200 200">
          <path d="M0 0 Q100 0 100 100 Q100 0 200 0" fill="none" stroke="#14b8a6" strokeWidth="1"/>
          <path d="M0 0 Q80 0 80 80 Q80 0 160 0" fill="none" stroke="#14b8a6" strokeWidth="0.8"/>
          <path d="M0 0 Q50 0 50 50 Q50 0 100 0" fill="none" stroke="#14b8a6" strokeWidth="0.6"/>
          <circle cx="0" cy="0" r="3" fill="#14b8a6"/>
          <circle cx="0" cy="0" r="60" fill="none" stroke="#14b8a6" strokeWidth="0.4" strokeDasharray="4 8"/>
        </svg>
        {/* Top right ornament — geometric rosette */}
        <svg className="ornament" style={{ top:10, right:10, width:120, height:120 }} viewBox="0 0 100 100">
          {[0,30,60,90,120,150].map(a => (
            <line key={a} x1="50" y1="50" x2={50+45*Math.cos(a*Math.PI/180)} y2={50+45*Math.sin(a*Math.PI/180)} stroke="#14b8a6" strokeWidth="0.5"/>
          ))}
          <circle cx="50" cy="50" r="44" fill="none" stroke="#14b8a6" strokeWidth="0.5"/>
          <circle cx="50" cy="50" r="30" fill="none" stroke="#14b8a6" strokeWidth="0.4" strokeDasharray="3 6"/>
          <circle cx="50" cy="50" r="3" fill="#14b8a6"/>
        </svg>
        {/* Bottom left ornament */}
        <svg className="ornament" style={{ bottom:10, left:10, width:120, height:120 }} viewBox="0 0 100 100">
          {[0,45,90,135].map(a => (
            <line key={a} x1="50" y1="50" x2={50+44*Math.cos(a*Math.PI/180)} y2={50+44*Math.sin(a*Math.PI/180)} stroke="#14b8a6" strokeWidth="0.5"/>
          ))}
          <circle cx="50" cy="50" r="44" fill="none" stroke="#14b8a6" strokeWidth="0.5"/>
          <circle cx="50" cy="50" r="3" fill="#14b8a6"/>
        </svg>

        {/* Hero */}
        <div style={{ textAlign:'center', maxWidth:480, width:'100%', zIndex:1 }}>

          {/* Logo */}
          <div className="float" style={{ width:80,height:80,borderRadius:'50%',background:'var(--t2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:38,margin:'0 auto 14px',border:'2px solid var(--t3)' }}>🌳</div>

          <div style={{ fontSize:40, fontWeight:800, color:'var(--t5)', letterSpacing:'-1px', lineHeight:1 }}>Sulalah</div>
          <div className="arabic-text" style={{ fontSize:18, color:'var(--t4)', marginTop:4, marginBottom:6, opacity:.8 }}>سُلالة</div>
          <p style={{ fontSize:14, color:'var(--tx2)', lineHeight:1.7, marginBottom:28 }}>
            Pohon silsilah keluarga digital dengan deteksi mahram otomatis.<br/>Jaga nasab, jaga silaturahim, lestarikan warisan keluarga.
          </p>

          {/* Dalil Slideshow */}
          <div style={{ position:'relative', background:'var(--surf)', border:'1px solid var(--bd)', borderRadius:16, padding:'20px 22px', marginBottom:28, minHeight:180, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
            {/* Type badge */}
            <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:8 }}>
              <span style={{ fontSize:9, fontWeight:700, letterSpacing:'.8px', textTransform:'uppercase', padding:'3px 10px', borderRadius:20, background: d.type==='quran'?'var(--t2)':'var(--amber-bg)', color: d.type==='quran'?'var(--t6)':'var(--amber-t)', border:`1px solid ${d.type==='quran'?'var(--t3)':'var(--amber-b)'}` }}>
                {d.type==='quran'?'Al-Qur\'an':'Hadits'}
              </span>
            </div>

            <div className={`dalil-fade arabic-text`} style={{ opacity: fading ? 0 : 1, textAlign:'right', marginBottom:14 }}>
              <p style={{ fontSize:22, lineHeight:2.1, color:'var(--tx)', direction:'rtl', marginBottom:0 }}>{d.arabic}</p>
            </div>

            <div className="dalil-fade" style={{ opacity: fading ? 0 : 1, textAlign:'left', borderTop:'1px solid var(--bd)', paddingTop:10 }}>
              <p style={{ fontSize:12, color:'var(--tx2)', lineHeight:1.7, marginBottom:4, fontStyle:'italic' }}>{d.terjemah}</p>
              <p style={{ fontSize:11, color:'var(--t5)', fontWeight:600 }}>— {d.sumber}</p>
            </div>

            {/* Dot indicators */}
            <div style={{ display:'flex', justifyContent:'center', gap:6, marginTop:14 }}>
              {DALIL.map((_, i) => (
                <button key={i} onClick={() => goSlide(i)} style={{ width: i===slide?20:6, height:6, borderRadius:3, background: i===slide?'var(--t4)':'var(--bd2)', border:'none', cursor:'pointer', transition:'all .3s', padding:0 }} />
              ))}
            </div>
          </div>

          <a href="/auth" className="btn btn-primary btn-pill" style={{ fontSize:15, padding:'13px 40px', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8 }}>
            Mulai Sekarang →
          </a>
        </div>

        {/* Feature grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:10, maxWidth:480, width:'100%', marginTop:32, zIndex:1 }}>
          {[
            { icon:'🌳', title:'Pohon Silsilah', desc:'Lintas generasi' },
            { icon:'✦', title:'Deteksi Mahram', desc:'7 golongan nasab' },
            { icon:'📇', title:'Kontak Keluarga', desc:'HP, email, foto' },
            { icon:'🖨️', title:'Cetak Cantik', desc:'5 tema PDF' },
          ].map(f => (
            <div key={f.title} className="card" style={{ borderTop:'3px solid var(--t4)', textAlign:'center', padding:'12px 10px' }}>
              <div style={{ fontSize:20, marginBottom:6 }}>{f.icon}</div>
              <div style={{ fontSize:12, fontWeight:700, color:'var(--tx)', marginBottom:3 }}>{f.title}</div>
              <div style={{ fontSize:10, color:'var(--tx2)', lineHeight:1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        <p style={{ marginTop:20, fontSize:11, color:'var(--tx3)', zIndex:1 }}>Gratis · Aman · Data keluarga Anda terlindungi</p>
      </main>
    </>
  )
}
