/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/oc-cms-gate-2026',
        destination: 'https://okan-portfolio-cms.vercel.app/oc-cms-gate-2026',
        permanent: false,
      },
      {
        source: '/oc-cms-gate-2026/:path*',
        destination: 'https://okan-portfolio-cms.vercel.app/oc-cms-gate-2026/:path*',
        permanent: false,
      },
    ]
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.okancelikcan.com/api/:path*',
      },
    ]
  },
}

export default nextConfig