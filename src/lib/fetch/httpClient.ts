import { apiLogger, generateRequestId, formatDuration } from "./apiLogger";
import { getAuthToken } from "./getAuthToken";
import { errorsMap } from "@/utils/error";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const MAX_BACKOFF_MS = 10_000;

function isRetryableError(
  method: HttpMethod,
  status: number | undefined,
  error: Error,
  reachedServer: boolean,
  isTimeout: boolean,
): boolean {
  if (method === "GET") {
    return isTimeout || !reachedServer || (status !== undefined && status >= 500);
  }

  return !isTimeout && !reachedServer;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getBackoffDelay(attempt: number, baseDelay: number): number {
  const exponential = baseDelay * Math.pow(2, attempt);
  const jitter = Math.random() * baseDelay;
  return Math.min(exponential + jitter, MAX_BACKOFF_MS);
}

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

function getErrorMessage(errorCode: string, customMessage?: string): string {
  if (customMessage) return customMessage;
  if (Object.hasOwn(errorsMap, errorCode)) {
    return errorsMap[errorCode as keyof typeof errorsMap].en;
  }
  return "An unexpected error occurred";
}

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

  const headers: Record<string, string> = {
    ...options.headers,
    Accept: "application/json",
  };
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;

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
    const abortController = new AbortController();
    let timedOut = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      abortController.abort();
    }, timeout);
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

export async function httpClient<T = unknown>(
  url: string,
  options: HttpClientOptions = {},
): Promise<ApiResponse<T>> {
  return executeRequest<T>("GET", url, undefined, options);
}

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
