/**
 * Get the current log level from environment
 * @default 'standard' (requests + responses + errors)
 */
function getLogLevel(): "debug" | "standard" | "minimal" {
  const level = process.env.API_LOG_LEVEL || "minimal";
  return ["debug", "standard", "minimal"].includes(level)
    ? (level as any)
    : "standard";
}

/**
 * Format a log entry for console output.
 *
 * Only an allowlisted subset of extra fields is appended (never the full entry) so this can never
 * start printing request bodies or tokens if a future caller passes richer metadata through.
 */
function formatLogEntry(entry: RequestLogEntry): string {
  const {
    requestId,
    timestamp,
    method,
    url,
    statusCode,
    duration,
    level,
    message,
    errorCode,
    attempt,
    headerCount,
    errorDetails,
  } = entry;
  const status = statusCode ? ` [${statusCode}]` : "";
  const time = `${duration}ms`;
  const msg = message ? ` - ${message}` : "";

  const extras = [
    errorCode && `errorCode=${errorCode}`,
    attempt !== undefined && `attempt=${attempt}`,
    headerCount !== undefined && `headerCount=${headerCount}`,
    errorDetails !== undefined && `errorDetails=${String(errorDetails)}`,
  ].filter(Boolean);
  const extrasStr = extras.length ? ` | ${extras.join(" ")}` : "";

  return `[${timestamp}] [API] [${level.toUpperCase()}] [${requestId}] ${method} ${url}${status} (${time})${msg}${extrasStr}`;
}

/**
 * Create a logger instance
 */
export const createApiLogger = (): ApiLogger => {
  const logLevel = getLogLevel();

  return {
    info(
      requestId: string,
      message: string,
      metadata?: Record<string, unknown>,
    ) {
      if (logLevel === "minimal") return;

      const entry: RequestLogEntry = {
        requestId,
        timestamp: new Date().toISOString(),
        level: "info",
        message,
        duration: 0,
        method: "",
        url: "",
        ...metadata,
      };

      console.log(formatLogEntry(entry));
    },

    error(
      requestId: string,
      message: string,
      metadata?: Record<string, unknown>,
    ) {
      const entry: RequestLogEntry = {
        requestId,
        timestamp: new Date().toISOString(),
        level: "error",
        message,
        duration: 0,
        method: "",
        url: "",
        ...metadata,
      };

      console.error(formatLogEntry(entry));
    },

    debug(
      requestId: string,
      message: string,
      metadata?: Record<string, unknown>,
    ) {
      if (logLevel !== "debug") return;

      const entry: RequestLogEntry = {
        requestId,
        timestamp: new Date().toISOString(),
        level: "debug",
        message,
        duration: 0,
        method: "",
        url: "",
        ...metadata,
      };

      console.debug(formatLogEntry(entry));
    },
  };
};

/**
 * Singleton logger instance
 */
export const apiLogger = createApiLogger();

/**
 * Format duration in milliseconds to a readable string
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Generate a unique request ID for tracing
 */
export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
