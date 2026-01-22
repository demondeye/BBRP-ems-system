/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0b1020',
        card: 'rgba(255,255,255,0.06)',
        card2: 'rgba(255,255,255,0.08)',
        text: 'rgba(255,255,255,0.92)',
        muted: 'rgba(255,255,255,0.60)',
        border: 'rgba(255,255,255,0.14)',
        ok: 'rgba(170,255,210,0.95)',
        warn: 'rgba(255,220,160,0.95)',
      },
    },
  },
  plugins: [],
}
