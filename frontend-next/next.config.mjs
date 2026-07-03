/** @type {import('next').NextConfig} */
const nextConfig = {
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