import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1f1f1f",
        forest: "#2b2b2b",
        leaf: "#e30613",
        blush: "#fee2e2",
        sprout: "#059669",
        mist: "#f5f5f5",
        line: "#e5e7eb",
      },
      boxShadow: {
        card: "0 10px 32px rgba(31, 31, 31, .07)",
      },
    },
  },
  plugins: [],
} satisfies Config;
