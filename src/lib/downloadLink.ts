import { APP_STORE_URL, PLAY_STORE_URL } from "@/config/stores";

export interface StoreUrls {
  ios: string;
  android: string;
}

/** The download link, plus its old per-language addresses so links already shared keep working. */
export const DOWNLOAD_PATH = /^\/(?:(?:ar|en)\/)?download\/?$/;

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

/** Read per call, not at import, so tests can change the env. A missing or invalid value uses the built-in link. */
export function getStoreUrls(): StoreUrls {
  return {
    ios: validStoreUrl(process.env.NEXT_PUBLIC_APP_STORE_URL) ?? APP_STORE_URL,
    android: validStoreUrl(process.env.NEXT_PUBLIC_PLAY_STORE_URL) ?? PLAY_STORE_URL,
  };
}

// Device names only: nearly every browser's user agent contains "AppleWebKit", so "Apple" alone won't do.
// Macintosh also covers iPads, which ask for desktop sites by default and report a Mac user agent.
const APPLE_DEVICE = /iPhone|iPad|iPod|Macintosh|AppleTV|Apple Watch/i;

/** Where `/download` sends a visitor: Apple devices to the App Store, everything else to Google Play. */
export function resolveStoreRedirect(userAgent: string | null | undefined, urls: StoreUrls = getStoreUrls()): string {
  return APPLE_DEVICE.test(userAgent ?? "") ? urls.ios : urls.android;
}
