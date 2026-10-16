/**
 * The names of the website's own session cookies. Split out of `sessionCookie.ts` (which imports
 * `next/headers`) because the proxy needs the same names and reads cookies off the request instead.
 */

/** `__Host-` requires `Secure`, so plain-http localhost falls back to the unprefixed name. Defaults
 *  to secure — a misspelt flag fails closed. */
export const sessionCookieIsSecure = (): boolean =>
  !["false", "0", "no", "off"].includes(
    String(process.env.COOKIE_SECURE ?? "")
      .trim()
      .toLowerCase(),
  );

export const sessionCookieName = (): string =>
  sessionCookieIsSecure() ? "__Host-iris_sess" : "iris_sess";

/** The refresh cookie the pre-migration client wrote — never written now, but a pre-rollout
 *  customer still presents it, and it lacks `__Host-` so a subdomain could shadow it. */
export const LEGACY_REFRESH_COOKIE = "refresh_token";
