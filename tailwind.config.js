/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        logo: '#404650',
        primary: '#1EB589',
        button: '#FF6B6B',
        highlight: '#FFE066',
        border: '#CED4DA'
      }
    },
  },
  plugins: [],
}

