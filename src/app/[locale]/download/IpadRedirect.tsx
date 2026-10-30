"use client";

import { useEffect } from "react";

/**
 * iPadOS 13+ Safari reports a desktop Mac user agent, so the server can't spot it. A "Mac" with a
 * touch screen is an iPad; send it to the App Store. The target is external, so there is no loop.
 */
export default function IpadRedirect({ url }: { url: string }) {
  useEffect(() => {
    if (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1) {
      window.location.replace(url);
    }
  }, [url]);

  return null;
}
