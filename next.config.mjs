import { createRequire } from "node:module";

const cacheHandler = Boolean(process.env.VERCEL)
  ? undefined
  : createRequire(import.meta.url).resolve("./cache-handler.js");

// Order photos are served by the API itself, so whichever host it is deployed on serves images.
const apiUrl = process.env.NEXT_PUBLIC_API_URL ? new URL(process.env.NEXT_PUBLIC_API_URL) : null;
const apiFiles = apiUrl && {
  protocol: apiUrl.protocol.replace(":", ""),
  hostname: apiUrl.hostname,
  port: apiUrl.port,
  pathname: "/v1/api/files/**",
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheHandler,
  output: Boolean(process.env.VERCEL) ? undefined : "standalone",
  trailingSlash: false,
  // Dev only: lets a phone on the LAN (http://192.168.x.x:3000) load the dev scripts. Without it
  // the page renders but never hydrates, so no button works.
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
