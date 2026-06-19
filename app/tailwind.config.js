/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0E1B17',
        sub: '#5b6b63',
        moss: {
          50: '#f0f7f3',
          100: '#dceee4',
          200: '#bfe0d0',
          500: '#1f7a5a',
          600: '#176349',
          700: '#114e3a',
        },
        sand: '#F7F6F2',
        line: '#e7eae6',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(14,27,23,.04), 0 12px 40px -12px rgba(14,27,23,.14)',
        pop: '0 20px 60px -20px rgba(14,27,23,.35)',
      },
      keyframes: {
        fadeUp: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'none' } },
        sheetUp: { from: { transform: 'translateY(100%)' }, to: { transform: 'none' } },
        pop: { '0%': { transform: 'scale(.6)', opacity: 0 }, '60%': { transform: 'scale(1.08)' }, '100%': { transform: 'scale(1)', opacity: 1 } },
        bar: { from: { width: '0%' }, to: { width: '100%' } },
      },
      animation: {
        fadeUp: 'fadeUp .28s ease both',
        sheetUp: 'sheetUp .3s cubic-bezier(.2,.8,.2,1) both',
        pop: 'pop .45s cubic-bezier(.2,.8,.2,1) both',
        bar: 'bar 2.6s ease forwards',
      },
    },
  },
  plugins: [],
};
