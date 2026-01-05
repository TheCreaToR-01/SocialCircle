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
          DEFAULT: '#064E3B',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#ECFDF5',
          foreground: '#064E3B',
        },
        accent: {
          DEFAULT: '#BEF264',
          foreground: '#022C22',
        },
        background: '#FFFFFF',
        foreground: '#0F172A',
        muted: '#F1F5F9',
        border: '#E2E8F0',
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
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
