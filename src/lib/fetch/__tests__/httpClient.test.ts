import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from "vitest";

vi.mock("@/lib/fetch/getAuthToken", () => ({
  getAuthToken: vi.fn(),
}));

import { getAuthToken } from "@/lib/fetch/getAuthToken";
import {
  httpClient,
  httpClientPost,
  httpClientPut,
  httpClientPatch,
  httpClientDelete,
} from "@/lib/fetch/httpClient";

function jsonResponse(status: number, body: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: "",
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response;
}

describe("httpClient", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "debug").mockImplementation(() => {});
    (getAuthToken as unknown as Mock).mockReset();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("GET success returns data and metadata", async () => {
    (global.fetch as Mock).mockResolvedValue(
      jsonResponse(200, { foo: "bar" }),
    );

    const response = await httpClient<{ foo: string }>(
      "https://api.test/v1/api/things",
    );

    expect(response.success).toBe(true);
    expect(response.data).toEqual({ foo: "bar" });
    expect(response.statusCode).toBe(200);
    expect(response.method).toBe("GET");
    expect(response.endpoint).toBe("https://api.test/v1/api/things");
    expect(typeof response.requestId).toBe("string");
  });

  test("4xx with a string message resolves errorCode from message, not the HTTP reason phrase", async () => {
    (global.fetch as Mock).mockResolvedValue(
      jsonResponse(404, {
        statusCode: 404,
        message: "not_found",
        error: "Not Found",
      }),
    );

    const response = await httpClient("https://api.test/v1/api/things/1");

    expect(response.success).toBe(false);
    expect(response.errorCode).toBe("not_found");
    expect(response.errorBody).toEqual({
      statusCode: 404,
      message: "not_found",
      error: "Not Found",
    });
    expect(response.error).not.toBe("An unexpected error occurred");
  });

  test("4xx with an array message (validation) resolves errorCode to the first entry", async () => {
    (global.fetch as Mock).mockResolvedValue(
      jsonResponse(400, {
        statusCode: 400,
        message: ["invalid_phone_number", "name_too_short"],
        error: "Bad Request",
      }),
    );

    const response = await httpClient("https://api.test/v1/api/contacts");

    expect(response.errorCode).toBe("invalid_phone_number");
    expect(response.errorBody).toMatchObject({
      message: ["invalid_phone_number", "name_too_short"],
    });
  });

  test("GET retries on 5xx and succeeds on a later attempt", async () => {
    (global.fetch as Mock)
      .mockResolvedValueOnce(jsonResponse(500, { message: "boom" }))
      .mockResolvedValueOnce(jsonResponse(200, { ok: true }));

    const response = await httpClient("https://api.test/v1/api/things", {
      baseDelay: 1,
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(response.success).toBe(true);
    expect(response.data).toEqual({ ok: true });
  });

  test("POST does not retry on 5xx by default (single attempt)", async () => {
    (global.fetch as Mock).mockResolvedValue(
      jsonResponse(500, { message: "boom" }),
    );

    const response = await httpClientPost(
      "https://api.test/v1/api/contacts",
      { name: "a" },
      { baseDelay: 1 },
    );

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(response.success).toBe(false);
    expect(response.errorCode).toBe("boom");
  });

  test("retries > 0 on a mutation without an idempotencyKey is clamped to a single attempt", async () => {
    (global.fetch as Mock).mockRejectedValue(new TypeError("fetch failed"));

    const response = await httpClientPost(
      "https://api.test/v1/api/contacts",
      { name: "a" },
      { retries: 3, baseDelay: 1 },
    );

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(response.success).toBe(false);
    expect(response.errorCode).toBe("network_error");
  });

  test("FormData body omits Content-Type so fetch sets the multipart boundary", async () => {
    (global.fetch as Mock).mockResolvedValue(jsonResponse(200, {}));

    const formData = new FormData();
    formData.append("file", "not-a-real-file");

    await httpClientPost("https://api.test/v1/api/jobs/applications", formData);

    const [, init] = (global.fetch as Mock).mock.calls[0];
    expect(init.headers["Content-Type"]).toBeUndefined();
    expect(init.body).toBe(formData);
  });

  test("plain object body is JSON-stringified with a Content-Type header", async () => {
    (global.fetch as Mock).mockResolvedValue(jsonResponse(200, {}));

    await httpClientPost("https://api.test/v1/api/contacts", { name: "a" });

    const [, init] = (global.fetch as Mock).mock.calls[0];
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(init.body).toBe(JSON.stringify({ name: "a" }));
  });

  test("requiresAuth with no token short-circuits to 401 without calling fetch", async () => {
    (getAuthToken as unknown as Mock).mockResolvedValue(null);

    const response = await httpClientPatch(
      "https://api.test/v1/api/users/my-password",
      { a: 1 },
      { requiresAuth: true },
    );

    expect(global.fetch).not.toHaveBeenCalled();
    expect(response.success).toBe(false);
    expect(response.statusCode).toBe(401);
    expect(response.sessionRejected).toBe(true);
  });

  test("a 401 on an authenticated read is flagged as the session being rejected", async () => {
    (getAuthToken as unknown as Mock).mockResolvedValue("tok-123");
    (global.fetch as Mock).mockResolvedValue(
      jsonResponse(401, { statusCode: 401, message: "session_revoked" }),
    );

    const response = await httpClient(
      "https://api.test/v1/api/customers/me/units",
      { requiresAuth: true },
    );

    expect(response.sessionRejected).toBe(true);
    expect(response.errorCode).toBe("session_revoked");
  });

  test("a 401 on an UNauthenticated call is not flagged — a wrong password is not a lapsed session", async () => {
    (global.fetch as Mock).mockResolvedValue(
      jsonResponse(401, { statusCode: 401, message: "invalid_credentials" }),
    );

    const response = await httpClientPost(
      "https://api.test/v1/api/auth/customer-signin",
      { identifier: "a", password: "b" },
    );

    // Keying off the status alone would bounce a failed sign-in to the sign-in page it came from.
    expect(response.sessionRejected).toBeUndefined();
    expect(response.errorCode).toBe("invalid_credentials");
  });

  test("a 403 on an authenticated read is not flagged — the session is fine, the permission is not", async () => {
    (getAuthToken as unknown as Mock).mockResolvedValue("tok-123");
    (global.fetch as Mock).mockResolvedValue(
      jsonResponse(403, { statusCode: 403, message: "forbidden" }),
    );

    const response = await httpClient(
      "https://api.test/v1/api/customers/me/units",
      { requiresAuth: true },
    );

    expect(response.sessionRejected).toBeUndefined();
    expect(response.errorCode).toBe("forbidden");
  });

  test("a 5xx on an authenticated read is not flagged", async () => {
    (getAuthToken as unknown as Mock).mockResolvedValue("tok-123");
    (global.fetch as Mock).mockResolvedValue(
      jsonResponse(500, { message: "boom" }),
    );

    const response = await httpClient(
      "https://api.test/v1/api/customers/me/units",
      { requiresAuth: true, retries: 0 },
    );

    expect(response.sessionRejected).toBeUndefined();
    expect(response.statusCode).toBe(500);
  });

  test("a 401 on an authenticated mutation is flagged too", async () => {
    (getAuthToken as unknown as Mock).mockResolvedValue("tok-123");
    (global.fetch as Mock).mockResolvedValue(
      jsonResponse(401, { statusCode: 401, message: "session_expired" }),
    );

    const response = await httpClientPost(
      "https://api.test/v1/api/maintenance-requests",
      { a: 1 },
      { requiresAuth: true },
    );

    expect(response.sessionRejected).toBe(true);
  });

  test("requiresAuth with a token attaches the Authorization header", async () => {
    (getAuthToken as unknown as Mock).mockResolvedValue("tok-123");
    (global.fetch as Mock).mockResolvedValue(jsonResponse(200, {}));

    await httpClientDelete("https://api.test/v1/api/categories/1", {
      requiresAuth: true,
    });

    const [, init] = (global.fetch as Mock).mock.calls[0];
    expect(init.headers["Authorization"]).toBe("Bearer tok-123");
  });

  test("requiresAuth forces no-store even when an explicit revalidate is passed", async () => {
    (getAuthToken as unknown as Mock).mockResolvedValue("tok-123");
    (global.fetch as Mock).mockResolvedValue(jsonResponse(200, {}));

    await httpClient("https://api.test/v1/api/customers/me", {
      requiresAuth: true,
      revalidate: 300,
      tags: ["should-not-be-applied"],
    });

    // The incremental cache is shared across replicas, so a cached per-user response would reach a
    // different customer. `requiresAuth` therefore wins over an explicit cache directive.
    const [, init] = (global.fetch as Mock).mock.calls[0];
    expect(init.cache).toBe("no-store");
    expect(init.next).toBeUndefined();
  });

  test("an unauthenticated read still honours revalidate and tags", async () => {
    (global.fetch as Mock).mockResolvedValue(jsonResponse(200, {}));

    await httpClient("https://api.test/v1/api/projects/public", {
      revalidate: 300,
      tags: ["projects-public"],
    });

    const [, init] = (global.fetch as Mock).mock.calls[0];
    expect(init.cache).toBeUndefined();
    expect(init.next).toEqual({ revalidate: 300, tags: ["projects-public"] });
  });

  test("204 No Content is treated as success with null data, without parsing a body", async () => {
    const json = vi.fn();
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      status: 204,
      statusText: "",
      json,
    });

    const response = await httpClientDelete("https://api.test/v1/api/notes/1");

    expect(response.success).toBe(true);
    expect(response.data).toBeNull();
    expect(json).not.toHaveBeenCalled();
  });

  test("a timeout resolves to the request_timeout code, distinct from network_error", async () => {
    (global.fetch as Mock).mockImplementation(
      (_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener("abort", () => {
            reject(new DOMException("The operation was aborted.", "AbortError"));
          });
        }),
    );

    const response = await httpClient("https://api.test/v1/api/things", {
      timeout: 10,
      baseDelay: 1,
    });

    expect(response.success).toBe(false);
    expect(response.errorCode).toBe("request_timeout");
  });

  test("GET retries a dropped connection (fetch failed) and succeeds on a later attempt", async () => {
    (global.fetch as Mock)
      .mockRejectedValueOnce(new TypeError("fetch failed"))
      .mockResolvedValueOnce(jsonResponse(200, { ok: true }));

    const response = await httpClient("https://api.test/v1/api/things", {
      baseDelay: 1,
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(response.success).toBe(true);
  });

  test("GET retries a timeout", async () => {
    (global.fetch as Mock)
      .mockImplementationOnce(
        (_url: string, init: RequestInit) =>
          new Promise((_resolve, reject) => {
            init.signal?.addEventListener("abort", () => {
              reject(new DOMException("The operation was aborted.", "AbortError"));
            });
          }),
      )
      .mockResolvedValueOnce(jsonResponse(200, { ok: true }));

    const response = await httpClient("https://api.test/v1/api/things", {
      timeout: 10,
      baseDelay: 1,
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(response.success).toBe(true);
  });

  test("GET does not retry a 4xx", async () => {
    (global.fetch as Mock).mockResolvedValue(
      jsonResponse(404, { message: "not_found" }),
    );

    await httpClient("https://api.test/v1/api/things/1", { baseDelay: 1 });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test("PUT is exposed and behaves like the other mutating verbs", async () => {
    (global.fetch as Mock).mockResolvedValue(jsonResponse(200, { ok: true }));

    const response = await httpClientPut("https://api.test/v1/api/things/1", {
      a: 1,
    });

    expect(response.success).toBe(true);
    const [, init] = (global.fetch as Mock).mock.calls[0];
    expect(init.method).toBe("PUT");
  });
});
