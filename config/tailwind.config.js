/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#111827", // Dark Slate (Text/Primary Buttons)
        secondary: "#f9fafb", // Very Light Gray (Background)
        accent: "#3b82f6", // Bright Blue (Accents)
        surface: "#ffffff", // Pure White (Cards/Modals)
        border: "#e5e7eb", // Light Border
        muted: "#6b7280", // Muted Text
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
