/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        idbi: {
          green: '#006747', // Primary Teal/Green
          light: '#008575',
          dark: '#004d35',
          orange: '#F47920', // Secondary Orange
          orangeLight: '#F7941D',
        },
        brand: {
          amber: '#F5A623',
          red: '#E53E3E',
          blue: '#4A90D9',
          bg: '#F7F8FA', // Clean off-white background
        }
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
