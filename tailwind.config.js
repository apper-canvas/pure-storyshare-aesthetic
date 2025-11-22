/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2C5F8D",
        secondary: "#8B4B89",
        accent: "#E67E50",
        surface: "#FAF9F7",
        'success': "#52A675",
        'warning': "#D99A2C",
        'error': "#C94D4D",
        'info': "#5B9BD5",
      },
      fontFamily: {
        'display': ['Merriweather', 'serif'],
        'body': ['Inter', 'sans-serif'],
        'reading': ['Lora', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}