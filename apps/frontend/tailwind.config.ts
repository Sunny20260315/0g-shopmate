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
        background: "#0A192F",
        foreground: "#E6F1FF",
        primary: {
          DEFAULT: "#64FFDA",
          foreground: "#0A192F",
        },
        secondary: {
          DEFAULT: "#172A45",
          foreground: "#E6F1FF",
        },
        muted: {
          DEFAULT: "#172A45",
          foreground: "#8892B0",
        },
        accent: {
          DEFAULT: "#233554",
          foreground: "#E6F1FF",
        },
        border: "rgba(100, 255, 218, 0.1)",
        input: "#233554",
        ring: "#64FFDA",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "thinking": "thinking 1.5s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(100, 255, 218, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(100, 255, 218, 0.6)",
          },
        },
        "float": {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        "shimmer": {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },
        "thinking": {
          "0%, 100%": {
            opacity: "0.5",
          },
          "50%": {
            opacity: "1",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
