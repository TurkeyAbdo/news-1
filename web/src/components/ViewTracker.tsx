"use client";

import { useEffect } from "react";

/**
 * Registers a view for an article (fire-and-forget) when the page mounts.
 * Powers the real "most read" ranking.
 */
export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug) return;
    fetch(`/api/articles/${encodeURIComponent(slug)}/view`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {
      /* non-critical — ignore failures */
    });
  }, [slug]);

  return null;
}
