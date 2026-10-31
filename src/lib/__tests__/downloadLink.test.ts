import { describe, test, expect, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { detectPlatform, getStoreUrls, validStoreUrl } from "@/lib/downloadLink";
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

describe("detectPlatform", () => {
  const MAC =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15";

  test.each([
    ["iPhone", IPHONE, 5, "ios"],
    ["iPad", IPAD, 5, "ios"],
    ["iPad in desktop mode", MAC, 5, "ios"],
    ["Android", ANDROID, 5, "android"],
    ["Mac", MAC, 0, null],
    ["Windows laptop with a touch screen", DESKTOP, 10, null],
    ["unknown", "not-a-user-agent", 0, null],
    ["empty", "", 0, null],
  ])("%s", (_name, ua, touchPoints, expected) => {
    expect(detectPlatform(ua, touchPoints)).toBe(expected);
  });
});

describe("validStoreUrl", () => {
  test("accepts https", () => expect(validStoreUrl(URLS.ios)).toBe(URLS.ios));
  test.each([undefined, "", "   ", "not a url", "http://apps.apple.com/x", "javascript:alert(1)"])(
    "rejects %j",
    (raw) => expect(validStoreUrl(raw)).toBeNull(),
  );
});

describe("/download through the proxy", () => {
  afterEach(() => vi.unstubAllEnvs());

  const MAC =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15";
  const LINUX =
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

  const visit = (path: string, ua?: string) =>
    proxy(new NextRequest(`https://iris.test${path}`, { headers: ua ? { "user-agent": ua } : {} }));
  const configureStores = (ios = URLS.ios, android = URLS.android) => {
    vi.stubEnv("NEXT_PUBLIC_APP_STORE_URL", ios);
    vi.stubEnv("NEXT_PUBLIC_PLAY_STORE_URL", android);
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
    const res = visit("/download", ua);
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe(store);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(res.headers.get("vary")).toMatch(/user-agent/i);
  });

  test("an unconfigured store falls through to the page, never the other store", () => {
    configureStores("", URLS.android);
    expect(visit("/download", IPHONE).headers.get("location")).toMatch(/\/(ar|en)\/download$/);
    configureStores(URLS.ios, "");
    expect(visit("/download", ANDROID).headers.get("location")).toMatch(/\/(ar|en)\/download$/);
  });

  test.each(["/ar/download", "/en/download"])("%s stays a normal page", (path) => {
    configureStores();
    expect(visit(path, IPHONE).headers.get("location")).toBeNull();
    expect(visit(path, ANDROID).headers.get("location")).toBeNull();
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
