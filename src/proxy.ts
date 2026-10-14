import { createI18nMiddleware } from "next-international/middleware";
import type { NextRequest } from "next/server";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "ar"],
  defaultLocale: "ar",
  urlMappingStrategy: "redirect",
});

// No session-refresh redirect: the browser keeps the access token and refreshes it itself on a 401
// (`lib/api/client.ts`). The API's own `refresh_token` cookie shares the `localhost` host with this
// site, so reading it here as a legacy session bounced every signed-in visitor back to sign-in.
export function proxy(request: NextRequest) {
  return I18nMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
