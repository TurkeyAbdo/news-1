import type { NextConfig } from "next";

// Allow images served by the configured Strapi instance (local or hosted).
const strapiUrl =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
let strapiHost: { protocol: "http" | "https"; hostname: string; port: string };
try {
  const u = new URL(strapiUrl);
  strapiHost = {
    protocol: u.protocol.replace(":", "") as "http" | "https",
    hostname: u.hostname,
    port: u.port,
  };
} catch {
  strapiHost = { protocol: "http", hostname: "localhost", port: "1337" };
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      {
        protocol: strapiHost.protocol,
        hostname: strapiHost.hostname,
        ...(strapiHost.port ? { port: strapiHost.port } : {}),
      },
    ],
  },
};

export default nextConfig;
