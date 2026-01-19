/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#A4005D",
        brandSoft: "#C44A87",

        bgPrimary: "#F6EADB",
        bgSecondary: "#EFE1CF",

        textPrimary: "#1F1F1F",
        textMuted: "#6B6B6B",
      },
      borderRadius: {
        xl: "20px",
        card: "16px",
      },
    },
  },
};
