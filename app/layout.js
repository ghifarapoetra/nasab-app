import './globals.css'

export const metadata = {
  title: 'Nasab — Pohon Silsilah Keluarga',
  description: 'Pohon silsilah keluarga dengan deteksi mahram otomatis',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
