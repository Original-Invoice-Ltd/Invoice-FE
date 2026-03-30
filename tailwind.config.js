/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter Tight', 'sans-serif'],
        'inter-tight': ['Inter Tight', 'sans-serif'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    // Enable custom utilities
  },
  // Add custom utilities
  safelist: [],
  // Custom layer for hiding scrollbars
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter Tight', 'sans-serif'],
        'inter-tight': ['Inter Tight', 'sans-serif'],
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      }
      addUtilities(newUtilities)
    }
  ],
}