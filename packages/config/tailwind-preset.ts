import type { Config } from "tailwindcss";

export const eumetiseTailwindPreset: Config = {
  theme: {
    extend: {
      colors: {
        base: { black: "#000000", white: "#FFFFFF", cream: "#F6F4F2" },
        gray: {
          50: "#F1F1F1",
          100: "#E2E2E2",
          200: "#C6C6C6",
          300: "#ABABAB",
          400: "#919191",
          500: "#777777",
          600: "#5E5E5E",
          700: "#444444",
          800: "#2E2E2E",
          900: "#1A1A1A",
        },
        accent: {
          50: "#F7F9FE",
          100: "#EAFAFD",
          200: "#D5E3FA",
          300: "#C4D9F8",
          400: "#ADCBF6",
          500: "#94BEF4",
        },
        secondary1: {
          50: "#F5FBF0",
          100: "#F0FAE7",
          200: "#E0F5CB",
          300: "#D3EEB6",
          400: "#CBE5AF",
          500: "#C3DCA8",
        },
        secondary2: {
          50: "#F6F2F7",
          100: "#EEE7F0",
          200: "#E3D7E6",
          300: "#D6C6DA",
          400: "#C9B5CD",
          500: "#B9A2BD",
        },
        info: {
          50: "#F5F5F4",
          100: "#EBEBE9",
          200: "#E1E1DF",
          300: "#BFBFBB",
          400: "#6D6D69",
          500: "#343421",
        },
        warning: {
          50: "#FFFBF2",
          100: "#FEF3D9",
          200: "#FCE4A8",
          300: "#FAD37A",
          400: "#F7B948",
          500: "#C17C16",
        },
        success: {
          50: "#F5FAF5",
          100: "#E1F6E3",
          200: "#D8F2DD",
          300: "#AAE3BA",
          400: "#6FBF8E",
          500: "#235C3F",
        },
        error: {
          50: "#FCF9F7",
          100: "#FAE9E4",
          200: "#F8E1DC",
          300: "#F1B5AF",
          400: "#E07A7A",
          500: "#6C262C",
        },
      },
      fontFamily: {
        "haas-disp": ['"Haas Grot Disp Trial"', "sans-serif"],
        "haas-text": ['"Haas Grot Text Trial"', "sans-serif"],
        "ibm-plex": ['"IBM Plex Sans"', "sans-serif"],
        "urbanist": ['var(--font-urbanist)', "sans-serif"],
        sofia: ['"Sofia"', "cursive"],
      },
      fontSize: {
        "hero-title": ["42px", { lineHeight: "1.1", fontWeight: "700" }],
        "hero-subtitle": ["36px", { lineHeight: "1.2", fontWeight: "700" }],
        "page-heading": ["32px", { lineHeight: "1.25", fontWeight: "700" }],
        "sub-heading": ["24px", { lineHeight: "1.35", fontWeight: "600" }],
        "section-header": ["20px", { lineHeight: "1.4", fontWeight: "400" }],
        "body-text": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        caption: ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "screen-title": ["40px", { lineHeight: "1.2", fontWeight: "500" }], // Keeping existing for backward compat if needed, or remove? I'll keep them for safety for now but add new ones from user request.
        "section-title": ["40px", { lineHeight: "1.25", fontWeight: "500" }],
        "widget-value": ["30px", { lineHeight: "1.3", fontWeight: "500" }],
        "widget-label": ["15px", { lineHeight: "1.4", fontWeight: "500" }],
        "body-large": ["16px", { lineHeight: "1.5", fontWeight: "500" }],
        "body": ["14px", { lineHeight: "1.5", fontWeight: "500" }],
        "caption-sm": ["12px", { lineHeight: "1.4", fontWeight: "500" }], // renamed old caption to avoid conflict
      },
    },
  },
  plugins: [],
};

export default eumetiseTailwindPreset;
