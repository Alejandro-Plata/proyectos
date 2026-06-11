// 1. IMPORTANTE: Importar la función plugin aquí
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rune: {
          300: '#59c9b6',
          400: '#2dd4bf',
          500: '#14b8a6',
          glow: 'rgba(45, 212, 191, 0.7)'
        }
      },
      
      keyframes: {
          shimmer: {
            '100%': { transform: 'translateX(100%) skewX(12deg)' },
          },
      },

      animation: {
        'shimmer': 'shimmer 1s ease-in-out infinite',
        'spin':   'spin 2.2s linear infinite',
        'bounce': 'bounce 1.8s infinite',
        'pulse':  'pulse 2.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        ':root': {
          '--nexus-color': theme('colors.rune.400'),
          '--nexus-particle-color': theme('colors.rune.400'),
        },
        '.dark': {
          '--nexus-color': theme('colors.rune.400'),
          '--nexus-particle-color': theme('colors.slate.600'), // Asegúrate de que slate esté disponible o usa valhalla
        },
      })
    })
  ],
}