/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],
        manrope: ['var(--font-manrope)', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // Direct design system token mappings
        canvas: '#F8FAFC',
        surface: {
          DEFAULT: '#FFFFFF',
          elevated: '#F1F5F9',
          hover: '#F8FAFC',
          selected: '#E2E8F0',
        },
        sidebar: {
          DEFAULT: '#0C1322',
          surface: '#141E33',
          card: '#162238',
          hover: '#1E2D4A',
          active: '#2563EB',
          text: '#94A3B8',
          title: '#F8FAFC',
        },
        medical: {
          blue: '#2563EB',
          sage: '#0EA5E9',
          indigo: '#4F46E5',
          navy: '#0F172A',
        },
        content: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#64748B',
          disabled: '#94A3B8',
        },
        line: '#E2E8F0',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      transitionDuration: {
        DEFAULT: '150ms',
        smooth: '200ms',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
