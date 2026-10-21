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
    const renamedToTools = [
      "autopilot",
      "codiumai",
      "freepik-ai-image-generator",
      "google_cloud_automl",
      "growthbar",
      "hugo-ai",
      "mindsdb",
      "mobilemonkey",
      "munch",
      "paintschainer",
      "phrasee",
      "podcastle",
      "replit-ghostwriter",
      "sendinblue",
      "vidyoai",
    ]
    return [
      ...renamedToTools.map((id) => ({
        source: `/tool/${id}`,
        destination: "/tools",
        permanent: true,
      })),
      {
        source: "/tool/windsurf",
        destination: "/tool/devin",
        permanent: true,
      },
      {
        source: "/match-results",
        destination: "/recommendation",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig 