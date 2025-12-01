/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#ff4500',
          dark: '#d63f05'
        }
      },
      boxShadow: {
        card: '0 1px 1px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.1)'
      }
    },
  },
  plugins: [],
}

