export type StorePlatform = "ios" | "android";

export interface StoreUrls {
  ios: string | null;
  android: string | null;
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

/**
 * iPadOS 13+ Safari sends a desktop-Mac user agent, so it can't be told apart here; those
 * visitors get the landing page and `IpadRedirect` sends them on from the client.
 */
export function detectPlatform(userAgent: string | null | undefined): StorePlatform | null {
  if (!userAgent) return null;
  if (/Android/i.test(userAgent)) return "android";
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
  return null;
}

/** The store to send this visitor to, or null when they should see the landing page instead. */
export function resolveStoreRedirect(
  userAgent: string | null | undefined,
  urls: StoreUrls = getStoreUrls(),
): string | null {
  const platform = detectPlatform(userAgent);
  return platform ? urls[platform] : null;
}
