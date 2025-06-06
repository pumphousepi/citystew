// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      // Add any custom theming here if you like.
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    // If you want line-clamp as well, uncomment the next line:
    // require('@tailwindcss/line-clamp'),
  ],
};
