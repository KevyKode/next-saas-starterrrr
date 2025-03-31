// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default { // Use 'export default' instead of 'module.exports'
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // Keep if you have a pages dir
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // Add other paths if needed
  ],
  theme: {
    extend: {
      // Your theme extensions here
    },
  },
  plugins: [
    // Your plugins here (ensure they are v4 compatible)
    // If you were using 'tailwindcss-animate', it's often built-in or handled differently in v4.
    // Check Tailwind v4 docs for animation.
  ],
}