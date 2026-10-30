import { describe, test, expect, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";
import {
  detectPlatform,
  getStoreUrls,
  resolveStoreRedirect,
  validStoreUrl,
} from "@/lib/downloadLink";
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
  test.each([
    ["iPhone", IPHONE, "ios"],
    ["iPad", IPAD, "ios"],
    ["Android", ANDROID, "android"],
    ["desktop", DESKTOP, null],
    ["garbage", "not-a-user-agent \u0000 ???", null],
    ["empty", "", null],
    ["missing", undefined, null],
  ])("%s", (_name, ua, expected) => {
    expect(detectPlatform(ua)).toBe(expected);
  });
});

describe("resolveStoreRedirect", () => {
  test("iOS → App Store", () => expect(resolveStoreRedirect(IPHONE, URLS)).toBe(URLS.ios));
  test("Android → Play Store", () =>
    expect(resolveStoreRedirect(ANDROID, URLS)).toBe(URLS.android));
  test("desktop → landing page", () => expect(resolveStoreRedirect(DESKTOP, URLS)).toBeNull());
  test("unknown user agent → landing page", () =>
    expect(resolveStoreRedirect("???", URLS)).toBeNull());
  test("missing config → landing page instead of a broken redirect", () => {
    expect(resolveStoreRedirect(IPHONE, { ios: null, android: URLS.android })).toBeNull();
    expect(resolveStoreRedirect(ANDROID, { ios: URLS.ios, android: null })).toBeNull();
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

  const request = (ua: string) =>
    new NextRequest("https://iris.test/download", { headers: { "user-agent": ua } });

  test("iPhone is redirected to the App Store, uncached", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_STORE_URL", URLS.ios);
    const res = proxy(request(IPHONE));
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe(URLS.ios);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(res.headers.get("vary")).toMatch(/user-agent/i);
  });

  test("Android is redirected to Google Play", () => {
    vi.stubEnv("NEXT_PUBLIC_PLAY_STORE_URL", URLS.android);
    expect(proxy(request(ANDROID)).headers.get("location")).toBe(URLS.android);
  });

  test("desktop is sent to the localized landing page, not a store", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_STORE_URL", URLS.ios);
    const location = proxy(request(DESKTOP)).headers.get("location") ?? "";
    expect(location).toMatch(/\/(ar|en)\/download$/);
  });

  test("a phone with no configured store falls through to the landing page", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_STORE_URL", "");
    const location = proxy(request(IPHONE)).headers.get("location") ?? "";
    expect(location).toMatch(/\/(ar|en)\/download$/);
  });
});

describe("getStoreUrls", () => {
  afterEach(() => vi.unstubAllEnvs());

  test("reads and validates the env vars", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_STORE_URL", URLS.ios);
    vi.stubEnv("NEXT_PUBLIC_PLAY_STORE_URL", "http://insecure.example");
    expect(getStoreUrls()).toEqual({ ios: URLS.ios, android: null });
  });
});
