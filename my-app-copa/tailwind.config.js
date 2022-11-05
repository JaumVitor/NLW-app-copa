/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.tsx',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'Roboto, sans-serif'
      }
    },
    
    backgroundImage: {
      app: 'url(/BG-effects.png)'
    },

    colors: {
      gray: {
        950: '#09090A',
        900: '#121214',
        800: '#202024',
        600: '#323238',
        300: '#8D8D99',
        200: '#C4C4CC',
        100: '#E1E1E6',
      },
      green: {
        500: '#047C3F',
        600: '#129E57',
      },
      yellow: {
        500: '#F7DD43',
        600: '#BBA317',
      },
      red: {
        500: '#DB4437',
      },
      white: '#FFFFFF'
    },
  },
  plugins: [],
}
