/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
      },
      colors: {
        hud: {
          base: '#0a0b0e',
          surface: '#0f1115',
          elevated: '#161820',
        },
      },
    },
  },
  plugins: [],
};
