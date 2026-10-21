/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'images.unsplash.com', 'placehold.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  // Build output configuration
  output: 'standalone',
  // Environment variables that should be exposed to the browser
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  async redirects() {
    const apexHost = {
      type: "host",
      value: "aitools.ninja",
    }
    return [
      {
        source: "/",
        has: [apexHost],
        destination: "https://www.aitools.ninja/",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [apexHost],
        destination: "https://www.aitools.ninja/:path*",
        permanent: true,
      },
      { source: "/about/about", destination: "/about", permanent: true },
      { source: "/submit/submit", destination: "/submit", permanent: true },
      { source: "/tools/tools", destination: "/tools", permanent: true },
      { source: "/tool/tool/:id", destination: "/tool/:id", permanent: true },
      { source: "/tools/:id", destination: "/tool/:id", permanent: true },
    ]
  },
}

module.exports = nextConfig 