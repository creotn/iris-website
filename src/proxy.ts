import { createI18nMiddleware } from "next-international/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { DOWNLOAD_PATH, resolveStoreRedirect } from "@/lib/downloadLink";

const LOCALE_COOKIE = "Next-Locale";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "ar"],
  defaultLocale: "ar",
  urlMappingStrategy: "redirect",
});

export function proxy(request: NextRequest) {
  // /download has no page: it always goes straight to the visitor's store (the old /ar and /en
  // addresses too). 302, never 301: browsers cache a 301 forever, which would pin the store link.
  if (DOWNLOAD_PATH.test(request.nextUrl.pathname)) {
    const redirect = NextResponse.redirect(resolveStoreRedirect(request.headers.get("user-agent")), 302);
    redirect.headers.set("Cache-Control", "no-store");
    redirect.headers.set("Vary", "User-Agent");
    return redirect;
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
