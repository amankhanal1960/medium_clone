import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        customBackground: "rgba(247, 244, 237, 1)",
      },
    },
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none", // IE and Edge
          "scrollbar-width": "none", // Firefox
        },
      });
    }),
  ],
} satisfies Config;
