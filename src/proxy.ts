import { createI18nMiddleware } from "next-international/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { resolveStoreRedirect } from "@/lib/downloadLink";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "ar"],
  defaultLocale: "ar",
  urlMappingStrategy: "redirect",
});

// No session-refresh redirect: the browser keeps the access token and refreshes it itself on a 401
// (`lib/api/client.ts`). The API's own `refresh_token` cookie shares the `localhost` host with this
// site, so reading it here as a legacy session bounced every signed-in visitor back to sign-in.
export function proxy(request: NextRequest) {
  // The permanent QR-code URL. Phones go straight to their store; everyone else (and any phone whose
  // store link isn't configured) falls through to the locale redirect and lands on /[locale]/download.
  if (request.nextUrl.pathname.replace(/\/$/, "") === "/download") {
    const store = resolveStoreRedirect(request.headers.get("user-agent"));
    if (store) {
      // 302, never 301: browsers cache a 301 forever, which would pin the store link we want to change.
      const response = NextResponse.redirect(store, 302);
      response.headers.set("Cache-Control", "no-store");
      response.headers.set("Vary", "User-Agent");
      return response;
    }
  }
  return I18nMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
