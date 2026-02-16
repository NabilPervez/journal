/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#0F172A',
        starlight: '#F8FAFC',
        gold: '#D4AF37',
        crimson: '#9F1239',
        parchment: '#F5F5DC',
      },
      fontFamily: {
        heading: ['Cinzel', 'Libre Baskerville', 'serif'],
        arabic: ['Amiri', 'serif'],
        body: ['Inter', 'Lato', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
