import type { Config } from "tailwindcss";

// Token source of truth: docs/raaha-design-system.md
// Deviations from that doc are bugs. No bespoke hexes in components.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    // Override default spacing with an 8px grid. Numeric keys map to
    // the design-system space tokens: key * 4px, so space.2 = 8px, space.6 = 24px, etc.
    // We keep only the steps the design system names to discourage off-grid values.
    spacing: {
      0: "0px",
      px: "1px",
      0.5: "2px",
      1: "4px",
      2: "8px", // space.2
      3: "12px", // space.3
      4: "16px", // space.4
      5: "20px",
      6: "24px", // space.6
      7: "28px",
      8: "32px", // space.8
      10: "40px",
      12: "48px", // space.12
      14: "56px",
      16: "64px",
      20: "80px",
      24: "96px",
    },
    extend: {
      colors: {
        canvas: "#F6F2EC", // bg.canvas — warm limestone
        surface: {
          DEFAULT: "#FFFFFF", // bg.surface
          warm: "#FBF7F1", // bg.surface.warm
        },
        ink: {
          primary: "#1C1A16",
          secondary: "#5E574D",
          tertiary: "#938A7E",
        },
        line: {
          hairline: "#E5DED3",
        },
        accent: {
          primary: "#2A5A4E",
          "primary-soft": "#E8EFEC",
          ink: "#C9A96E",
        },
        state: {
          confirm: "#2A5A4E",
          caution: "#B85830",
          muted: "#938A7E",
        },
        raaha: {
          tight: "#C17A3E",
          "mid-warm": "#D9B07C",
          "mid-cool": "#A8BFB4",
          clear: "#7FA89E",
        },
      },
      fontFamily: {
        // Loaded via globals.css from Google Fonts
        sans: [
          "Google Sans Flex",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        arabic: ["Tajawal", "system-ui", "sans-serif"],
      },
      fontSize: {
        // [size, lineHeight] per design-system §Typography
        display: ["32px", "40px"],
        heading: ["22px", "30px"],
        "body-lg": ["18px", "28px"],
        body: ["16px", "24px"],
        caption: ["13px", "18px"],
        micro: ["11px", "16px"],
      },
      fontWeight: {
        regular: "400",
        medium: "500",
        semibold: "600",
      },
      borderRadius: {
        sm: "6px", // radius.sm — chips, inline inputs
        md: "12px", // radius.md — cards, artefact blocks
        lg: "20px", // radius.lg — swipe prompt container
      },
      boxShadow: {
        sm: "0 1px 2px rgba(28, 26, 22, 0.04)",
        md: "0 4px 12px rgba(28, 26, 22, 0.06)",
      },
      maxWidth: {
        // 390px is the iPhone 15 Pro design width; we scope the app to that.
        mobile: "390px",
      },
      // Shimmer used by Skeleton — horizontal gradient sweep on hairline.
      // The gradient itself is applied inline because its mid-stop
      // (rgba(229,222,211,0.5)) doesn't fit cleanly in the token system.
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        shimmer: "shimmer 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
