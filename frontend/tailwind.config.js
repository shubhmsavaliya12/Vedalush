/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nature: {
          50: '#FDFBF7',  // Secondary Background (Off White)
          100: '#F8F4EC', // Primary Background (Cream)
          200: '#E6DED2', // Border (Warm Sand)
          300: '#D5C4A1', // Muted Gold / Accent Border
          400: '#9D948B', // Muted Text
          500: '#B88A5A', // Primary Button
          600: '#8E7A65', // Primary Brown
          700: '#6F6A65', // Body Text
          800: '#5D4E42', // Heading Color
          900: '#5D4E42', // Deep Heading Color
          950: '#3D332B', // Deepest Warm Neutral
        },
        dark: {
          bg: '#F8F4EC',   // Primary Background
          card: '#FFFFFF', // Clean White Card
        },
        primary: {
          bg: '#F8F4EC',
          secondary: '#FDFBF7',
          card: '#FFFFFF',
          brown: '#8E7A65',
          heading: '#5D4E42',
          body: '#6F6A65',
          muted: '#9D948B',
          border: '#E6DED2',
          btn: '#B88A5A',
          'btn-hover': '#9F7348',
          footer: '#9D917A',
          accent: '#C19A6B',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 30px -5px rgba(93, 78, 66, 0.06)',
        'soft-lg': '0 16px 40px -10px rgba(93, 78, 66, 0.10)',
      },
      borderRadius: {
        'lg': '0.75rem',  // 12px
        'xl': '1rem',     // 16px
        '2xl': '1.125rem',// 18px
        '3xl': '1.5rem',
      },
      transitionDuration: {
        '250': '250ms',
      }
    },
  },
  plugins: [],
}

