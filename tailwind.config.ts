import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0B0C',
        foreground: '#ECEDEE',
        muted: '#111113',
        mutedForeground: '#8E8E93',
        primary: {
          DEFAULT: '#6E56CF',
          foreground: '#FFFFFF'
        },
        accent: {
          DEFAULT: '#1A1A1D',
          foreground: '#ECEDEE'
        },
        border: '#1F1F22',
        input: '#1F1F22',
        ring: '#6E56CF'
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgba(0,0,0,.35), 0 6px 20px rgba(0,0,0,.35)'
      },
      fontFamily: {
        sans: ['var(--font-inter)']
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
