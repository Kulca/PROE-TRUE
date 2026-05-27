import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#FAFAF8",
          secondary: "#F5F4F0",
          card: "#FFFFFF",
        },
        text: {
          primary: "#1A1A1A",
          secondary: "#6B6B6B",
          muted: "#9B9B9B",
        },
        accent: {
          primary: "#D4772C",
          secondary: "#2C4B7D",
        },
        success: "#2D8B4E",
        warning: "#E5A83B",
        error: "#C44536",
        border: "#E8E6E1",
      },
      fontFamily: {
        serif: ["var(--font-dm-serif-display)"],
        sans: ["var(--font-inter)"],
        mono: ["var(--font-jetbrains-mono)"],
      },
      borderRadius: {
        subtle: "4px",
        card: "8px",
        modal: "16px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)",
        "card-hover": "0 2px 8px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.12)",
      },
      animation: {
        reveal: "reveal 300ms ease-out",
        page: "page 400ms ease-out",
      },
      keyframes: {
        reveal: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        page: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
// frontend
