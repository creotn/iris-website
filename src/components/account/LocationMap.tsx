"use client";

import { useEffect, useRef, useState } from "react";
import { followTheme, loadGoogleMaps, RIYADH, themeStyles } from "@/utils/googleMaps";
import styles from "./Account.module.css";

export type Point = { latitude: number; longitude: number };

const CITY_ZOOM = 11;
const PINNED_ZOOM = 16;

const toLatLng = ({ latitude, longitude }: Point) => ({ lat: latitude, lng: longitude });
const samePoint = (a: Point, b: google.maps.LatLng) =>
  Math.abs(a.latitude - b.lat()) < 1e-7 && Math.abs(a.longitude - b.lng()) < 1e-7;

/**
 * A Google map with a pin fixed at its centre: the user moves the map under the pin, or taps a
 * spot to bring it there. Whatever sits under the pin when the map stops is the picked point.
 * Without `onPick` the map is read-only and just shows `value`.
 */
export default function LocationMap({
  value,
  onPick,
  label,
  wheelZoom = false,
}: {
  value: Point | null;
  onPick?: (point: Point) => void;
  label: string;
  wheelZoom?: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const valueRef = useRef(value);
  const pickRef = useRef(onPick);
  const [moving, setMoving] = useState(false);
  const picking = Boolean(onPick);

  useEffect(() => {
    valueRef.current = value;
    pickRef.current = onPick;
  });

  useEffect(() => {
    let cancelled = false;
    let stopTheme: (() => void) | undefined;
    // Set by a drag or a tap, so the first pick only ever comes from the user.
    let userMoved = false;

    loadGoogleMaps()
      .then(() => {
        if (cancelled || !container.current) return;
        const start = valueRef.current;
        const rtl = document.documentElement.dir === "rtl";
        // Phones zoom with two fingers; the map's corners hold the booking's own buttons.
        const phone = window.matchMedia("(max-width: 600px)").matches;

        const instance = new google.maps.Map(container.current, {
          center: start ? toLatLng(start) : RIYADH,
          zoom: start ? PINNED_ZOOM : CITY_ZOOM,
          disableDefaultUI: true,
          zoomControl: !phone,
          zoomControlOptions: {
            position: rtl ? google.maps.ControlPosition.LEFT_TOP : google.maps.ControlPosition.RIGHT_TOP,
          },
          gestureHandling: picking ? (wheelZoom ? "greedy" : "cooperative") : "none",
          clickableIcons: false,
          styles: themeStyles(),
        });

        if (picking) {
          instance.addListener("dragstart", () => setMoving(true));
          instance.addListener("dragend", () => (userMoved = true));
          instance.addListener("click", ({ latLng }: google.maps.MapMouseEvent) => {
            if (!latLng) return;
            userMoved = true;
            instance.panTo(latLng);
          });
          // Zooming around the cursor also moves the centre, so once a spot is set it follows the pin too.
          instance.addListener("idle", () => {
            setMoving(false);
            const center = instance.getCenter();
            const current = valueRef.current;
            if (!center || (!userMoved && !current) || (current && samePoint(current, center))) return;
            pickRef.current?.({ latitude: center.lat(), longitude: center.lng() });
          });
        }

        map.current = instance;
        stopTheme = followTheme(instance);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      stopTheme?.();
      if (map.current) google.maps.event.clearInstanceListeners(map.current);
      map.current = null;
    };
  }, [picking, wheelZoom]);

  // A point chosen outside the map (search, saved address, current location) moves the map to it.
  const latitude = value?.latitude;
  const longitude = value?.longitude;
  useEffect(() => {
    const instance = map.current;
    if (latitude == null || longitude == null || !instance) return;
    const center = instance.getCenter();
    if (center && samePoint({ latitude, longitude }, center)) return;
    instance.panTo({ lat: latitude, lng: longitude });
    if ((instance.getZoom() ?? 0) < PINNED_ZOOM) instance.setZoom(PINNED_ZOOM);
  }, [latitude, longitude]);

  return (
    <div className={styles.locationMap}>
      <div ref={container} className={styles.mapCanvas} role="application" aria-label={label} />
      {(picking || value) && (
        <span className={styles.centerPin} data-moving={moving} data-placed={Boolean(value)} aria-hidden="true">
          <svg viewBox="0 0 32 42" width="32" height="42">
            <path d="M16 1C7.7 1 1 7.6 1 15.8 1 26.6 16 41 16 41s15-14.4 15-25.2C31 7.6 24.3 1 16 1Z" />
            <circle cx="16" cy="15.5" r="5.5" />
          </svg>
        </span>
      )}
    </div>
  );
}
