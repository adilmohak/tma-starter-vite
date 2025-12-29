import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        iphone: "hsl(var(--iphone))",
        border: {
          DEFAULT: "hsl(var(--border))",
        },
        background: {
          DEFAULT: "hsl(var(--background))",
          50: "var(--background-50)",
          25: "var(--background-25)",
          80: "var(--background-80)",
        },
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        // "muted-foreground": "hsl(var(--secondary))",
        destructive: "hsl(var(--destructive))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--secondary))",
          light: "hsl(var(--muted-light))",
        },
        header: "hsl(var(--header))",
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--button-text))",
          dark: "hsl(var(--accent-dark))",
          900: "hsl(var(--accent-dark-900))",
        },
        link: "hsl(var(--link))",
        hint: "hsl(var(--hint))",
        button: {
          DEFAULT: "hsl(var(--button))",
          text: "hsl(var(--button-text))",
          muted: "var(--button-muted)",
          opacity: "hsl(var(--button-opacity))",
        },
        stars: {
          DEFAULT: "var(--stars)",
          dark: "var(--stars-dark)",
          light: "var(--stars-light)",
        },
        popover: "hsl(var(--muted))",
        "popover-foreground": "hsl(var(--primary))",
      },
      fontFamily: {
        sans: [
          "Jost",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        zoom: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
          "100%": { transform: "scale(1)" },
        },
        wave: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        waveFlag: {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-4px)",
          },
        },
        "arrow-bounce-side": {
          "0%, 100%": {
            transform: "translateX(0)",
          },
          "50%": {
            transform: "translateX(4px)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-in-out",
        zoom: "zoom 1s infinite",
        "bounce-slow": "bounce 3s infinite",
        "spin-slow": "spin 4s linear infinite",
        wave: "wave 3s linear infinite",
        "wave-delayed": "wave 3s linear 1.5s infinite",
        "wave-effect": "waveFlag 1.3s ease-in-out infinite",
        "arrow-bounce-side": "arrow-bounce-side 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
