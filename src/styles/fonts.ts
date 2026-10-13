import { JetBrains_Mono, Roboto, Tajawal } from "next/font/google";

const ArabicFont = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  variable: "--font-ar",
});

const LatinFont = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  variable: "--font-en",
});

// JetBrains Mono has no Arabic glyphs; without the Arial-metric fallback Next adds by default,
// Arabic in mono labels falls through to the system monospace face, as the brand design intends.
const MonoFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
  adjustFontFallback: false,
  fallback: ["monospace"],
});

export { ArabicFont, LatinFont, MonoFont };
