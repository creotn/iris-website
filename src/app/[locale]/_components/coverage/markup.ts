import type { RefObject } from "react";
import styles from "./CoverageSection.module.css";

export type Point = { name: string; lat: number; lng: number };

export type MapProps = {
  points: Point[];
  active: number;
  onSelect: (index: number) => void;
  label: string;
  region: string;
  /** The panel laid over the map; fitting and focusing keep the districts out from under it. */
  overlay?: RefObject<HTMLElement | null>;
};

/** How many px of the map, from its start edge, the overlay panel covers (0 when the panel sits above the map). */
export function overlayInset(map: HTMLElement | null, overlay: HTMLElement | null | undefined) {
  if (!map || !overlay) return 0;
  const m = map.getBoundingClientRect();
  const o = overlay.getBoundingClientRect();
  if (o.bottom <= m.top + 1 || o.top >= m.bottom - 1) return 0;
  const rtl = document.documentElement.dir === "rtl";
  return Math.max(0, Math.round(rtl ? m.right - o.left : o.right - m.left));
}

export const ZONE_RADIUS = 1100;

// The pin and its place card are plain HTML, so the Leaflet and Google maps draw exactly the same marker.
// Its box is 40 x 48 and the pin tip is the bottom-centre, the point that sits on the coordinate.
export const MARKER_SIZE = { width: 40, height: 48 };

// A teardrop pin whose tip is the bottom-centre of its box.
const PIN = `<svg class="${styles.glyph}" viewBox="0 0 34 44" aria-hidden="true"><path class="${styles.pinBody}" d="M17 1C8.2 1 1 8 1 16.7c0 11.4 14.3 25.2 15.1 26a1.3 1.3 0 0 0 1.8 0C18.7 41.9 33 28.1 33 16.7 33 8 25.8 1 17 1z"/><path class="${styles.pinShine}" d="M17 1C8.2 1 1 8 1 16.7c0 3 .8 6 2.2 8.8C6 16 11 9 17 9s11 7 13.8 16.5C32.2 22.7 33 19.7 33 16.7 33 8 25.8 1 17 1z"/><circle class="${styles.pinCore}" cx="17" cy="16.5" r="5.5"/></svg>`;

const CARD_ICON =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0-6 0"/><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"/></svg>';

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export const markerHtml = (name: string, region: string) =>
  `<span class="${styles.halo}"></span><span class="${styles.ping}"></span>${PIN}` +
  `<span class="${styles.card}"><span class="${styles.cardIcon}">${CARD_ICON}</span>` +
  `<strong>${escapeHtml(name)}</strong><span class="${styles.region}">${escapeHtml(region)}</span></span>`;

/** Where the place card goes so it stays inside the map: it is about 150px tall, plus the 48px pin. */
export const cardSide = (x: number, y: number, width: number) => ({
  x: x < width * 0.14 ? "start" : x > width * 0.86 ? "end" : "center",
  y: y < 235 ? "below" : "above",
});

export { styles as markerStyles };
