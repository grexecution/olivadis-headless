import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        primary: {
          DEFAULT: '#1C4220', // OLIVADIS-GRÜN (Main brand green)
          dark: '#0B180C',    // Darker shade for text
          light: '#3B6912',   // Accent green
        },
        cream: {
          DEFAULT: '#F2E9DB', // OLIVADIS_COLOR-2 (Main cream)
          light: '#FCFBF7',   // OLIVADIS_SOFT-WHITE (Soft white/cream)
        },
        // Semantic Colors
        background: '#FCFBF7',
        foreground: '#1C4220',
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
      fontSize: {
        // Display & Headings - Responsive for mobile
        'display': ['48px', { lineHeight: '1.1', letterSpacing: '-1.92px', fontWeight: '700' }],
        'display-lg': ['88px', { lineHeight: '80.655px', letterSpacing: '-3.52px', fontWeight: '700' }],
        'h1': ['40px', { lineHeight: '1.1', letterSpacing: '-1.6px', fontWeight: '700' }],
        'h1-lg': ['88px', { lineHeight: '80.655px', letterSpacing: '-3.52px', fontWeight: '700' }],
        'h2': ['32px', { lineHeight: '1.2', letterSpacing: '-1.28px', fontWeight: '700' }],
        'h2-lg': ['52px', { lineHeight: '58px', letterSpacing: '-2.24px', fontWeight: '700' }],
        'h3': ['24px', { lineHeight: '1.2', letterSpacing: '-0.48px', fontWeight: '700' }],
        'h3-lg': ['26.642px', { lineHeight: '1.2', letterSpacing: '-0.5328px', fontWeight: '700' }],
        'h4': ['20px', { lineHeight: '1.3', letterSpacing: '-0.4px', fontWeight: '700' }],
        'h4-lg': ['24px', { lineHeight: '1.3', letterSpacing: '-0.48px', fontWeight: '700' }],

        // Body Text
        'body-lg': ['20px', { lineHeight: '1.5', letterSpacing: '-0.4px', fontWeight: '500' }],
        'body': ['16px', { lineHeight: '1.5', letterSpacing: '-0.32px', fontWeight: '400' }],
        'body-sm': ['13.321px', { lineHeight: '1.4', letterSpacing: '-0.2664px', fontWeight: '500' }],

        // Special
        'price': ['24px', { lineHeight: '1.2', letterSpacing: '-0.48px', fontWeight: '700' }],
        'button': ['16.127px', { lineHeight: '1', letterSpacing: '-0.3225px', fontWeight: '700' }],
      },
      spacing: {
        '0.5': '2px',
        '1': '4px',
        '1.5': '6px',
        '2': '8px',
        '2.5': '10px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '14': '56px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
        '28': '112px',
        '32': '128px',
      },
      borderRadius: {
        'none': '0',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 20px 18.9px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',   // 16px
          sm: '1.5rem',      // 24px
          md: '2rem',        // 32px
          lg: '2rem',        // 32px
          xl: '2rem',        // 32px
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1200px',      // Max content width
          '2xl': '1200px',   // Keep consistent max-width
        },
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        'slide-up': 'slide-up 0.3s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
