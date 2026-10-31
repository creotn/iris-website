import { createI18nMiddleware } from "next-international/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { resolveStoreRedirect } from "@/lib/downloadLink";

const LOCALE_COOKIE = "Next-Locale";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "ar"],
  defaultLocale: "ar",
  urlMappingStrategy: "redirect",
});

// No session-refresh redirect: the browser keeps the access token and refreshes it itself on a 401
// (`lib/api/client.ts`). The API's own `refresh_token` cookie shares the `localhost` host with this
// site, so reading it here as a legacy session bounced every signed-in visitor back to sign-in.
export function proxy(request: NextRequest) {
  // The QR code's permanent URL goes straight to a store. /[locale]/download stays a normal page, and
  // is also where this falls through to, via the locale redirect, if that store isn't configured.
  if (request.nextUrl.pathname.replace(/\/$/, "") === "/download") {
    const store = resolveStoreRedirect(request.headers.get("user-agent"));
    if (store) {
      // 302, never 301: browsers cache a 301 forever, which would pin the store link we want to change.
      const redirect = NextResponse.redirect(store, 302);
      redirect.headers.set("Cache-Control", "no-store");
      redirect.headers.set("Vary", "User-Agent");
      return redirect;
    }
  }

  const response = I18nMiddleware(request);
  // The library's cookie is SameSite=Strict and session-only. Browsers don't send a Strict cookie on
  // arrival from another site, so the middleware re-detected the language and overwrote the choice.
  const locale = response.cookies.get(LOCALE_COOKIE)?.value;
  if (locale) {
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return response;
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
