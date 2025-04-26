m;
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // v4 will auto-scan your module graph, but you can still lock down paths:
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  safelist: ["text-3xl"],
  theme: {
    /* any theme extensions here */
  },
  plugins: [],
};
