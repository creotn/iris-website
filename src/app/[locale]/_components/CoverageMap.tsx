"use client";

import { useEffect, useRef } from "react";
import type { Circle, FitBoundsOptions, Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./CoverageSection.module.css";

type Point = { name: string; lat: number; lng: number };

type Props = {
  points: Point[];
  active: number;
  onSelect: (index: number) => void;
  available: string;
  label: string;
};

const TILES = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>';
const FIT: FitBoundsOptions = { paddingTopLeft: [36, 64], paddingBottomRight: [36, 28], maxZoom: 14 };
const ZONE_RADIUS = 1100;

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export default function CoverageMap({ points, active, onSelect, available, label }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const markers = useRef<Marker[]>([]);
  const zones = useRef<Circle[]>([]);
  const selectRef = useRef(onSelect);
  const activeRef = useRef(active);

  useEffect(() => {
    selectRef.current = onSelect;
    activeRef.current = active;
  });

  useEffect(() => {
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !container.current) return;

      const touch = L.Browser.mobile;
      const instance = L.map(container.current, {
        scrollWheelZoom: false,
        zoomControl: false,
        dragging: !touch,
        attributionControl: true,
      });
      const rtl = document.documentElement.dir === "rtl";
      L.control.zoom({ position: rtl ? "topleft" : "topright" }).addTo(instance);
      instance.attributionControl.setPrefix(false);

      L.tileLayer(TILES, { maxZoom: 19, attribution: ATTRIBUTION }).addTo(instance);

      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]));
      instance.fitBounds(bounds, FIT);

      markers.current = points.map((p, i) => {
        const icon = L.divIcon({
          className: styles.pin,
          iconSize: [40, 48],
          iconAnchor: [20, 48],
          html:
            `<span class="${styles.ping}"></span><span class="${styles.glyph}" style="--i:${i}"></span>` +
            `<span class="${styles.card}"><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(available)}</small></span>`,
        });
        const marker = L.marker([p.lat, p.lng], { icon, title: p.name, alt: p.name, keyboard: true }).addTo(instance);
        marker.on("click", () => selectRef.current(i));
        marker.on("mouseover", () => !touch && selectRef.current(i));
        return marker;
      });

      zones.current = points.map((p) =>
        L.circle([p.lat, p.lng], { radius: ZONE_RADIUS, className: styles.zone, interactive: false, weight: 1 }).addTo(instance),
      );

      const placeCards = () => {
        const size = instance.getSize();
        markers.current.forEach((marker) => {
          const el = marker.getElement();
          if (!el) return;
          const point = instance.latLngToContainerPoint(marker.getLatLng());
          el.dataset.x = point.x > size.x * 0.58 ? "end" : "start";
          el.dataset.y = point.y < size.y * 0.34 ? "below" : "above";
        });
      };
      instance.on("moveend zoomend resize", placeCards);
      placeCards();

      map.current = instance;
      setTimeout(() => {
        instance.invalidateSize();
        instance.fitBounds(bounds, FIT);
        placeCards();
      }, 350);
      light(activeRef.current);
    });

    function light(index: number) {
      markers.current.forEach((marker, i) => {
        marker.getElement()?.setAttribute("data-active", String(i === index));
        marker.setZIndexOffset(i === index ? 1000 : 0);
      });
      zones.current.forEach((zone, i) => zone.getElement()?.setAttribute("data-active", String(i === index)));
    }

    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
      markers.current = [];
      zones.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    markers.current.forEach((marker, i) => {
      marker.getElement()?.setAttribute("data-active", String(i === active));
      marker.setZIndexOffset(i === active ? 1000 : 0);
    });
    zones.current.forEach((zone, i) => zone.getElement()?.setAttribute("data-active", String(i === active)));
    const target = points[active];
    const instance = map.current;
    if (instance && target && !instance.getBounds().pad(-0.12).contains([target.lat, target.lng])) {
      instance.panTo([target.lat, target.lng], { animate: true });
    }
  }, [active, points]);

  return <div ref={container} className={styles.leaflet} role="application" aria-label={label} />;
}
