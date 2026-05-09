import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0E0B10",
          elev: "#1A151D",
          card: "#1F1A22",
        },
        accent: {
          DEFAULT: "#FF8FA3", // coral pink (Partiful-ish)
          warm: "#FFB37A",   // peach
          soft: "#FFE0D6",
          deep: "#E5446D",
        },
        ink: {
          DEFAULT: "#F8F4F0",
          mute: "#A89FA8",
          dim: "#766C77",
        },
        line: "#2A2330",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
      },
      boxShadow: {
        pass: "0 24px 80px -20px rgba(255, 143, 163, 0.45)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 12px 40px -16px rgba(0,0,0,0.6)",
        glow: "0 0 0 1px rgba(255, 143, 163, 0.25), 0 16px 48px -12px rgba(255, 143, 163, 0.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
