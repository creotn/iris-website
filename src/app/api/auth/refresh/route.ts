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

function safeReturnPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/")) return "/";
  if (raw.startsWith("//") || raw.startsWith("/\\")) return "/";
  return raw;
}

function localeOf(path: string): string {
  const [, first] = path.split("/");
  return first === "en" ? "en" : "ar";
}

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
  const cookieStore = await cookies();
  const legacyValue = cookieStore.get(LEGACY_REFRESH_COOKIE)?.value;

  if (!sessionValue && !legacyValue) return signIn();

  let apiSetCookie: string[] = [];
  const response = await httpClientPost<AuthRefreshResponse>(
    `${process.env.API_URL}/v1/api/auth/refresh-token`,
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
    if (legacyValue) cookieStore.delete(LEGACY_REFRESH_COOKIE);
    return redirectTo(returnTo);
  }

  if (response.statusCode === 401) {
    await clearSessionCookie();
    cookieStore.delete("access_token");
    cookieStore.delete("user");
    cookieStore.delete(LEGACY_REFRESH_COOKIE);
    return signIn(response.errorCode ?? "session_expired");
  }

  const onward = redirectTo(returnTo);
  onward.cookies.set(REFRESH_ATTEMPTED_COOKIE, "1", {
    httpOnly: true,
    path: "/",
    maxAge: REFRESH_ATTEMPTED_MAX_AGE,
  });
  return onward;
}
