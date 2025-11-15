/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand color - Coral/Terracotta
        primary: {
          DEFAULT: "#694873",
          dark: "#694873",
          light: "#694873",
        },
        // Secondary brand color - Teal
        secondary: {
          DEFAULT: "#00897B",
          dark: "#00796B",
          light: "#009688",
        },
        // Accent color - Gold
        accent: {
          DEFAULT: "#FFD54F",
          dark: "#FFC107",
          light: "#FFEB3B",
        },
        // Background colors
        background: "#FAFAFA",
        surface: "#FFFFFF",
        parchment: "#FAFAFA",
        
        // Text colors
        text: {
          primary: "#2B2B2B",
          secondary: "#5F5F5F",
        },
        textPrimary: "#2B2B2B",
        textSecondary: "#5F5F5F",
      },
    },
  },
  plugins: [],
}