import './globals.css'

export const metadata = {
  title: 'Sulalah — Pohon Silsilah Keluarga Muslim',
  description: 'Pohon silsilah keluarga digital dengan deteksi mahram otomatis. Jaga nasab, jaga silaturahim.',
  keywords: ['silsilah', 'nasab', 'keluarga', 'mahram', 'muslim', 'pohon keluarga', 'sulalah'],
  authors: [{ name: 'Ghifara Poetra' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Sulalah — Pohon Silsilah Keluarga Muslim',
    description: 'Pohon silsilah keluarga digital dengan deteksi mahram otomatis.',
    url: 'https://sulalah.my.id',
    siteName: 'Sulalah',
    locale: 'id_ID',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body>{children}</body>
    </html>
  )
}
