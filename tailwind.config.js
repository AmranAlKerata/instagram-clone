/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#121212",
          text: "#ffffff",
          secondary: "#1f1f1f",
          border: "#2d2d2d"
        }
      }
    }
  },
  plugins: []
};
