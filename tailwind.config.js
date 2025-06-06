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
      // (You can add custom colors, fonts, etc. here if needed)
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    // If you use line-clamp anywhere, you can also enable that here:
    // require('@tailwindcss/line-clamp'),
  ],
};
