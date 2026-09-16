/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Enlazamos las variables CSS que creamos en el layout
        sans: ['var(--font-inter)', 'sans-serif'],
        title: ['var(--font-cinzel)', 'serif'],
      },
    },
  },
  plugins: [],
};
