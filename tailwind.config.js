/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Sky Blue palette (primary theme color)
        'sky': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',  // Primary sky blue
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Cream palette (secondary theme color - light cream)
        'cream': {
          50: '#fffffd',   // Lightest cream
          100: '#fefcf6',  // Very light cream
          200: '#fcf8f0',  // Light cream
          300: '#faf4e9',  // Medium cream
          400: '#f8f0e3',  // Slightly darker cream
          500: '#f6ecdd',  // Base cream
          600: '#f4e8d7',
          700: '#f2e4d1',
          800: '#f0e0cb',
          900: '#eedcc5',
        },
        // Amexan brand colors
        'amexan': {
          'sky': '#0ea5e9',      // Primary brand color
          'cream': '#fefcf6',    // Light cream background
          'white': '#ffffff',    // Pure white for contrast
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0)' },
          '50%': { transform: 'translateY(-15px) translateX(5px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(40px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-sky-cream': 'linear-gradient(135deg, #0ea5e9 0%, #fefcf6 100%)',
        'gradient-sky-overlay': 'linear-gradient(to bottom, rgba(14, 165, 233, 0.88) 0%, rgba(14, 165, 233, 0.75) 100%)',
      },
    },
  },
  plugins: [],
}