import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#050a14',
          900: '#0a1120',
          800: '#111b30',
          700: '#1a2740',
          600: '#26375a',
          500: '#3a4d76',
        },
        solar: {
          50: '#fff8e6',
          100: '#ffedb8',
          300: '#ffd464',
          400: '#ffc22e',
          500: '#f7a814',
          600: '#d98a0a',
        },
        cyan: {
          300: '#7fe3f0',
          400: '#3fd0e6',
          500: '#17b8d1',
          600: '#0e93a8',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-lines':
          'linear-gradient(rgba(127,227,240,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(127,227,240,0.06) 1px, transparent 1px)',
        'radial-glow':
          'radial-gradient(circle at 50% 0%, rgba(247,168,20,0.18), transparent 60%)',
      },
      boxShadow: {
        glow: '0 0 40px rgba(247,168,20,0.25)',
        'glow-cyan': '0 0 40px rgba(63,208,230,0.2)',
      },
    },
  },
  plugins: [],
} satisfies Config
