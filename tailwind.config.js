// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  // ↓ ここの content 配列にパスを追加します
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}