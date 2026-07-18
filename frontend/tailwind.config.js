/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          maroon: '#7A1F2B',
          'maroon-deep': '#5B1420',
          vermilion: '#C1440E',
          marigold: '#E8A93D',
          leaf: '#1F4E3D',
          'ink-soft': '#6B6B72',
        },
        fontFamily: {
          serif: ['Fraunces', 'serif'],
          sans: ['Inter', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }