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
    const retiredCategories = {
      text: "writing",
      audio: "voice",
      "data-processing": "data",
    }
    const duplicateTools = {
      "microsoft-copilot": "microsoft-365-copilot",
      "canva-magic-design": "canva-ai",
      mailchimpoptimizer: "mailchimp",
    }
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
      ...Object.entries(duplicateTools).map(([from, to]) => ({
        source: `/tool/${from}`,
        destination: `/tool/${to}`,
        permanent: true,
      })),
      ...Object.entries(retiredCategories).flatMap(([from, to]) => [
        { source: `/categories/${from}`, destination: `/categories/${to}`, permanent: true },
        { source: `/categories/${from}/`, destination: `/categories/${to}`, permanent: true },
      ]),
    ]
  },
}

module.exports = nextConfig 