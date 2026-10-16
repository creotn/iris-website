"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./Account.module.css";

export type Point = { latitude: number; longitude: number };

/** Where an unpinned map opens: the customer usually taps "use my location" from here. */
const DEFAULT_VIEW = { center: [24.7136, 46.6753] as [number, number], zoom: 11 };
const PINNED_ZOOM = 16;

/**
 * An OpenStreetMap the customer can pan and zoom. With `onPick`, a tap anywhere — or dragging the
 * pin — chooses the spot; without it the pin is fixed and the map is for looking around.
 * `wheelZoom` is off for a map inline in the page, where the wheel should scroll the page.
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
  const map = useRef<LeafletMap | null>(null);
  const marker = useRef<Marker | null>(null);
  const placeRef = useRef<((point: Point) => void) | null>(null);
  // The map is built once, asynchronously; these let it read the latest props when it's ready.
  const valueRef = useRef(value);
  const pickRef = useRef(onPick);
  const picking = Boolean(onPick);

  useEffect(() => {
    valueRef.current = value;
    pickRef.current = onPick;
  });

  useEffect(() => {
    let cancelled = false;

    // Leaflet reads `window` on import, so it loads in the browser only.
    import("leaflet").then((L) => {
      if (cancelled || !container.current) return;
      const start = valueRef.current;
      const instance = L.map(container.current, { scrollWheelZoom: wheelZoom, zoomControl: false }).setView(
        start ? [start.latitude, start.longitude] : DEFAULT_VIEW.center,
        start ? PINNED_ZOOM : DEFAULT_VIEW.zoom,
      );
      // The map box is LTR; keep the zoom buttons at the page's inline end, clear of the coverage badge.
      const rtl = document.documentElement.dir === "rtl";
      L.control.zoom({ position: rtl ? "topleft" : "topright" }).addTo(instance);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
      }).addTo(instance);

      const icon = L.divIcon({ className: styles.pin, html: "<span></span>", iconSize: [32, 40], iconAnchor: [16, 39] });

      placeRef.current = ({ latitude, longitude }) => {
        if (marker.current) marker.current.setLatLng([latitude, longitude]);
        else {
          marker.current = L.marker([latitude, longitude], { icon, draggable: picking, keyboard: false }).addTo(instance);
          marker.current.on("dragend", () => {
            const { lat, lng } = marker.current!.getLatLng();
            pickRef.current?.({ latitude: lat, longitude: lng });
          });
        }
      };

      if (start) placeRef.current(start);
      if (picking) {
        instance.on("click", ({ latlng }) => {
          placeRef.current?.({ latitude: latlng.lat, longitude: latlng.lng });
          pickRef.current?.({ latitude: latlng.lat, longitude: latlng.lng });
        });
      }

      map.current = instance;
      // Inside an opening dialog the box is still animating; measure again once it has settled.
      setTimeout(() => instance.invalidateSize(), 320);
    });

    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
      marker.current = null;
      placeRef.current = null;
    };
  }, [picking, wheelZoom]);

  // A location set from outside — "use my location" or typed coordinates — moves the pin and the view.
  const latitude = value?.latitude;
  const longitude = value?.longitude;
  useEffect(() => {
    if (latitude == null || longitude == null || !map.current) return;
    placeRef.current?.({ latitude, longitude });
    if (!map.current.getBounds().contains([latitude, longitude])) {
      map.current.setView([latitude, longitude], Math.max(map.current.getZoom(), PINNED_ZOOM));
    }
  }, [latitude, longitude]);

  return <div ref={container} className={styles.leafletMap} dir="ltr" role="application" aria-label={label} />;
}
