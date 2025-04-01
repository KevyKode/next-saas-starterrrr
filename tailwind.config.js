// File: tailwind.config.js (Reverted to v3)
/** @type {import('tailwindcss').Config} */
module.exports = { // Use module.exports
  // darkMode: 'class', // REMOVE this for v3 (or keep if you prefer explicit class strategy)
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}', 
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
       // Your theme extensions (colors, fontFamily, keyframes, animation)
       // Ensure keyframes/animation are defined correctly for v3 if using animate plugin
       colors: {
         border: "hsl(var(--border))",
         input: "hsl(var(--input))",
         ring: "hsl(var(--ring))",
         background: "hsl(var(--background))",
         foreground: "hsl(var(--foreground))",
         primary: {
           DEFAULT: "hsl(var(--primary))",
           foreground: "hsl(var(--primary-foreground))",
         },
         secondary: {
           DEFAULT: "hsl(var(--secondary))",
           foreground: "hsl(var(--secondary-foreground))",
         },
         destructive: {
           DEFAULT: "hsl(var(--destructive))",
           foreground: "hsl(var(--destructive-foreground))",
         },
         muted: {
           DEFAULT: "hsl(var(--muted))",
           foreground: "hsl(var(--muted-foreground))",
         },
         accent: {
           DEFAULT: "hsl(var(--accent))",
           foreground: "hsl(var(--accent-foreground))",
         },
         popover: {
           DEFAULT: "hsl(var(--popover))",
           foreground: "hsl(var(--popover-foreground))",
         },
         card: {
           DEFAULT: "hsl(var(--card))",
           foreground: "hsl(var(--card-foreground))",
         },
         // Add ITT colors if you want direct utilities like bg-itt-purple
         'itt-purple': 'hsl(var(--itt-purple-hsl))',
         'itt-silver': 'hsl(var(--itt-silver-hsl))',
         'itt-dark-purple': '#18061e',
         'itt-dark-blue': '#051530',
         'itt-background': '#09090F',
         'itt-card-bg': '#121217',
         'itt-card-active': '#15121e',
       },
       borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
       },
       // Add keyframes/animations if using tailwindcss-animate
       keyframes: {
         // Example from animate plugin
         "accordion-down": {
           from: { height: "0" },
           to: { height: "var(--radix-accordion-content-height)" },
         },
         "accordion-up": {
           from: { height: "var(--radix-accordion-content-height)" },
           to: { height: "0" },
         },
         // Your custom keyframes like cosmic-shift
         'cosmic-shift': {
           '0%, 100%': { backgroundPosition: '0% 50%' },
           '50%': { backgroundPosition: '100% 50%' },
         }
       },
       animation: {
         // Example from animate plugin
         "accordion-down": "accordion-down 0.2s ease-out",
         "accordion-up": "accordion-up 0.2s ease-out",
         // Your custom animations
         'cosmic-shift-15': 'cosmic-shift 15s ease infinite',
         'cosmic-shift-10': 'cosmic-shift 10s ease infinite',
         'cosmic-shift-8': 'cosmic-shift 8s ease infinite',
       },
    },
  },
  plugins: [
     require("tailwindcss-animate"), // Add back the animate plugin
     // Add other v3 plugins
  ],
}
