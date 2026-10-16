import { NextRequest, NextResponse } from "next/server";
import { httpClientPost } from "@/lib/fetch/httpClient";
import { getRefreshToken } from "@/lib/fetch/getAuthToken";
import {
  apiSessionCookieHeader,
  clearSessionCookie,
  relayApiSessionCookie,
} from "@/lib/fetch/sessionCookie";
import { cookies } from "next/headers";
import {
  REFRESH_ATTEMPTED_COOKIE,
  REFRESH_ATTEMPTED_MAX_AGE,
} from "@/lib/fetch/refreshMarker";
import { LEGACY_REFRESH_COOKIE } from "@/lib/fetch/sessionCookieName";

/**
 * Spends the relayed session cookie for a fresh access token, then sends the visitor back where
 * they were going. The proxy redirects here rather than refreshing inline, so the `Set-Cookie`
 * relay lives in a route handler with the full `cookies()` API.
 */

/** Only a same-origin path may be redirected to — an absolute URL here would be an open redirect. */
function safeReturnPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/")) return "/";
  // `//evil.com` and `/\evil.com` are both protocol-relative and leave the origin.
  if (raw.startsWith("//") || raw.startsWith("/\\")) return "/";
  return raw;
}

/** `ar` unless the return path names another locale — the sign-in page is locale-prefixed. */
function localeOf(path: string): string {
  const [, first] = path.split("/");
  return first === "en" ? "en" : "ar";
}

/**
 * A same-origin redirect with a RELATIVE `Location` — an absolute one built from
 * `request.nextUrl.origin` would send a developer on a LAN IP or hosts entry back to `localhost`
 * and strip their cookies.
 */
function redirectTo(path: string): NextResponse {
  return new NextResponse(null, { status: 307, headers: { Location: path } });
}

export async function GET(request: NextRequest) {
  const returnTo = safeReturnPath(request.nextUrl.searchParams.get("next"));
  const locale = localeOf(returnTo);
  const signIn = (reason?: string) =>
    redirectTo(
      `/${locale}/sign-in${reason ? `?reason=${encodeURIComponent(reason)}` : ""}`,
    );

  const sessionValue = await getRefreshToken();
  // Written by the pre-migration client and never by this one. A customer who signed in before the
  // rollout has only this, and the API adopts it into a session family on first use (FR-027).
  const cookieStore = await cookies();
  const legacyValue = cookieStore.get(LEGACY_REFRESH_COOKIE)?.value;

  // Nothing to spend: this is an ordinary signed-out visitor, so there is no session to explain.
  if (!sessionValue && !legacyValue) return signIn();

  let apiSetCookie: string[] = [];
  const response = await httpClientPost<AuthRefreshResponse>(
    `${process.env.API_URL}/v1/api/auth/refresh-token`,
    // The API prefers its cookie over the body, so presenting both is safe and keeps the adoption
    // path from needing a branch of its own.
    legacyValue ? { refresh_token: legacyValue } : {},
    {
      headers: sessionValue
        ? { Cookie: apiSessionCookieHeader(sessionValue) }
        : {},
      onSetCookie: (lines) => (apiSetCookie = lines),
    },
  );

  if (response.success && response.data?.access_token) {
    await relayApiSessionCookie(apiSetCookie);
    cookieStore.set("access_token", response.data.access_token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      path: "/",
      httpOnly: true,
    });
    // Superseded now that the session cookie is set — a spent credential has no reason to stay.
    if (legacyValue) cookieStore.delete(LEGACY_REFRESH_COOKIE);
    return redirectTo(returnTo);
  }

  // Only a 401 means the session is genuinely over — anything else leaves the cookie valid, so
  // clearing it here would sign the visitor out over a blip.
  if (response.statusCode === 401) {
    await clearSessionCookie();
    cookieStore.delete("access_token");
    cookieStore.delete("user");
    // Left behind, the proxy would see it again on the sign-in page and send them straight back.
    cookieStore.delete(LEGACY_REFRESH_COOKIE);
    return signIn(response.errorCode ?? "session_expired");
  }

  // Transient: send them on with the one-shot marker so the proxy does not bounce them straight
  // back here. The page renders with an expired token and its own 401 handling takes over.
  const onward = redirectTo(returnTo);
  onward.cookies.set(REFRESH_ATTEMPTED_COOKIE, "1", {
    httpOnly: true,
    path: "/",
    maxAge: REFRESH_ATTEMPTED_MAX_AGE,
  });
  return onward;
}
