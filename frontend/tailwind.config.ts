import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pop: {
          red: "#E53935",
          orange: "#FB8C00",
          yellow: "#FDD835",
          green: "#43A047",
          blue: "#1E88E5",
        },
      },
    },
  },
  plugins: [],
};

export default config;
