/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A1628',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F0F4F8',
          foreground: '#0A1628',
        },
        accent: {
          DEFAULT: '#3B82F6',
          foreground: '#FFFFFF',
        },
        background: '#FFFFFF',
        foreground: '#0F172A',
        muted: '#F1F5F9',
        border: '#E2E8F0',
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',
          700: '#334E68',
          800: '#243B53',
          900: '#0A1628',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
