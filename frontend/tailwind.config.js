/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          primary: '#FFD700',
          light: '#FFF8DC',
          dark: '#B8860B'
        },
        beige: {
          light: '#F5F5DC',
          dark: '#E6E6D1'
        },
        bronze: {
          primary: '#CD7F32',
          light: '#D4A574',
          dark: '#A0522D'
        }
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'pt-sans': ['PT Sans', 'sans-serif']
      },
      animation: {
        'gold-shimmer': 'shimmer 2s ease-in-out infinite',
        'price-up': 'priceUp 0.5s ease-out',
        'price-down': 'priceDown 0.5s ease-out'
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 }
        },
        priceUp: {
          '0%': { color: '#10B981', transform: 'scale(1)' },
          '50%': { color: '#10B981', transform: 'scale(1.1)' },
          '100%': { color: '#10B981', transform: 'scale(1)' }
        },
        priceDown: {
          '0%': { color: '#EF4444', transform: 'scale(1)' },
          '50%': { color: '#EF4444', transform: 'scale(1.1)' },
          '100%': { color: '#EF4444', transform: 'scale(1)' }
        }
      }
    },
  },
  plugins: [],
} 