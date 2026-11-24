/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bloom: {
          green: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
          },
          pink: {
            50: '#fdf2f8',
            100: '#fce7f3',
            200: '#fbcfe8',
            300: '#f472b6',
            400: '#ec4899',
            500: '#db2777',
            600: '#be185d',
          },
          lavender: {
            50: '#f5f3ff',
            100: '#ede9fe',
            200: '#ddd6fe',
            300: '#c4b5fd',
            400: '#a78bfa',
            500: '#8b5cf6',
            600: '#7c3aed',
            700: '#6d28d9',
          },
          mint: {
            50: '#f2fbf7',
            100: '#e6f7ef',
            200: '#cbf0df',
            300: '#9fe3c5',
          },
          slate: {
            850: '#151e2e',
            900: '#0f172a',
          }
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(139, 92, 246, 0.08), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
        'soft': '0 8px 30px -4px rgba(147, 112, 219, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 16px 40px -6px rgba(139, 92, 246, 0.16), 0 8px 20px -4px rgba(0, 0, 0, 0.06)',
        'soft-pink': '0 10px 30px -5px rgba(244, 114, 182, 0.25)',
        'soft-green': '0 10px 30px -5px rgba(74, 222, 128, 0.25)',
        'soft-lavender': '0 10px 30px -5px rgba(167, 139, 250, 0.25)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}

