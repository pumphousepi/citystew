// postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},  // ← the new standalone PostCSS plugin
    autoprefixer: {},            // ← still your autoprefixer
  },
};
