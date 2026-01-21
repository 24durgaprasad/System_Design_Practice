/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        mint: {
          500: '#10B981',
        },
      },
      boxShadow: {
        soft: '0 24px 80px rgba(15, 23, 42, 0.40)',
      },
    },
  },
  plugins: [],
};


