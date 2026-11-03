export interface StoreUrls {
  ios: string | null;
  android: string | null;
}

export type StorePlatform = keyof StoreUrls;

/** iPadOS 13+ Safari reports a desktop Mac user agent, so a "Mac" with a touch screen is an iPad. */
export function detectPlatform(userAgent: string, maxTouchPoints = 0): StorePlatform | null {
  if (/Android/i.test(userAgent)) return "android";
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
  if (/Macintosh/.test(userAgent) && maxTouchPoints > 1) return "ios";
  return null;
}

/** A store link is only usable if it parses and is https; anything else counts as "not configured". */
export function validStoreUrl(raw: string | undefined | null): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw.trim());
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

/** Read per call, not at import, so tests can change the env. Next inlines the NEXT_PUBLIC_* values at build. */
export function getStoreUrls(): StoreUrls {
  return {
    ios: validStoreUrl(process.env.NEXT_PUBLIC_APP_STORE_URL),
    android: validStoreUrl(process.env.NEXT_PUBLIC_PLAY_STORE_URL),
  };
}

// Device names only: nearly every browser's user agent contains "AppleWebKit", so "Apple" alone won't do.
// Macintosh also covers iPads, which ask for desktop sites by default and report a Mac user agent.
const APPLE_DEVICE = /iPhone|iPad|iPod|Macintosh|AppleTV|Apple Watch/i;

/**
 * Where `/download` sends a visitor: Apple devices to the App Store, everything else to Google Play.
 * Null if that store isn't configured, so they get the page rather than a broken link or the wrong store.
 */
export function resolveStoreRedirect(
  userAgent: string | null | undefined,
  urls: StoreUrls = getStoreUrls(),
): string | null {
  return APPLE_DEVICE.test(userAgent ?? "") ? urls.ios : urls.android;
}
