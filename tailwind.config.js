/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Pretendard GOV"', 'Pretendard', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef5ff',
          100: '#d9e8ff',
          200: '#b6d1ff',
          300: '#86b1ff',
          400: '#5a8cff',
          500: '#3567ee',
          600: '#234fd1',
          700: '#1d3fa8',
          800: '#1c3789',
          900: '#1c3270',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 16px rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
};
