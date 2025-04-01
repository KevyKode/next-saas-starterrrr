// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default { 
  darkMode: 'class', // <-- Added: Enable class-based dark mode
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}', 
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Add custom theme extensions here if needed
      // Example:
      // colors: {
      //   'itt-purple': '#6e3bff', // Reference variable if needed directly
      //   'itt-silver': '#c0c0c0',
      // },
      // keyframes: {
      //   'cosmic-shift': { /* Define keyframes if needed */ }
      // },
      // animation: {
      //   'cosmic-shift': 'cosmic-shift 15s ease infinite',
      // }
    },
  },
  plugins: [
    // Add any v4-compatible plugins here
    // require('tailwindcss-react-aria-components'), // Example if using React Aria
  ],
}
