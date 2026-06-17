/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      colors: {
        clay: {
          50: '#FBF5F0',
          100: '#F5E6D8',
          200: '#ECC9AB',
          300: '#E0A678',
          400: '#D97757',
          500: '#C95A3D',
          600: '#AC4530',
          700: '#8A372A',
          800: '#6E2E26',
          900: '#5A2722',
        },
        sand: {
          50: '#FDFAF6',
          100: '#F5EFE6',
          200: '#EADFCF',
          300: '#DCC9AD',
          400: '#CBAE87',
          500: '#BD956A',
          600: '#AF7D52',
          700: '#926544',
          800: '#76523B',
          900: '#604533',
        },
        forest: {
          50: '#F2F7F4',
          100: '#DDEBE1',
          200: '#BCD8C4',
          300: '#92BEA0',
          400: '#5B8A72',
          500: '#427059',
          600: '#335A47',
          700: '#2A483A',
          800: '#233B30',
          900: '#1D3129',
        },
        pottery: '#8B6F47',
        floral: '#E8B4B8',
        candle: '#D4A574',
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', 'Georgia', 'serif'],
        sans: ['"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(139, 111, 71, 0.08)',
        'card': '0 8px 30px rgba(139, 111, 71, 0.12)',
        'hover': '0 12px 40px rgba(139, 111, 71, 0.18)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
