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
        primary: {
          DEFAULT: '#FF6B6B',
          dark: '#FF5252',
          light: '#FF8A8A',
        },
        secondary: {
          DEFAULT: '#00897B',
          dark: '#00796B',
          light: '#4DB6AC',
        },
        accent: {
          DEFAULT: '#FFD54F',
          dark: '#FFC107',
          light: '#FFE082',
        },
        background: '#FAFAFA',
        surface: '#FFFFFF',
        textPrimary: '#2E3440',
        textSecondary: '#6B7280',
      },
    },
  },
  plugins: [],
};