/** @type {import('tailwindcss').Config} */
import { animations, keyframes } from './config/animations.js';

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
        'mobile-medium': '375px',
        'mobile-large': '480px',
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
        'max-h-xl': { 'raw': '(max-height: 1280px)' },
        // Combined width and height breakpoints
        'mobile-small-height': { 'raw': '(max-width: 479px) and (max-height: 799px)' },
        'tablet-small-height': { 'raw': '(min-width: 768px) and (max-height: 650px)' },
        'tablet-xsmall-height': { 'raw': '(min-width: 768px) and (max-height: 550px)' }
      },
      animation: animations,
      keyframes: keyframes,
      colors: {
        brand: {
          primary: "#081022", // Liberty Blue
          secondary: "#11A4F4", // Dodger Blue
          tertiary: "#FDFEFF" // Ice White
        },
        bodyText: "#626262",
        blueDark: "#000310",
        blueExtraLight: "#CCE6F2",
        blueGradient: "#002556"
      },
    },
  },
  plugins: [],
};
