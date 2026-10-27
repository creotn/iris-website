import localFont from "next/font/local";

const ArabicFont = localFont({
  src: [
    { path: "./fonts/Tajawal-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Tajawal-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Tajawal-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/Tajawal-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
  display: "swap",
  variable: "--font-ar",
});

const LatinFont = localFont({
  src: "./fonts/Roboto-latin.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-en",
});

const MonoFont = localFont({
  src: "./fonts/JetBrainsMono-latin.woff2",
  weight: "100 800",
  display: "swap",
  variable: "--font-mono",
  adjustFontFallback: false,
  fallback: ["monospace"],
});

export { ArabicFont, LatinFont, MonoFont };
