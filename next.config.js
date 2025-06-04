/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true, // This helps with static image loading
  },
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  reactStrictMode: false,
  // Build output configuration
  output: 'standalone',
  // Environment variables that should be exposed to the browser
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  // Disable chunk optimization to fix module loading issues
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
}

module.exports = nextConfig 