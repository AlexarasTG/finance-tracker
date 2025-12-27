/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        app: "#0B1020",
        "app-soft": "#121B3A",
        surface: "#121B3A",
        "surface-elevated": "#151C40",
        "border-subtle": "#1D2848",
        "border-strong": "#2FA4C7",
        "primary-purple": "#7A3FA3",
        "primary-purple-deep": "#5A2D82",
        "accent-cyan": "#2FA4C7",
        "accent-cyan-soft": "#3BC7D4",
        "accent-magenta": "#C23DD6",
        "accent-magenta-glow": "#E06BE8",
        "accent-lavender-soft": "#C6A4E8",
        "brand-green": "#4FAF8F",
        ink: "#F9FAFF",
        "ink-soft": "#C3C7E0",
        "ink-muted": "#7C85AA",
        success: "#4FAF8F",
        danger: "#C23DD6",
      },
    },
  },
  plugins: [],
}
