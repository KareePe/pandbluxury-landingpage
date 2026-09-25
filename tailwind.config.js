/** @type {import('tailwindcss').Config} */
// ต้องตรงกับ class ที่ใช้ใน index.html — build ด้วย `npm run build:css` → assets/tailwind.css
module.exports = {
  content: ["./index.html", "./assets/script.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans Thai", "sans-serif"],
      },
      colors: {
        black: "#0c0e10",
        brand: {
          gold: "#9A7950",
          cream: "#F7F1E9",
          dark: "#0c0e10",
        },
      },
      boxShadow: {
        soft: "0 10px 35px rgba(0,0,0,.06)",
      },
    },
  },
  plugins: [],
};
