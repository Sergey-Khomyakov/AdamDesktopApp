/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,mjs,jsx,ts,tsx}", "./*.html"],
  theme: {
    extend: {
      marging:{
        'unset': 'unset',
      },
      transitionProperty: {
        'max-width': 'max-width',
        'width': 'width',
        'bg' : 'background-color',
      },
      width: {
        'fill-available': 'fill-available',
      },
      gridTemplateColumns: {
        'full': '100%',
        'auto-1fr': 'auto 1fr',
        'auto-auto': 'auto auto',
        '1fr-auto': '1fr auto',
        '1fr-1fr': '1fr 1fr',
        'auto-auto-1fr': 'auto auto 1fr',
        '1fr-auto-1fr' : '1fr auto 1fr',
        'auto-1fr-auto' : 'auto 1fr auto',
        'auto-auto-auto': 'auto auto auto',
      },
      fontFamily:{
        'Manrope': ['Manrope', 'sans-serif'],
      },
      colors:{
        transparent: 'transparent',
        white: '#f5f5f5',
        black: '#26272b',
        primary: '#1d4f9b',
        grey: '#667085',
        stroke: '#f1f3f6',
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
}

