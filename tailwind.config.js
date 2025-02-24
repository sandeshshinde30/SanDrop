/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], 
  theme: {
    extend: {
      colors: {
        customBlue: {
          50: "#CAF0F8",
          100: "#ADE8F4",
          200: "#90E0EF",
          300: "#48CAE4",
          400: "#00B4D8",
          500: "#0096C7",
          600: "#0077B6",
          700: "#023E8A",
          800: "#03045E",
        },
      },
    },
  },
  plugins: [],
};
