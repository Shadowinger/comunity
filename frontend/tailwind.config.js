/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        // Discord color palette
        discord: {
          dark: '#202225',
          darker: '#18191c',
          sidebar: '#2f3136',
          channel: '#36393f',
          hover: '#3a3c40',
          selected: '#42464d',
          text: '#dcddde',
          muted: '#72767d',
          link: '#00aff4',
          green: '#3ba55c',
          blurple: '#5865f2',
          blurpleDark: '#4752c4',
          red: '#ed4245',
          yellow: '#faa61a'
        }
      },
      boxShadow: {
        card: '0 1px 1px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.1)',
        elevation: '0 8px 16px rgba(0,0,0,0.24)'
      }
    },
  },
  plugins: [],
}

