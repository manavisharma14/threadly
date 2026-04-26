/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",   // ← covers src/app or src/components projects
  ],
  theme: {
  extend: {
    colors: {
      ink: '#1a1a2e',
      terracotta: '#c4613a',
      'terracotta-light': '#f0d5c8',
      sand: '#f5f0e8',
      'sand-dark': '#ede6d6',
      sage: '#4a7c59',
      cream: '#faf8f4',
    },
    fontFamily: {
      serif: ['"Playfair Display"', 'Georgia', 'serif'],
      sans: ['"DM Sans"', 'sans-serif'],
    },
  },
},
  plugins: [require("tailwindcss-animate")],
};