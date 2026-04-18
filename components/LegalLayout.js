'use client'
import { useRouter } from 'next/navigation'

export default function LegalLayout({ title, subtitle, lastUpdated, children }) {
  const router = useRouter()
  return (
    <main style={{ maxWidth:720,margin:'0 auto',padding:'0 16px 40px' }}>
      <div className="topbar" style={{ borderRadius:'0 0 14px 14px',marginBottom:24 }}>
        <div>
          <div className="topbar-title">🌳 Sulalah</div>
          <div className="topbar-sub">{subtitle}</div>
        </div>
        <button onClick={()=>router.back()} style={{ background:'rgba(255,255,255,.15)',color:'#fff',border:'1px solid rgba(255,255,255,.3)',padding:'6px 12px',borderRadius:20,fontSize:12,cursor:'pointer' }}>← Kembali</button>
      </div>

      <div className="card" style={{ padding:'24px 28px' }}>
        <h1 style={{ fontSize:24,fontWeight:800,color:'var(--tx)',marginBottom:6,letterSpacing:'-.4px' }}>{title}</h1>
        <p style={{ fontSize:12,color:'var(--tx3)',marginBottom:20 }}>Terakhir diperbarui: {lastUpdated}</p>
        <div className="legal-content">
          {children}
        </div>
      </div>

      <div style={{ textAlign:'center',marginTop:20,fontSize:11,color:'var(--tx3)' }}>
        <a href="/privacy" style={{ color:'var(--t5)',textDecoration:'none',marginRight:12 }}>Kebijakan Privasi</a>
        ·
        <a href="/terms" style={{ color:'var(--t5)',textDecoration:'none',margin:'0 12px' }}>Syarat & Ketentuan</a>
        ·
        <a href="/hapus-akun" style={{ color:'var(--t5)',textDecoration:'none',marginLeft:12 }}>Hapus Akun</a>
      </div>

      <style>{`
        .legal-content h2 {
          font-size: 17px;
          font-weight: 700;
          color: var(--tx);
          margin: 24px 0 10px;
          padding-bottom: 6px;
          border-bottom: 1px solid var(--bd);
        }
        .legal-content h3 {
          font-size: 14px;
          font-weight: 700;
          color: var(--tx);
          margin: 18px 0 6px;
        }
        .legal-content p {
          font-size: 13px;
          line-height: 1.8;
          color: var(--tx);
          margin-bottom: 10px;
        }
        .legal-content ul {
          margin: 8px 0 14px 20px;
        }
        .legal-content li {
          font-size: 13px;
          line-height: 1.8;
          color: var(--tx);
          margin-bottom: 4px;
        }
        .legal-content strong { color: var(--tx); font-weight: 600; }
        .legal-content a { color: var(--t5); text-decoration: underline; }
        .legal-content .dalil {
          background: var(--surf);
          border: 1px solid var(--bd);
          border-left: 3px solid var(--t4);
          border-radius: 8px;
          padding: 10px 14px;
          margin: 14px 0;
          font-style: italic;
          font-size: 12px;
          color: var(--tx2);
        }
        .legal-content .info-box {
          background: var(--surf);
          border: 1px solid var(--bd);
          border-radius: 8px;
          padding: 12px 16px;
          margin: 14px 0;
        }
        .legal-content .info-box p:last-child { margin-bottom: 0; }
      `}</style>
    </main>
  )
}
