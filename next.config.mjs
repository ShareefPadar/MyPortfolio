import createMDX from '@next/mdx'

// remark-gfm was in package.json but never wired in, so GFM tables and
// strikethrough silently did nothing.
//
// Plugins are referenced BY NAME, not imported: Turbopack requires loader
// options to be serializable, and passing the imported function fails the
// build with "does not have serializable options".
//
// rehype-pretty-code is deliberately left out: no case study uses a fenced
// code block, and it pulls a full syntax highlighter into the build for
// nothing.
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [['remark-gfm']],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['react-icons'],
  },
  // /work/mizan renamed to /work/wio when the concept product on that page
  // was rebranded to match the real bank it studies. permanent: true emits a
  // 308, so search engines transfer the old URL's standing to the new one
  // instead of indexing both.
  // The generated era pages (public/_eras, served by proxy.ts) are the same
  // pages in other years; only the live 1995 pages should be indexed.
  async headers() {
    return [{ source: '/_eras/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] }]
  },
  async redirects() {
    return [
      {
        source: '/work/mizan',
        destination: '/work/wio',
        permanent: true,
      },
    ]
  },
}

export default withMDX(nextConfig)
