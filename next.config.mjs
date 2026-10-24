/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true, // For static exports
  },
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  trailingSlash: true, // Add trailing slashes to all routes
  // Production keeps serving built files from the apex domain. Preview builds
  // must use their own /_next assets, or the branch preview is styled by production.
  assetPrefix: process.env.VERCEL_ENV === "production" ? "https://aitools.ninja" : "",
  // Add basePath if deploying to a subdirectory
  basePath: '',
  // Ensure static files are properly served
  async headers() {
    return [
      {
        source: '/tool-screenshots/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default nextConfig 