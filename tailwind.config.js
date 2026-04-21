/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F5D45E',
          dark: '#B8860B',
        },
        teal: {
          DEFAULT: '#0ABFBC',
          dark: '#07878A',
          light: '#C8F5F4',
        },
        rose: {
          brand: '#FF6B9D',
          bright: '#FF3D7F',
        },
        dark: {
          DEFAULT: '#0A0A0F',
          2: '#12121A',
          3: '#1C1C2E',
          card: '#16162A',
        },
      },
      fontFamily: {
        sans: ['Kanit', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
        kanit: ['Kanit', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #D4AF37, #F5D45E)',
        'gradient-teal': 'linear-gradient(135deg, #0ABFBC, #07878A)',
        'gradient-rose': 'linear-gradient(135deg, #FF6B9D, #FF3D7F)',
        'gradient-premium': 'linear-gradient(135deg, #D4AF37, #0ABFBC, #FF6B9D)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease both',
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s infinite',
        'slide-up': 'slideUp 0.3s ease',
        'grad-move': 'gradMove 4s ease infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212,175,55,0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(212,175,55,0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        gradMove: {
          '0%': { backgroundPosition: '0%' },
          '50%': { backgroundPosition: '100%' },
          '100%': { backgroundPosition: '0%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'gold': '0 6px 25px rgba(212,175,55,0.4)',
        'gold-lg': '0 10px 40px rgba(212,175,55,0.5)',
        'teal': '0 6px 25px rgba(10,191,188,0.4)',
        'premium': '0 20px 60px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
