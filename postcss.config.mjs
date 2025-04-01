// File: postcss.config.mjs (Corrected for Tailwind v3)
export default {
  plugins: {
    tailwindcss: {}, // <-- Changed from '@tailwindcss/postcss'
    autoprefixer: {}, // <-- Added autoprefixer (standard for v3)
  },
};
