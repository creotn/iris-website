import { describe, test, expect, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { getStoreUrls, validStoreUrl } from "@/lib/downloadLink";
import { proxy } from "@/proxy";

const IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
const IPAD =
  "Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1";
const ANDROID =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36";
const DESKTOP =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const URLS = {
  ios: "https://apps.apple.com/app/example/id1",
  android: "https://play.google.com/store/apps/details?id=com.example",
};

describe("validStoreUrl", () => {
  test("accepts https", () => expect(validStoreUrl(URLS.ios)).toBe(URLS.ios));
  test.each([undefined, "", "   ", "not a url", "http://apps.apple.com/x", "javascript:alert(1)"])(
    "rejects %j",
    (raw) => expect(validStoreUrl(raw)).toBeNull(),
  );
});

describe("/download through the proxy", () => {
  afterEach(() => vi.unstubAllEnvs());

  test.each([
    ["iPhone", IPHONE],
    ["iPad", IPAD],
    ["Android", ANDROID],
    ["desktop", DESKTOP],
  ])("%s lands on the localized page, never a store", (_name, ua) => {
    vi.stubEnv("NEXT_PUBLIC_APP_STORE_URL", URLS.ios);
    vi.stubEnv("NEXT_PUBLIC_PLAY_STORE_URL", URLS.android);
    const request = new NextRequest("https://iris.test/download", {
      headers: { "user-agent": ua },
    });
    expect(proxy(request).headers.get("location") ?? "").toMatch(/\/(ar|en)\/download$/);
  });
});

describe("language through the proxy", () => {
  const visit = (path: string, headers: Record<string, string> = {}) =>
    proxy(new NextRequest(`https://iris.test${path}`, { headers }));

  test.each([
    ["Arabic browser", { "accept-language": "ar-SA,ar;q=0.9" }, "/ar/download"],
    ["English browser", { "accept-language": "en-US,en;q=0.9" }, "/en/download"],
    ["unsupported language falls back to Arabic", { "accept-language": "fr-FR" }, "/ar/download"],
    ["no language header falls back to Arabic", {}, "/ar/download"],
    [
      "a saved language beats the browser's",
      { "accept-language": "ar-SA", cookie: "Next-Locale=en" },
      "/en/download",
    ],
  ])("%s", (_name, headers, expected) => {
    expect(visit("/download", headers).headers.get("location")).toMatch(new RegExp(`${expected}$`));
  });

  test("the query string survives the language redirect", () => {
    expect(visit("/download?utm_source=qr").headers.get("location")).toMatch(
      /\/ar\/download\?utm_source=qr$/,
    );
  });

  test("a page with a language in its URL isn't redirected", () => {
    expect(visit("/en/download").headers.get("location")).toBeNull();
  });

  test.each(["/download", "/en/download"])(
    "%s saves the language in a cookie that survives outside links and restarts",
    (path) => {
      const cookie = visit(path).headers.get("set-cookie") ?? "";
      expect(cookie).toMatch(/Next-Locale=(ar|en)/);
      expect(cookie).toMatch(/SameSite=lax/i);
      expect(cookie).toMatch(/Max-Age=31536000/i);
      expect(cookie.match(/Next-Locale=/g)).toHaveLength(1);
    },
  );
});

describe("getStoreUrls", () => {
  afterEach(() => vi.unstubAllEnvs());

  test("reads and validates the env vars", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_STORE_URL", URLS.ios);
    vi.stubEnv("NEXT_PUBLIC_PLAY_STORE_URL", "http://insecure.example");
    expect(getStoreUrls()).toEqual({ ios: URLS.ios, android: null });
  });
});
