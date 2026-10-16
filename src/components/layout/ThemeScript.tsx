"use client";

import { themeInitScript } from "@/config/theme";

// The script only has to run from the server HTML, before first paint. When React renders the
// <head> on the client (e.g. recovering from an error) it warns about any executable <script>, so
// the client copy is typed as an inert data block; hydration keeps the server's attribute.
export default function ThemeScript() {
  return (
    <script
      type={typeof window === "undefined" ? undefined : "text/plain"}
      dangerouslySetInnerHTML={{ __html: themeInitScript }}
      suppressHydrationWarning
    />
  );
}
