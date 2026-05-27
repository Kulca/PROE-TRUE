import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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
        serif: ["DM Serif Display", "serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        lg: "16px",
        full: "9999px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)",
        "card-hover": "0 2px 8px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.10)",
      },
      transitionDuration: {
        DEFAULT: "200ms",
        reveal: "300ms",
        page: "400ms",
      },
    },
  },
  plugins: [],
};
export default config;