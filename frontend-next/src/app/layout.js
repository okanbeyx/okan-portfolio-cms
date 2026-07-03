import './globals.css'

const siteUrl = 'https://okancelikcan.com'

const description =
  'Okan Çelikcan portföyü: Full-stack web, mobil uygulama ve yapay zeka destekli projeler.'

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: 'Okan Çelikcan',
      alternateName: ['Okan Celikcan', 'okancelikcan'],
      url: siteUrl,
      jobTitle: 'Computer Engineer, Full-Stack Developer',
      knowsAbout: [
        'Full-Stack Web Development',
        'React',
        'Next.js',
        'ASP.NET Core',
        'MSSQL',
        'Entity Framework Core',
        'OpenAI API',
        'React Native',
        'Unity',
      ],
      sameAs: [
        'https://www.linkedin.com/in/okancelikcan/',
        'https://github.com/okanbeyx',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: 'Okan Çelikcan Portfolio',
      url: siteUrl,
      inLanguage: 'tr-TR',
      publisher: {
        '@id': `${siteUrl}/#person`,
      },
    },
    {
      '@type': 'ProfilePage',
      '@id': `${siteUrl}/#profilepage`,
      name: 'Okan Çelikcan | Full-Stack Developer',
      url: siteUrl,
      description,
      inLanguage: 'tr-TR',
      about: {
        '@id': `${siteUrl}/#person`,
      },
      isPartOf: {
        '@id': `${siteUrl}/#website`,
      },
    },
  ],
}

export const metadata = {
  title: 'Okan Çelikcan | Full-Stack Developer & Bilgisayar Mühendisi',
  description,
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
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Okan Çelikcan | Full-Stack Developer',
    description,
    url: siteUrl,
    siteName: 'Okan Çelikcan Portfolio',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Okan Çelikcan | Full-Stack Developer',
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        {children}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </body>
    </html>
  )
}