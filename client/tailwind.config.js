/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#d2bbff',
        'primary-container': '#7c3aed',
        'on-primary': '#3f008e',
        'on-primary-container': '#ede0ff',
        'primary-fixed': '#eaddff',
        'primary-fixed-dim': '#d2bbff',
        secondary: '#ddb8ff',
        tertiary: '#ffb784',
        error: '#ffb4ab',
        'error-container': '#93000a',
        background: '#15121b',
        surface: '#15121b',
        'surface-dim': '#15121b',
        'surface-bright': '#3c3742',
        'surface-container-lowest': '#100d16',
        'surface-container-low': '#1d1a24',
        'surface-container': '#221e28',
        'surface-container-high': '#2c2833',
        'surface-container-highest': '#37333e',
        'surface-variant': '#37333e',
        'on-surface': '#e8dfee',
        'on-surface-variant': '#ccc3d8',
        outline: '#958da1',
        'outline-variant': '#4a4455'
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px'
      },
      spacing: {
        'section-gap': '8rem',
        gutter: '1.5rem',
        'container-margin': '2rem'
      },
      fontFamily: {
        headline: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        label: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        code: ['Geist', 'ui-monospace', 'monospace']
      },
      fontSize: {
        'headline-xl': ['64px', { lineHeight: '72px', letterSpacing: '-0.02em', fontWeight: '800' }],
        'headline-xl-mobile': ['40px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '800' }],
        'headline-lg': ['32px', { lineHeight: '40px', fontWeight: '700' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-sm': ['14px', { lineHeight: '20px', letterSpacing: '0.05em', fontWeight: '500' }]
      },
      boxShadow: {
        glow: '0 0 32px rgba(124, 58, 237, 0.15)',
        'glow-sm': '0 0 20px rgba(124, 58, 237, 0.12)'
      }
    }
  },
  plugins: []
};
