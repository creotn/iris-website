import localFont from "next/font/local";

// Self-hosted (licences in ./fonts): next/font/google downloads at compile time, and when Google is
// unreachable — no network in a Docker build, or a broken IPv6 route, which Turbopack doesn't fall
// back from — it silently swaps in a system font, so the site lost its Arabic typeface.

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

// The variable latin cut covers every weight the site uses (400–900).
const LatinFont = localFont({
  src: "./fonts/Roboto-latin.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-en",
});

// JetBrains Mono has no Arabic glyphs; without the Arial-metric fallback Next adds by default,
// Arabic in mono labels falls through to the system monospace face, as the brand design intends.
const MonoFont = localFont({
  src: "./fonts/JetBrainsMono-latin.woff2",
  weight: "100 800",
  display: "swap",
  variable: "--font-mono",
  adjustFontFallback: false,
  // Used by one account label: not worth a preload on every page.
  preload: false,
  fallback: ["monospace"],
});

export { ArabicFont, LatinFont, MonoFont };
