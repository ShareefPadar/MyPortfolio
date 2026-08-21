module.exports = {
  plugins: {
    // Tailwind v4 handles vendor prefixing via Lightning CSS. autoprefixer on
    // top is redundant, and it can rewrite or drop the -webkit-mask-image the
    // scanline reveal depends on (spec §5.2) with no build error.
    '@tailwindcss/postcss': {},
  },
}
