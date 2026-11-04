const AppConfig = {
  isDev: process.env.NODE_ENV === "development",
  baseUrl: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
  // Backend origin for server-side calls. API_URL is optional: set it only when the server should use
  // a different (e.g. cluster-internal) address than the browser; otherwise NEXT_PUBLIC_API_URL is used.
  apiUrl: process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
};

export default AppConfig;
