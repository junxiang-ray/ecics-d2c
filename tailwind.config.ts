import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  important: true,
  theme: {
    extend: {
      fontFamily: {
        primary: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#02adef',
          50: '#e6f7fd',
          100: '#bff0fb',
          200: '#99e8f9',
          300: '#4dd3f5',
          400: '#1ac3f2',
          500: '#02adef',
          600: '#0199d9',
          700: '#017bbf',
          800: '#015e9f',
          900: '#004074',
        },
        primaryBlue: '#002EFF',
        secondaryBlue: '#007AFF',
        'brand-blue': '#00ADEF',
        'plan-blue': '#b6dbfd',
        'review-blue': '#F4FBFD',
        'coupon-red': '#C80F1E',
        'green-promo': '#2ECC71',
        'red-logo': '#F4333D',
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      tablet: '640px',
      laptop: '1024px',
      desktop: '1280px',
    },
  },
  plugins: [],
};

export default config;
