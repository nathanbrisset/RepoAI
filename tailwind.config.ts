import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
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
      fontFamily: {
        sans: ["var(--font-geist)", "Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-dela)", "var(--font-geist)", "ui-sans-serif", "sans-serif"],
      },
      colors: {
        border: "oklch(var(--foreground) / 0.14)",
        input: "oklch(var(--foreground) / 0.18)",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background) / <alpha-value>)",
        foreground: "oklch(var(--foreground) / <alpha-value>)",
        navy: {
          DEFAULT: "oklch(var(--navy) / <alpha-value>)",
          foreground: "oklch(var(--navy-foreground) / <alpha-value>)",
        },
        cta: {
          DEFAULT: "oklch(var(--cta) / <alpha-value>)",
          foreground: "oklch(var(--cta-foreground) / <alpha-value>)",
        },
        link: "oklch(var(--link) / <alpha-value>)",
        cream: "#f6efdf",
        // Leftover utilities on older pages inherit the washi / ink / royal palette.
        gray: {
          50: "#f7f3ea",
          100: "#f3eee4",
          200: "#e6e0d4",
          300: "#cfc6b6",
          400: "#8d8494",
          500: "#6d6578",
          600: "#514c5c",
          700: "#3a3548",
          800: "#241f33",
          900: "#1a1530",
          950: "#100e20",
        },
        blue: {
          50: "#eef3ff",
          100: "#dce6ff",
          200: "#c0d2ff",
          300: "#93b0ff",
          400: "#5c86ff",
          500: "#3d6bff",
          600: "#2f5bff",
          700: "#2346d4",
          800: "#1d3aad",
          900: "#1c3488",
          950: "#14245e",
        },
        purple: {
          50: "#f3f6ff",
          100: "#e7edff",
          200: "#d4dffc",
          300: "#a9bff8",
          400: "#6d90f5",
          500: "#2f5bff",
          600: "#12182b",
          700: "#101628",
          800: "#0d1222",
          900: "#0a0e1a",
          950: "#070a14",
        },
        pink: {
          500: "#ff5a1f",
          600: "#e24a14",
        },
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "oklch(var(--popover) / <alpha-value>)",
          foreground: "oklch(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "oklch(var(--card) / <alpha-value>)",
          foreground: "oklch(var(--card-foreground) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) * 0.8)",
        sm: "calc(var(--radius) * 0.6)",
        xl: "calc(var(--radius) * 1.4)",
        "2xl": "calc(var(--radius) * 1.8)",
        "3xl": "calc(var(--radius) * 2.2)",
        "4xl": "calc(var(--radius) * 2.6)",
      },
      boxShadow: {
        soft: "0 10px 30px -16px rgba(18, 24, 43, 0.28)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
