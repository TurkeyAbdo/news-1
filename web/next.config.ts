import type { NextConfig } from "next";

// Next's image optimizer refuses to fetch from localhost/loopback (SSRF guard),
// so when Strapi runs locally we disable optimization (images load directly).
// In production the Strapi host is public (https), so optimization stays on.
const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const strapiIsLocal = /localhost|127\.0\.0\.1/.test(strapiUrl);

const nextConfig: NextConfig = {
  images: {
    unoptimized: strapiIsLocal,
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      // Local Strapi (dev)
      { protocol: "http", hostname: "localhost", port: "1337", pathname: "/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "1337", pathname: "/**" },
      // Hosted Strapi (production — Render and any https media host)
      { protocol: "https", hostname: "**.onrender.com", pathname: "/**" },
      { protocol: "https", hostname: "**.cloudinary.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
