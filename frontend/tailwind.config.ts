import type { Config } from "tailwindcss";

// Design tokens for the Smart Restaurant SaaS
// Palette: a food-appetite-driven warm orange (not the generic Tailwind
// orange-500) paired with a near-black charcoal and a soft cream — matches
// the brief's Orange / White / Dark Gray direction without defaulting to
// stock hex values.
const colors = {
  primary: {
    DEFAULT: "#FF5A1F", // tangerine — the brand's signature action color
    dark: "#E1470F",
    light: "#FF8A54",
  },
  gold: {
    DEFAULT: "#FFB020", // secondary accent for gradients (sunset: tangerine -> gold)
  },
  charcoal: {
    DEFAULT: "#1B1A1E", // near-black dark gray for dark sections / dashboard sidebar
    soft: "#2B2A30",
  },
  cream: "#FFF9F4", // warm off-white background (never flat #FFFFFF for large surfaces)
  slate: {
    DEFAULT: "#57565C", // body text
    light: "#8A8890",
  },
  success: "#1FAA59",
  warning: "#F5A623",
  danger: "#E5484D",
};

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors,
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-jakarta)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "sunset-gradient": "linear-gradient(135deg, #FF5A1F 0%, #FFB020 100%)",
        "charcoal-gradient": "linear-gradient(180deg, #1B1A1E 0%, #2B2A30 100%)",
        "glow-radial": "radial-gradient(circle at 30% 20%, rgba(255,90,31,0.15), transparent 60%)",
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(27,26,30,0.08)",
        "soft-lg": "0 12px 40px -8px rgba(27,26,30,0.14)",
        glow: "0 0 0 1px rgba(255,90,31,0.15), 0 8px 30px -6px rgba(255,90,31,0.35)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255,90,31,0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(255,90,31,0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;