import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Creato Display', 'sans-serif'],
        brand: ['Colbiac', 'Creato Display', 'sans-serif'],
      },
      colors: {
        linen: '#f1eee4',
        ink: '#1f2c27',
        moss: '#30453c',
        palm: '#087942',
        sun: '#f8cc3d',
        tide: '#0d3f94',
        coral: '#d92f28',
      },
      boxShadow: {
        soft: '0 24px 70px rgba(31, 44, 39, 0.14)',
      },
    },
  },
  plugins: [],
} satisfies Config;
