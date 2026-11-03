export const sessionCookieIsSecure = (): boolean =>
  !["false", "0", "no", "off"].includes(
    String(process.env.COOKIE_SECURE ?? "")
      .trim()
      .toLowerCase(),
  );

export const sessionCookieName = (): string =>
  sessionCookieIsSecure() ? "__Host-iris_sess" : "iris_sess";

export const LEGACY_REFRESH_COOKIE = "refresh_token";
