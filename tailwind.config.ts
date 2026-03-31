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
        surface: {
          DEFAULT: "#1a1a1f",
          1: "#22222a",
          2: "#2a2a35",
          3: "#323240",
        },
        accent: {
          amber: "#f59e0b",
          cyan: "#06b6d4",
          violet: "#8b5cf6",
          emerald: "#10b981",
          rose: "#f43f5e",
          sky: "#0ea5e9",
          orange: "#f97316",
          lime: "#84cc16",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
