/**
 * The website's own session cookie, and the relay that fills it. The API's refresh cookie is
 * scoped to the API host and can't be passed through as-is, so it's read server-side and
 * re-issued here under a name scoped to this site.
 */

import { cookies } from "next/headers";
import {
  sessionCookieIsSecure,
  sessionCookieName,
} from "./sessionCookieName";

/** The API's cookie, in either of the two forms `cookie.config.ts` emits. */
const API_REFRESH_COOKIE_NAMES = ["__Host-ehya_rt", "ehya_rt"] as const;

// Re-exported so the existing importers keep one entry point; the definitions live in an
// import-free module because the proxy imports them and must not pull in `next/headers`.
export {
  sessionCookieIsSecure,
  sessionCookieName,
} from "./sessionCookieName";

/** Pulls one cookie's value out of raw `Set-Cookie` lines. */
function readSetCookieValue(setCookie: string[], names: readonly string[]): string | null {
  for (const line of setCookie) {
    const [pair] = line.split(";");
    const eq = pair.indexOf("=");
    if (eq < 1) continue;
    const name = pair.slice(0, eq).trim();
    if (!names.includes(name)) continue;
    const value = pair.slice(eq + 1).trim();
    if (value) return value;
  }
  return null;
}

/** `Max-Age` from the same line, so the relayed cookie expires with the session it mirrors. */
function readMaxAge(setCookie: string[], names: readonly string[]): number | null {
  for (const line of setCookie) {
    const [pair, ...attrs] = line.split(";");
    const name = pair.slice(0, Math.max(pair.indexOf("="), 0)).trim();
    if (!names.includes(name)) continue;
    for (const attr of attrs) {
      const [key, raw] = attr.split("=");
      if (key?.trim().toLowerCase() !== "max-age") continue;
      const seconds = Number.parseInt(String(raw).trim(), 10);
      if (Number.isInteger(seconds) && seconds > 0) return seconds;
    }
  }
  return null;
}

/**
 * Re-issues the API's refresh cookie under the website's own name. Returns false when the response
 * carried no such cookie, so a caller can tell a sign-in that silently stored no session from success.
 */
export async function relayApiSessionCookie(setCookie: string[]): Promise<boolean> {
  const value = readSetCookieValue(setCookie, API_REFRESH_COOKIE_NAMES);
  if (!value) return false;

  const maxAge = readMaxAge(setCookie, API_REFRESH_COOKIE_NAMES);

  (await cookies()).set(sessionCookieName(), value, {
    httpOnly: true,
    secure: sessionCookieIsSecure(),
    sameSite: "lax",
    path: "/",
    // Never a Domain: host-only is what stops a compromised subdomain planting a same-named cookie,
    // and `__Host-` has the browser enforce it rather than trusting us to remember.
    ...(maxAge ? { maxAge } : {}),
  });

  return true;
}

/** Both cookie names are sent because which one the API reads depends on ITS `COOKIE_SECURE`,
 *  which this service cannot see. */
export const apiSessionCookieHeader = (value: string): string =>
  API_REFRESH_COOKIE_NAMES.map((name) => `${name}=${value}`).join("; ");

/** Removes the session cookie under whichever name this deployment issues it. */
export async function clearSessionCookie(): Promise<void> {
  // Expired by hand rather than through `delete()`: `__Host-` is browser-enforced on the way out as
  // well, so a `Set-Cookie` missing `Secure` or `Path=/` is refused and the session stays alive.
  (await cookies()).set(sessionCookieName(), "", {
    httpOnly: true,
    secure: sessionCookieIsSecure(),
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
