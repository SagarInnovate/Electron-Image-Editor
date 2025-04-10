module.exports = {
    content: [
      './src/**/*.{js,jsx,html}',
    ],
    darkMode: 'class', // Enable dark mode with class
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#eef2ff',
            100: '#e0e7ff',
            200: '#c7d2fe',
            300: '#a5b4fc',
            400: '#818cf8',
            500: '#6366f1', // Main primary color
            600: '#4f46e5',
            700: '#4338ca',
            800: '#3730a3',
            900: '#312e81',
            950: '#1e1b4b',
          },
          secondary: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b', // Main secondary color
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
            950: '#020617',
          },
          accent: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981', // Main accent color
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
            950: '#022c22',
          },
          background: {
            dark: '#0f172a', // Dark mode background
            light: '#f8fafc', // Light mode background
          },
          surface: {
            dark: '#1e293b', // Dark mode surface
            light: '#ffffff', // Light mode surface
          },
        },
        fontFamily: {
          sans: ['Inter var', 'ui-sans-serif', 'system-ui', 'sans-serif'],
          mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        },
        boxShadow: {
          'neon': '0 0 5px theme(colors.primary.400), 0 0 20px theme(colors.primary.500)',
          'neon-accent': '0 0 5px theme(colors.accent.400), 0 0 20px theme(colors.accent.500)',
        },
        animation: {
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'float': 'float 3s ease-in-out infinite',
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-10px)' },
          },
        },
        backdropBlur: {
          'xs': '2px',
        },
      },
    },
    plugins: [],
  };