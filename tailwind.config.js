import { theme } from './src/theme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'oxford-blue': '#1B2B44',
        charcoal: '#2C3E50',
        'french-gray': '#8B9EB7',
        'papaya-whip': '#FFF1D6',
        peach: '#FFB5A7',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            h1: {
              color: '#FFF1D6',
              fontWeight: '700',
              fontSize: '2.25rem',
              marginBottom: '1rem',
            },
            h2: {
              color: '#FFF1D6',
              fontWeight: '600',
              fontSize: '1.875rem',
              marginBottom: '0.75rem',
            },
            h3: {
              color: '#FFF1D6',
              fontWeight: '600',
              fontSize: '1.5rem',
              marginBottom: '0.5rem',
            },
            p: {
              color: '#8B9EB7',
              fontSize: '1rem',
              lineHeight: '1.5',
            },
          },
        },
      },
      spacing: theme.spacing,
      borderRadius: theme.borderRadius,
      boxShadow: theme.shadows,
      transitionDuration: {
        DEFAULT: '200ms',
        fast: '100ms',
        slow: '300ms',
      },
      screens: theme.breakpoints,
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
