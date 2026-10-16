/**
 * Standard API response wrapper
 * @template T - The response data type
 */
interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  /** English-translated display message (back-compat convenience; prefer errorCode/errorBody for new code) */
  error?: string;
  /** Raw, untranslated API error code (e.g. "invalid_phone_number", "network_error", "request_timeout") */
  errorCode?: string;
  /** The parsed error response body, verbatim — null if it didn't parse. Use this to preserve exact
   *  existing error-handling logic (including string[] validation messages) when migrating a call site. */
  errorBody?: unknown;
  /** Set only when a request that PRESENTED a session had it rejected (a `requiresAuth` 401, or no
   *  token to present). `statusCode === 401` alone isn't the same test — an unauthenticated 401
   *  (wrong sign-in credentials) doesn't mean the session ended. */
  sessionRejected?: boolean;
  statusCode?: number;
  /** Id correlating this call with its server-side log lines */
  requestId?: string;
  method?: string;
  endpoint?: string;
}

/**
 * HTTP client configuration options
 */
interface HttpClientOptions {
  /** Maximum number of retry attempts (default: 3 for GET, 0 for mutations) */
  retries?: number;
  /** Base delay for exponential backoff in milliseconds (default: 1000) */
  baseDelay?: number;
  /** Request timeout in milliseconds (default: 30000, 60000 for FormData bodies) */
  timeout?: number;
  /** Next.js ISR revalidation time in seconds */
  revalidate?: number | false;
  /** Whether this request requires authentication */
  requiresAuth?: boolean;
  /** Custom error message to use if fetch fails */
  errorMessage?: string;
  /** Next.js cache tags for revalidation */
  tags?: string[];
  /** Correlate this call with a caller-chosen id instead of a freshly generated one */
  requestId?: string;
  /** Required to allow retries > 0 on a mutating method; sent as the Idempotency-Key header */
  idempotencyKey?: string;
  /** Receives the raw `Set-Cookie` lines on success. A callback, not an `ApiResponse` field, because
   *  that object is routinely returned toward the client and a session credential must not ride along. */
  onSetCookie?: (setCookie: string[]) => void;
  /** Extra request headers, applied first so the client's own `Content-Type`/`Authorization`/
   *  `Idempotency-Key` still win. */
  headers?: Record<string, string>;
}

/**
 * Request logging entry
 */
interface RequestLogEntry {
  requestId: string;
  timestamp: string;
  method: string;
  url: string;
  statusCode?: number;
  duration: number;
  level: "info" | "error" | "debug";
  message?: string;
  headerCount?: number;
  errorDetails?: unknown;
  errorCode?: string;
  attempt?: number;
}

/**
 * Structured logger type
 */
interface ApiLogger {
  info(
    requestId: string,
    message: string,
    metadata?: Record<string, unknown>,
  ): void;
  error(
    requestId: string,
    message: string,
    metadata?: Record<string, unknown>,
  ): void;
  debug(
    requestId: string,
    message: string,
    metadata?: Record<string, unknown>,
  ): void;
}
