import { createRequire } from "node:module";

const cacheHandler = Boolean(process.env.VERCEL)
  ? undefined
  : createRequire(import.meta.url).resolve("./cache-handler.js");

const apiUrl = process.env.NEXT_PUBLIC_API_URL ? new URL(process.env.NEXT_PUBLIC_API_URL) : null;
const apiFiles = apiUrl && {
  protocol: apiUrl.protocol.replace(":", ""),
  hostname: apiUrl.hostname,
  port: apiUrl.port,
  pathname: "/v1/api/files/**",
};

const nextConfig = {
  cacheHandler,
  output: Boolean(process.env.VERCEL) ? undefined : "standalone",
  trailingSlash: false,
  allowedDevOrigins: ["192.168.*.*"],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/v1/api/files/**",
      },
      { protocol: "https", hostname: "flagcdn.com", pathname: "/w40/**" },
      ...(apiFiles ? [apiFiles] : []),
    ],
  },
  async rewrites() {
    return [{ source: "/:path*.php", destination: "/ar/not-found" }];
  },
};

export default nextConfig;
