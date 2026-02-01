/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f0f0f',
        card: '#1a1a1a',
        primary: '#3b82f6',
        border: '#27272a',
        muted: '#a1a1aa',
      },
    },
  },
  plugins: [],
}
