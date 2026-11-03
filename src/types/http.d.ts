interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error?: string;
  errorCode?: string;
  errorBody?: unknown;
  sessionRejected?: boolean;
  statusCode?: number;
  requestId?: string;
  method?: string;
  endpoint?: string;
}

interface HttpClientOptions {
  retries?: number;
  baseDelay?: number;
  timeout?: number;
  revalidate?: number | false;
  requiresAuth?: boolean;
  errorMessage?: string;
  tags?: string[];
  requestId?: string;
  idempotencyKey?: string;
  onSetCookie?: (setCookie: string[]) => void;
  headers?: Record<string, string>;
}

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
