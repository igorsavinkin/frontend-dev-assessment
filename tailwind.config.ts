import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [heroui()],
} satisfies Config;

export default config;
