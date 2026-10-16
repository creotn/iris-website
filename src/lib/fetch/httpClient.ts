import { apiLogger, generateRequestId, formatDuration } from "./apiLogger";
import { getAuthToken } from "./getAuthToken";
import { errorsMap } from "@/utils/error";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const MAX_BACKOFF_MS = 10_000;

/**
 * Decide whether a failed attempt is safe to retry.
 *
 * GET: retries timeouts, connection failures and 5xx. 4xx (including 429) is returned as-is.
 *
 * Mutations (POST/PUT/PATCH/DELETE): a 5xx or a timeout both mean "may have already committed" —
 * retrying either risks a duplicate write (double-booking, double-charge — see docs/payments/AUDIT.md).
 * Only a failure that never reached the server at all (a pre-send connection error) is safe to retry.
 * In practice this path is only reachable when a caller explicitly opts into `retries > 0` alongside an
 * `idempotencyKey` — every current write call site keeps the default of 0 and never hits this branch.
 */
function isRetryableError(
  method: HttpMethod,
  status: number | undefined,
  error: Error,
  reachedServer: boolean,
  isTimeout: boolean,
): boolean {
  if (method === "GET") {
    // undici surfaces a dropped connection as "fetch failed" and our abort as "This operation was
    // aborted", so sniffing the message never matched — key off what the attempt observed instead.
    return isTimeout || !reachedServer || (status !== undefined && status >= 500);
  }

  return !isTimeout && !reachedServer;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Exponential backoff with jitter (to avoid synchronized retry storms) and a hard cap.
 */
function getBackoffDelay(attempt: number, baseDelay: number): number {
  const exponential = baseDelay * Math.pow(2, attempt);
  const jitter = Math.random() * baseDelay;
  return Math.min(exponential + jitter, MAX_BACKOFF_MS);
}

/**
 * Pull the API's own error code out of a parsed error body.
 *
 * This API (NestJS) shapes errors as `{ statusCode, message: "some_code" | string[], error: "Bad
 * Request" }` — the domain code lives in `message`; `error` is just the generic HTTP reason phrase
 * and is deliberately NOT part of this precedence chain (it's never a key in errorsMap).
 */
function extractErrorCode(errorBody: unknown, statusCode?: number): string {
  const body = errorBody as
    | { message?: string | string[]; errorCode?: string }
    | null;

  if (typeof body?.message === "string" && body.message) return body.message;
  if (Array.isArray(body?.message) && body.message.length > 0) {
    return body.message[0];
  }
  if (typeof body?.errorCode === "string" && body.errorCode) {
    return body.errorCode;
  }

  if (statusCode && statusCode >= 500) return "internal_server_error";
  if (statusCode && statusCode >= 400) return "bad_request";
  return "network_error";
}

/**
 * Build the bilingual (English-default) display message for an error code.
 */
function getErrorMessage(errorCode: string, customMessage?: string): string {
  if (customMessage) return customMessage;
  if (Object.hasOwn(errorsMap, errorCode)) {
    return errorsMap[errorCode as keyof typeof errorsMap].en;
  }
  return "An unexpected error occurred";
}

/**
 * Shared core behind every httpClient* export: auth injection, headers, the retry/timeout loop, and
 * turning a fetch Response into an ApiResponse with the real API error code attached.
 */
async function executeRequest<T>(
  method: HttpMethod,
  url: string,
  body: object | FormData | undefined,
  options: HttpClientOptions,
): Promise<ApiResponse<T>> {
  const {
    baseDelay = 1000,
    revalidate,
    tags,
    requiresAuth = false,
    errorMessage,
    requestId = generateRequestId(),
    idempotencyKey,
    onSetCookie,
  } = options;

  const isMutation = method !== "GET";
  const isFormData = body instanceof FormData;
  const timeout = options.timeout ?? (isFormData ? 60_000 : 30_000);

  let retries = options.retries ?? (isMutation ? 0 : 3);
  if (isMutation && retries > 0 && !idempotencyKey) {
    apiLogger.error(
      requestId,
      "Retries requested on a mutating request without an idempotencyKey — clamping to 0",
      { method, url },
    );
    retries = 0;
  }

  const startTime = Date.now();

  apiLogger.debug(requestId, `HTTP ${method} request initiated`, {
    method,
    url,
    requiresAuth,
    retries,
  });

  const token = requiresAuth ? await getAuthToken() : null;
  if (requiresAuth && !token) {
    const duration = Date.now() - startTime;
    apiLogger.error(
      requestId,
      "Authentication required but no token available",
      { duration, method, url },
    );

    return {
      success: false,
      data: null,
      error: "Authentication required",
      sessionRejected: true,
      statusCode: 401,
      requestId,
      method,
      endpoint: url,
    };
  }

  // Caller headers go in first so the four below always win — a caller cannot break auth or the
  // content type by passing one of those names.
  const headers: Record<string, string> = {
    ...options.headers,
    Accept: "application/json",
  };
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;

  // Mutations are never cached, and an authenticated GET is never cached — `requiresAuth` wins over
  // an explicit `revalidate`/`tags` rather than losing to it. The incremental cache is shared across
  // replicas, so a per-user response that reached it would be served to a different customer, not
  // merely held longer than intended.
  const cacheOptions: RequestInit = isMutation || requiresAuth
    ? { cache: "no-store" }
    : revalidate !== undefined || tags !== undefined
      ? {
          next: {
            ...(revalidate !== undefined ? { revalidate } : {}),
            ...(tags !== undefined ? { tags } : {}),
          },
        }
      : {};

  let lastError: Error | null = null;
  let lastStatusCode: number | undefined;
  let lastErrorBody: unknown = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    // Armed outside the try and cleared in `finally` so the ceiling covers the body read too — clearing
    // it the moment `fetch` resolves only bounds the headers phase, letting a stalled body run to
    // undici's 300s default instead of this timeout.
    const abortController = new AbortController();
    let timedOut = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      abortController.abort();
    }, timeout);
    // Must not carry over from a previous attempt — this attempt's retryability decision depends only
    // on what this attempt observed.
    lastStatusCode = undefined;
    lastErrorBody = null;

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: isMutation
          ? isFormData
            ? (body as FormData)
            : JSON.stringify(body ?? {})
          : undefined,
        signal: abortController.signal,
        ...cacheOptions,
      });

      lastStatusCode = response.status;

      if (response.ok) {
        let data: T | null = null;
        if (response.status !== 204 && response.status !== 304) {
          try {
            data = (await response.json()) as T;
          } catch {
            const duration = Date.now() - startTime;
            apiLogger.error(requestId, "Invalid JSON in success response", {
              method,
              url,
              statusCode: response.status,
              duration,
            });
            return {
              success: false,
              data: null,
              error: getErrorMessage("internal_server_error", errorMessage),
              errorCode: "internal_server_error",
              statusCode: response.status,
              requestId,
              method,
              endpoint: url,
            };
          }
        }

        const duration = Date.now() - startTime;
        apiLogger.info(requestId, "Fetch successful", {
          method,
          url,
          statusCode: response.status,
          duration,
        });

        // `headers.get()` folds multiple Set-Cookie lines into one comma-joined string that can't be
        // split safely (Expires values contain commas too) — getSetCookie() is the only safe read.
        if (onSetCookie) onSetCookie(response.headers.getSetCookie());

        return {
          success: true,
          data,
          statusCode: response.status,
          requestId,
          method,
          endpoint: url,
        };
      }

      // Parse the body for 4xx AND 5xx (the API's domain error code can ride on either) before
      // deciding whether this is a terminal 4xx or a throw into the retry loop below.
      const errorData = await response.json().catch(() => null);
      lastErrorBody = errorData;

      if (response.status >= 400 && response.status < 500) {
        const code = extractErrorCode(errorData, response.status);
        const duration = Date.now() - startTime;

        apiLogger.error(requestId, `HTTP ${response.status} error`, {
          method,
          url,
          statusCode: response.status,
          duration,
          errorCode: code,
        });

        return {
          success: false,
          data: null,
          error: getErrorMessage(code, errorMessage),
          errorCode: code,
          errorBody: errorData,
          // Gated on requiresAuth so the sign-in endpoint's own 401 (wrong credentials) is never
          // read as a lapsed session — that would bounce a failed sign-in back to sign-in.
          ...(requiresAuth && response.status === 401
            ? { sessionRejected: true }
            : {}),
          statusCode: response.status,
          requestId,
          method,
          endpoint: url,
        };
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      const reachedServer = lastStatusCode !== undefined;
      const isRetryable = isRetryableError(
        method,
        lastStatusCode,
        lastError,
        reachedServer,
        timedOut,
      );
      const isLastAttempt = attempt === retries;
      const duration = Date.now() - startTime;

      if (isRetryable && !isLastAttempt) {
        const backoffMs = getBackoffDelay(attempt, baseDelay);
        apiLogger.debug(
          requestId,
          `Retry attempt ${attempt + 1}/${retries} after ${formatDuration(backoffMs)}`,
          {
            method,
            url,
            statusCode: lastStatusCode,
            duration,
            errorDetails: lastError.message,
            attempt: attempt + 1,
          },
        );

        await delay(backoffMs);
        continue;
      }

      // Timeout: the request may or may not have landed — distinct from network_error (never reached
      // the server) so the UI can give different guidance. Reached the server (exhausted 5xx retries,
      // or a non-retryable status): pull whatever domain code came back. Otherwise: a pure network miss.
      const code = timedOut
        ? "request_timeout"
        : reachedServer
          ? extractErrorCode(lastErrorBody, lastStatusCode)
          : "network_error";

      apiLogger.error(
        requestId,
        `Request failed after ${attempt + 1} attempt(s)`,
        {
          method,
          url,
          statusCode: lastStatusCode,
          duration,
          errorDetails: lastError.message,
          errorCode: code,
        },
      );

      return {
        success: false,
        data: null,
        error: getErrorMessage(code, errorMessage),
        errorCode: code,
        errorBody: lastErrorBody,
        statusCode: lastStatusCode,
        requestId,
        method,
        endpoint: url,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Unreachable (the loop always returns), but keeps the function's return type total.
  return {
    success: false,
    data: null,
    error: getErrorMessage("internal_server_error", errorMessage),
    errorCode: "internal_server_error",
    requestId,
    method,
    endpoint: url,
  };
}

/**
 * GET with retry/backoff, auth-token injection, and Next.js cache/tag support.
 */
export async function httpClient<T = unknown>(
  url: string,
  options: HttpClientOptions = {},
): Promise<ApiResponse<T>> {
  return executeRequest<T>("GET", url, undefined, options);
}

/**
 * POST for Server Actions / Route Handlers. Defaults to a single attempt (no retry) — see
 * isRetryableError's rationale for why mutations don't retry on 5xx/timeout by default.
 */
export async function httpClientPost<T = unknown>(
  url: string,
  body: object | FormData,
  options: HttpClientOptions = {},
): Promise<ApiResponse<T>> {
  return executeRequest<T>("POST", url, body, options);
}

export async function httpClientPut<T = unknown>(
  url: string,
  body: object | FormData,
  options: HttpClientOptions = {},
): Promise<ApiResponse<T>> {
  return executeRequest<T>("PUT", url, body, options);
}

export async function httpClientPatch<T = unknown>(
  url: string,
  body: object | FormData,
  options: HttpClientOptions = {},
): Promise<ApiResponse<T>> {
  return executeRequest<T>("PATCH", url, body, options);
}

export async function httpClientDelete<T = unknown>(
  url: string,
  options: HttpClientOptions = {},
): Promise<ApiResponse<T>> {
  return executeRequest<T>("DELETE", url, undefined, options);
}
