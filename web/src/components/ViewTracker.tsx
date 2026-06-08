"use client";

import { useEffect } from "react";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

/**
 * Registers a view for an article (fire-and-forget) when the page mounts.
 * Powers the real "most read" ranking.
 */
export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug) return;
    fetch(`${STRAPI_URL}/api/articles/by-slug/${encodeURIComponent(slug)}/view`, {
      method: "PUT",
      keepalive: true,
    }).catch(() => {
      /* non-critical — ignore failures */
    });
  }, [slug]);

  return null;
}
