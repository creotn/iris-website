import { describe, test, expect, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/config/stores";
import { getStoreUrls, validStoreUrl } from "@/lib/downloadLink";
import { proxy } from "@/proxy";

const IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
const IPAD =
  "Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1";
const MAC =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15";
const ANDROID =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36";
const DESKTOP =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const LINUX = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const URLS = {
  ios: "https://apps.apple.com/app/example/id1",
  android: "https://play.google.com/store/apps/details?id=com.example",
};

const visit = (path: string, headers: Record<string, string> = {}) =>
  proxy(new NextRequest(`https://iris.test${path}`, { headers }));

describe("validStoreUrl", () => {
  test("accepts https", () => expect(validStoreUrl(URLS.ios)).toBe(URLS.ios));
  test.each([undefined, "", "   ", "not a url", "http://apps.apple.com/x", "javascript:alert(1)"])(
    "rejects %j",
    (raw) => expect(validStoreUrl(raw)).toBeNull(),
  );
});

describe("getStoreUrls", () => {
  afterEach(() => vi.unstubAllEnvs());

  test("uses the env links when they are valid", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_STORE_URL", URLS.ios);
    vi.stubEnv("NEXT_PUBLIC_PLAY_STORE_URL", URLS.android);
    expect(getStoreUrls()).toEqual(URLS);
  });

  test("falls back to the built-in links when the env is missing or invalid", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_STORE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_PLAY_STORE_URL", "http://insecure.example");
    expect(getStoreUrls()).toEqual({ ios: APP_STORE_URL, android: PLAY_STORE_URL });
  });
});

describe("/download through the proxy", () => {
  afterEach(() => vi.unstubAllEnvs());

  const configureStores = () => {
    vi.stubEnv("NEXT_PUBLIC_APP_STORE_URL", URLS.ios);
    vi.stubEnv("NEXT_PUBLIC_PLAY_STORE_URL", URLS.android);
  };

  test.each([
    ["iPhone", IPHONE, URLS.ios],
    ["iPad", IPAD, URLS.ios],
    ["iMac / MacBook, and iPad in desktop mode", MAC, URLS.ios],
    ["Android", ANDROID, URLS.android],
    // Their user agents contain "AppleWebKit", which must not count as an Apple device.
    ["Windows", DESKTOP, URLS.android],
    ["Linux", LINUX, URLS.android],
    ["unknown user agent", "not-a-user-agent", URLS.android],
    ["missing user agent", undefined, URLS.android],
  ])("%s goes to its store, uncached", (_name, ua, store) => {
    configureStores();
    const res = visit("/download", ua ? { "user-agent": ua } : {});
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe(store);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(res.headers.get("vary")).toMatch(/user-agent/i);
  });

  test("without env links it still goes straight to the built-in stores", () => {
    expect(visit("/download", { "user-agent": IPHONE }).headers.get("location")).toBe(APP_STORE_URL);
    expect(visit("/download", { "user-agent": ANDROID }).headers.get("location")).toBe(PLAY_STORE_URL);
  });

  test.each(["/download/", "/ar/download", "/en/download", "/en/download/"])(
    "%s is the same link: it redirects to the store, never to a page",
    (path) => {
      configureStores();
      expect(visit(path, { "user-agent": IPHONE }).headers.get("location")).toBe(URLS.ios);
      expect(visit(path, { "user-agent": ANDROID }).headers.get("location")).toBe(URLS.android);
    },
  );
});

describe("language through the proxy", () => {
  test.each([
    ["Arabic browser", { "accept-language": "ar-SA,ar;q=0.9" }, "/ar/privacy"],
    ["English browser", { "accept-language": "en-US,en;q=0.9" }, "/en/privacy"],
    ["unsupported language falls back to Arabic", { "accept-language": "fr-FR" }, "/ar/privacy"],
    ["no language header falls back to Arabic", {}, "/ar/privacy"],
    [
      "a saved language beats the browser's",
      { "accept-language": "ar-SA", cookie: "Next-Locale=en" },
      "/en/privacy",
    ],
  ])("%s", (_name, headers, expected) => {
    expect(visit("/privacy", headers).headers.get("location")).toMatch(new RegExp(`${expected}$`));
  });

  test("the query string survives the language redirect", () => {
    expect(visit("/privacy?utm_source=qr").headers.get("location")).toMatch(/\/ar\/privacy\?utm_source=qr$/);
  });

  test("a page with a language in its URL isn't redirected", () => {
    expect(visit("/en/privacy").headers.get("location")).toBeNull();
  });

  test.each(["/privacy", "/en/privacy"])(
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
