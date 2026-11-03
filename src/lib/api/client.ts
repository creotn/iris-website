const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN_COOKIE = "iris_token";
export const AUTH_CHANGE_EVENT = "iris-auth-change";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7;
const TIMEOUT_MS = 30_000;

export type ApiResult<T = unknown> = { ok: true; data: T } | { ok: false; error: string };

export function getAccessToken(): string | null {
  const match = document.cookie.split("; ").find((pair) => pair.startsWith(`${TOKEN_COOKIE}=`));
  return match ? decodeURIComponent(match.slice(TOKEN_COOKIE.length + 1)) : null;
}

export function setAccessToken(token: string) {
  const secure = location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${TOKEN_MAX_AGE}; samesite=lax${secure}`;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function clearAccessToken() {
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

function errorCode(body: unknown, status: number): string {
  if (status === 429) return "too_many_requests";
  if (status === 401 && (body as { message?: unknown } | null)?.message === "Unauthorized") {
    return "user_not_authenticated";
  }
  const message = (body as { message?: string | string[] } | null)?.message;
  if (typeof message === "string" && message) return message;
  if (Array.isArray(message) && message[0]) return message[0];
  return status >= 500 ? "internal_server_error" : "bad_request";
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: object;
  auth?: boolean;
  credentials?: boolean;
};

async function send(path: string, options: RequestOptions, token: string | null) {
  const headers: Record<string, string> = {};
  if (options.body) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.credentials) headers["X-Client"] = "web";

  return fetch(`${BASE_URL}/v1/api${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: options.credentials ? "include" : "omit",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await send("/auth/refresh-token", { method: "POST", credentials: true }, null);
    if (!response.ok) return null;
    const { access_token } = (await response.json()) as { access_token?: string };
    if (!access_token) return null;
    setAccessToken(access_token);
    return access_token;
  } catch {
    return null;
  }
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResult<T>> {
  try {
    let token = options.auth ? getAccessToken() : null;
    let response = await send(path, options, token);

    if (response.status === 401 && options.auth) {
      token = await refreshAccessToken();
      if (token) response = await send(path, options, token);
    }

    const text = await response.text();
    let body: unknown = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
    }

    if (!response.ok) return { ok: false, error: errorCode(body, response.status) };
    return { ok: true, data: body as T };
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === "TimeoutError";
    return { ok: false, error: timedOut ? "request_timeout" : "network_error" };
  }
}
