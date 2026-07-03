import './globals.css'

export const metadata = {
  title: 'Okan Çelikcan | Full-Stack Developer & Bilgisayar Mühendisi',
  description:
    "Okan Çelikcan'ın kişisel portföy sitesi. Full-stack web uygulamaları, yapay zeka destekli projeler, React Native mobil uygulamalar ve Unity oyun prototipi çalışmalarını inceleyebilirsiniz.",
  keywords: [
    'Okan Çelikcan',
    'Okan Celikcan',
    'okancelikcan',
    'Full-Stack Developer',
    'Bilgisayar Mühendisi',
    'React',
    'Next.js',
    'ASP.NET Core',
    'MSSQL',
    'OpenAI',
    'Portfolio',
  ],
  authors: [{ name: 'Okan Çelikcan' }],
  creator: 'Okan Çelikcan',
  metadataBase: new URL('https://okancelikcan.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Okan Çelikcan | Full-Stack Developer',
    description:
      "Okan Çelikcan'ın kişisel portföy sitesi. Full-stack web, yapay zeka destekli uygulamalar, React Native mobil projeler ve Unity oyun prototipi çalışmalarını inceleyebilirsiniz.",
    url: 'https://okancelikcan.com',
    siteName: 'Okan Çelikcan Portfolio',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Okan Çelikcan | Full-Stack Developer',
    description:
      'Full-stack web, yapay zeka destekli uygulamalar, React Native mobil projeler ve Unity oyun prototipi çalışmalarımı inceleyebilirsiniz.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}