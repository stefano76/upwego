/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      screens: {
        // Custom breakpoints
        'mobile': '360px',
        'tablet': '768px',
        'desktop': '1024px',
        'small': '1280px',
        'medium': '1440px',
        'medium-large': '1600px',
        'large': '1920px',
        // Max-height breakpoints
        'max-h-sm': { 'raw': '(max-height: 640px)' },
        'max-h-md': { 'raw': '(max-height: 768px)' },
        'max-h-lg': { 'raw': '(max-height: 1024px)' },
        'max-h-xl': { 'raw': '(max-height: 1280px)' }
      },
        animation: {
          'u-combined': 'fadeInDown 5s ease-in-out forwards 2s, pulseOpacity 10s ease-in-out infinite 7s',
          'header-in': 'fadeIn 3s ease-in-out forwards 1s',
          'fade-in-delayed': 'fadeIn 3s ease-in-out forwards 2s',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          fadeInDown: {
            '0%': { opacity: '0', transform: 'translateY(-20%)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          pulseOpacity: {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0.5' },
          }
        },
      colors: {
        brand: {
          primary: "#081022", // Liberty Blue
          secondary: "#11A4F4", // Dodger Blue
          tertiary: "#FDFEFF" // Ice White
        },
        about_strips: {
          outline1: "#1091D8", // Most external
          outline2: "#27ACF3", // Middle
          outline3: "#58BEF5", // Inner
          outline4: "#D7EFFC" // Most internal
        }
      },
    },
  },
  plugins: [],
};
