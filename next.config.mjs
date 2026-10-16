import { createRequire } from "node:module";

const cacheHandler = Boolean(process.env.VERCEL)
  ? undefined
  : createRequire(import.meta.url).resolve("./cache-handler.js");

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
    ],
  },
  async rewrites() {
    return [{ source: "/:path*.php", destination: "/ar/not-found" }];
  },
};

export default nextConfig;
