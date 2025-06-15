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
        playfair: ['Playfair Display', 'serif'],
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
        // Add the following mappings to enable classes like bg-background, text-foreground, etc.
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        card: "hsl(var(--card) / <alpha-value>)",
        "card-foreground": "hsl(var(--card-foreground) / <alpha-value>)",
        popover: "hsl(var(--popover) / <alpha-value>)",
        "popover-foreground": "hsl(var(--popover-foreground) / <alpha-value>)",
        primary: "hsl(var(--primary) / <alpha-value>)",
        "primary-foreground": "hsl(var(--primary-foreground) / <alpha-value>)",
        secondary: "hsl(var(--secondary) / <alpha-value>)",
        "secondary-foreground": "hsl(var(--secondary-foreground) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        "muted-foreground": "hsl(var(--muted-foreground) / <alpha-value>)",
        accent: "hsl(var(--accent) / <alpha-value>)",
        "accent-foreground": "hsl(var(--accent-foreground) / <alpha-value>)",
        destructive: "hsl(var(--destructive) / <alpha-value>)",
        "destructive-foreground": "hsl(var(--destructive-foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        "sidebar-background": "hsl(var(--sidebar-background) / <alpha-value>)",
        "sidebar-foreground": "hsl(var(--sidebar-foreground) / <alpha-value>)",
        "sidebar-primary": "hsl(var(--sidebar-primary) / <alpha-value>)",
        "sidebar-primary-foreground": "hsl(var(--sidebar-primary-foreground) / <alpha-value>)",
        "sidebar-accent": "hsl(var(--sidebar-accent) / <alpha-value>)",
        "sidebar-accent-foreground": "hsl(var(--sidebar-accent-foreground) / <alpha-value>)",
        "sidebar-border": "hsl(var(--sidebar-border) / <alpha-value>)",
        "sidebar-ring": "hsl(var(--sidebar-ring) / <alpha-value>)",
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
