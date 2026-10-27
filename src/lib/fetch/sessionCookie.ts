import { cookies } from "next/headers";
import {
  sessionCookieIsSecure,
  sessionCookieName,
} from "./sessionCookieName";

const API_REFRESH_COOKIE_NAMES = ["__Host-ehya_rt", "ehya_rt"] as const;

export {
  sessionCookieIsSecure,
  sessionCookieName,
} from "./sessionCookieName";

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

export async function relayApiSessionCookie(setCookie: string[]): Promise<boolean> {
  const value = readSetCookieValue(setCookie, API_REFRESH_COOKIE_NAMES);
  if (!value) return false;

  const maxAge = readMaxAge(setCookie, API_REFRESH_COOKIE_NAMES);

  (await cookies()).set(sessionCookieName(), value, {
    httpOnly: true,
    secure: sessionCookieIsSecure(),
    sameSite: "lax",
    path: "/",
    ...(maxAge ? { maxAge } : {}),
  });

  return true;
}

export const apiSessionCookieHeader = (value: string): string =>
  API_REFRESH_COOKIE_NAMES.map((name) => `${name}=${value}`).join("; ");

export async function clearSessionCookie(): Promise<void> {
  (await cookies()).set(sessionCookieName(), "", {
    httpOnly: true,
    secure: sessionCookieIsSecure(),
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
