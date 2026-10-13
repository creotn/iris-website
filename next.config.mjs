import { createRequire } from "node:module";

const cacheHandler = Boolean(process.env.VERCEL)
  ? undefined
  : createRequire(import.meta.url).resolve("./cache-handler.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheHandler,
  output: Boolean(process.env.VERCEL) ? undefined : "standalone",
  trailingSlash: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/v1/api/files/**",
      },
    ],
  },
  async rewrites() {
    return [{ source: "/:path*.php", destination: "/ar/not-found" }];
  },
};

export default nextConfig;
