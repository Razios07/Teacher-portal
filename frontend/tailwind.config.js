/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ink: {
          50:  '#f4f3f0',
          100: '#e8e6e0',
          200: '#ccc9be',
          300: '#aaa696',
          400: '#888069',
          500: '#6b6050',
          600: '#524a3d',
          700: '#3b352c',
          800: '#252119',
          900: '#120f0b',
        },
        jade: {
          50:  '#edfaf4',
          100: '#d0f2e2',
          200: '#a3e5c5',
          300: '#65d09e',
          400: '#2eb878',
          500: '#149a5d',
          600: '#0b7a48',
          700: '#095e38',
          800: '#07472a',
          900: '#042d1a',
        },
        amber: {
          50:  '#fff8ed',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
      },
      boxShadow: {
        'card': '0 2px 12px 0 rgba(18,15,11,0.08)',
        'card-hover': '0 8px 32px 0 rgba(18,15,11,0.14)',
      },
    },
  },
  plugins: [],
}
