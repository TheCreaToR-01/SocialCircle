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
          DEFAULT: '#F8FAFC',
          foreground: '#0A1628',
        },
        accent: {
          DEFAULT: '#FF6B6B',
          foreground: '#FFFFFF',
        },
        coral: {
          50: '#FFF5F5',
          100: '#FFE3E3',
          200: '#FFC9C9',
          300: '#FFA8A8',
          400: '#FF8787',
          500: '#FF6B6B',
          600: '#FA5252',
          700: '#F03E3E',
          800: '#E03131',
          900: '#C92A2A',
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
        sans: ['Nunito', 'sans-serif'],
        heading: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        'full': '9999px',
      },
      boxShadow: {
        'playful': '0 10px 40px -10px rgba(10, 22, 40, 0.2)',
        'playful-lg': '0 20px 60px -15px rgba(10, 22, 40, 0.25)',
        'glow': '0 0 40px rgba(255, 107, 107, 0.3)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
