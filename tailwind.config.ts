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
          DEFAULT: "#E21D70",
          hover: "#C21861",
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
        },
        form: {
          bg: "#0A0C14",
          cyan: "#00c8dc",
        },
      },
      borderRadius: {
        device: "2.5rem",
        "device-lg": "3.5rem",
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
