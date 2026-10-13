import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest, NextResponse } from "next/server";
import { REFRESH_ATTEMPTED_COOKIE } from "@/lib/fetch/refreshMarker";
import {
  LEGACY_REFRESH_COOKIE,
  sessionCookieName,
} from "@/lib/fetch/sessionCookieName";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "ar"],
  defaultLocale: "ar",
  urlMappingStrategy: "redirect",
});

// So a token expiring between this check and the render it gates doesn't 401 mid-page. Small
// because the server already grants ~30s grace on the refresh token itself.
const EXPIRY_SKEW_SECONDS = 10;

/**
 * The access token's `exp`, or null when it cannot be read. Unverified on purpose — the API checks
 * the signature on every call regardless, so a forged `exp` only triggers a refresh it will reject.
 * Padded by hand because `atob` rejects the unpadded base64url a JWT uses.
 */
function accessTokenExpiry(token: string): number | null {
  const payload = token.split(".")[1];
  if (!payload) return null;
  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const { exp } = JSON.parse(atob(padded)) as { exp?: unknown };
    return typeof exp === "number" && Number.isFinite(exp) ? exp : null;
  } catch {
    return null;
  }
}

/** Whether this request should be sent through the refresh route before it renders. */
function needsRefresh(request: NextRequest): boolean {
  const hasSession = request.cookies.has(sessionCookieName());
  const hasLegacy = request.cookies.has(LEGACY_REFRESH_COOKIE);

  // Nothing to spend for a signed-out visitor — redirecting anyway would loop back from sign-in.
  if (!hasSession && !hasLegacy) return false;

  // A refresh was just tried and failed transiently; let render-time 401 handling take over instead.
  if (request.cookies.has(REFRESH_ATTEMPTED_COOKIE)) return false;

  if (!hasSession) return true;

  const accessToken = request.cookies.get("access_token")?.value;
  // The access token is shorter-lived than the session — in that gap a valid session would
  // otherwise render as signed out.
  if (!accessToken) return true;

  const exp = accessTokenExpiry(accessToken);
  // Unreadable: leave it to the render-time 401 path rather than refreshing on every request.
  if (exp === null) return false;

  return exp - EXPIRY_SKEW_SECONDS <= Date.now() / 1000;
}

export function proxy(request: NextRequest) {
  if (needsRefresh(request)) {
    // Absolute, and built by cloning `nextUrl`: the proxy cannot use a relative `Location` — Next's
    // adapter parses the header into a `NextURL` and throws `Invalid URL` on a bare path.
    const refresh = request.nextUrl.clone();
    refresh.pathname = "/api/auth/refresh";
    refresh.search = "";
    refresh.searchParams.set(
      "next",
      request.nextUrl.pathname + request.nextUrl.search,
    );
    return NextResponse.redirect(refresh);
  }

  return I18nMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
