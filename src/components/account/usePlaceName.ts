"use client";

import { useCallback, useEffect, useRef } from "react";
import { placeName } from "@/api/GeoAPI";
import { useCurrentLocale } from "@/locales/client";
import type { Point } from "./LocationMap";

/**
 * Looks up the name of a picked spot; a newer pick cancels the lookup of the previous one.
 * `onName` always hears back — with `null` when no name could be found — so nothing waits forever.
 */
export function usePlaceName() {
  const locale = useCurrentLocale();
  const lookup = useRef<AbortController | null>(null);
  useEffect(() => () => lookup.current?.abort(), []);

  return useCallback(
    (point: Point, onName: (name: string | null) => void) => {
      lookup.current?.abort();
      const controller = new AbortController();
      lookup.current = controller;
      placeName(point.latitude, point.longitude, locale, controller.signal).then((name) => {
        if (!controller.signal.aborted) onName(name);
      });
    },
    [locale],
  );
}
