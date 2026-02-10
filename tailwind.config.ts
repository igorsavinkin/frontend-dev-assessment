import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [
    heroui({
      themes: {
        "member-light": {
          extend: "light",
          colors: {
            primary: {
              DEFAULT: "#2AFC98",
              foreground: "#0B2F23",
            },
          },
        },
        "member-dark": {
          extend: "dark",
          colors: {
            primary: {
              DEFAULT: "#2AFC98",
              foreground: "#0B2F23",
            },
          },
        },
        "partner-light": {
          extend: "light",
          colors: {
            primary: {
              DEFAULT: "#119DA4",
              foreground: "#041C1D",
            },
          },
        },
        "partner-dark": {
          extend: "dark",
          colors: {
            primary: {
              DEFAULT: "#119DA4",
              foreground: "#041C1D",
            },
          },
        },
      },
    }),
  ],
} satisfies Config;

export default config;
