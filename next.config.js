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
      { source: "/fr/about/about", destination: "/fr/about", permanent: true },
      { source: "/fr/submit/submit", destination: "/fr/submit", permanent: true },
      { source: "/fr/tools/tools", destination: "/fr/tools", permanent: true },
      { source: "/fr/tool/tool/:id", destination: "/fr/tool/:id", permanent: true },
      { source: "/fr/tools/:id", destination: "/fr/tool/:id", permanent: true },
      ...renamedToTools.flatMap((id) => [
        {
          source: `/tool/${id}`,
          destination: "/tools",
          permanent: true,
        },
        {
          source: `/fr/tool/${id}`,
          destination: "/fr/tools",
          permanent: true,
        },
      ]),
      {
        source: "/tool/windsurf",
        destination: "/tool/devin",
        permanent: true,
      },
      {
        source: "/fr/tool/windsurf",
        destination: "/fr/tool/devin",
        permanent: true,
      },
      {
        source: "/match-results",
        destination: "/recommendation",
        permanent: true,
      },
      {
        source: "/fr/match-results",
        destination: "/fr/recommendation",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig 