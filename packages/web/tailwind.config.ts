import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        nexus: {
          50:  '#f0f0ff',
          100: '#e4e3ff',
          200: '#cccbff',
          300: '#aaa7ff',
          400: '#8379ff',
          500: '#6451fa',
          600: '#5532f0',
          700: '#4924dc',
          800: '#3d1eb4',
          900: '#33198f',
          950: '#1e0d61',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
      },
      backgroundImage: {
        'nexus-gradient': 'linear-gradient(135deg, #0f0c29 0%, #1a103d 40%, #0d0d2b 100%)',
        'card-gradient':  'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
        'cta-gradient':   'linear-gradient(135deg, #6451fa 0%, #22d3ee 100%)',
        'avatar-ring':    'linear-gradient(135deg, #6451fa, #22d3ee, #ec4899)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glass:   '0 8px 32px rgba(0, 0, 0, 0.37)',
        glow:    '0 0 40px rgba(100, 81, 250, 0.35)',
        'glow-cyan': '0 0 30px rgba(34, 211, 238, 0.2)',
      },
      animation: {
        'fade-in-up':  'fadeInUp 0.6s ease-out both',
        'fade-in':     'fadeIn 0.4s ease-out both',
        'shimmer':     'shimmer 2s infinite linear',
        'pulse-slow':  'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':       'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
