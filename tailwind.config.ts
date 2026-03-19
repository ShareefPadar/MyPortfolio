import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#E21D70", // Vibrant magenta
          hover: "#C21861",
          gradient: "linear-gradient(to right, #E21D70, #FF3D81)",
        },
        surface: {
          peach: "#FFF0EB",
          lavender: "#F5F3FF",
          mint: "#ECFDF5",
          sky: "#F0F9FF",
          amber: "#FFFBEB",
        },
        neutral: {
          950: "#1A1A1A",
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
