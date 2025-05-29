/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://aitools.ninja' : '',
  basePath: '',
  output: 'standalone',
}

module.exports = nextConfig 