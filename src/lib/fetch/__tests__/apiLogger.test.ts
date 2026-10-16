import { describe, test, expect, vi, afterEach } from "vitest";
import { apiLogger } from "@/lib/fetch/apiLogger";

describe("apiLogger.error", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("prints method, url, duration, and the allowlisted error fields (previously silently dropped)", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    apiLogger.error("req-1", "Request failed after 1 attempt(s)", {
      method: "POST",
      url: "https://api.test/v1/api/contacts",
      statusCode: 500,
      duration: 42,
      errorCode: "internal_server_error",
      errorDetails: "HTTP 500: Internal Server Error",
      attempt: 1,
    });

    expect(spy).toHaveBeenCalledTimes(1);
    const line = spy.mock.calls[0][0] as string;

    expect(line).toContain("POST");
    expect(line).toContain("https://api.test/v1/api/contacts");
    expect(line).toContain("[500]");
    expect(line).toContain("(42ms)");
    expect(line).toContain("errorCode=internal_server_error");
    expect(line).toContain("attempt=1");
    expect(line).toContain("errorDetails=HTTP 500: Internal Server Error");
  });

  test("omits the extras suffix entirely when no extra metadata is passed", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    apiLogger.error("req-2", "Authentication required but no token available", {
      method: "PATCH",
      url: "https://api.test/v1/api/users/my-password",
      duration: 3,
    });

    const line = spy.mock.calls[0][0] as string;
    expect(line).not.toContain("|");
  });
});
