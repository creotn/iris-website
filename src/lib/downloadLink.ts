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
