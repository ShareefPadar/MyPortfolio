/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This helps reduce the 111 KiB of unused JS by targeting modern browsers
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
    // Optimizes package imports to reduce bundle size
    optimizePackageImports: ['lucide-react', 'framer-motion'], 
  },
}

module.exports = nextConfig

