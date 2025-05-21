export * from './colors';
export * from './typography';
export * from './spacing';

// Theme configuration
export const theme = {
  colors: {
    primary: {
      light: '#60A5FA', // blue-400
      main: '#3B82F6', // blue-500
      dark: '#2563EB', // blue-600
    },
    secondary: {
      light: '#FCD34D', // amber-300
      main: '#F59E0B', // amber-500
      dark: '#D97706', // amber-600
    },
    background: {
      default: '#F3F4F6', // gray-100
      paper: '#FFFFFF',
      dark: '#1F2937', // gray-800
    },
    text: {
      primary: '#1F2937', // gray-800
      secondary: '#4B5563', // gray-600
      disabled: '#9CA3AF', // gray-400
      inverse: '#FFFFFF',
    },
    border: {
      light: '#E5E7EB', // gray-200
      main: '#D1D5DB', // gray-300
      dark: '#9CA3AF', // gray-400
    },
  },
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, -apple-system, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
  transitions: {
    default: '0.2s ease-in-out',
    fast: '0.1s ease-in-out',
    slow: '0.3s ease-in-out',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export type Theme = typeof theme;
