
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        violet: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        slateBlue: "#6d6be4",
        mildBlue: "#b0c4fa",
        pinkAccent: "#ee99c2",
      },
      boxShadow: {
        dashboard: "0 4px 32px 0 rgba(80, 61, 144, 0.06)",
        card: "0 2px 12px 0 rgba(160, 130, 190, 0.07)",
      },
      backgroundImage: {
        'main-gradient': 'linear-gradient(90deg, #e0e7ff 0%, #f8fafc 100%)',
        'main-gradient-dark': 'linear-gradient(90deg, #201c31 0%, #22192c 100%)'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
