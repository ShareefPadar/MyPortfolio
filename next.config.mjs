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
}

export default withMDX(nextConfig)
