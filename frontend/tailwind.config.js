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
          DEFAULT: '#1e3a5f',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#FDF8F3',
          foreground: '#1e3a5f',
        },
        accent: {
          DEFAULT: '#7eb8c9',
          foreground: '#1e3a5f',
        },
        background: '#FDFBF7',
        foreground: '#1e3a5f',
        muted: '#F5F0E8',
        border: '#E8E2D9',
        destructive: {
          DEFAULT: '#dc6b6b',
          foreground: '#FFFFFF',
        },
        cream: {
          50: '#FEFDFB',
          100: '#FDF8F3',
          200: '#F9F1E8',
          300: '#F5EAD8',
          400: '#EFE0C8',
          500: '#E8D5B5',
        },
        pastel: {
          blue: '#d4e5ed',
          blueLight: '#e8f2f7',
          blueDark: '#7eb8c9',
          peach: '#f7e4d8',
          sage: '#d8e8d4',
        },
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#1e3a5f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['"DM Serif Display"', 'serif'],
      },
      borderRadius: {
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -4px rgba(30, 58, 95, 0.08)',
        'soft-lg': '0 10px 40px -10px rgba(30, 58, 95, 0.12)',
        'soft-xl': '0 20px 60px -15px rgba(30, 58, 95, 0.15)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
