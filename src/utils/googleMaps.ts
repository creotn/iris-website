"use client";

const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
const READY = "__irisGoogleMapsReady";

export const RIYADH = { lat: 24.7136, lng: 46.6753 };

const LIGHT_STYLE: google.maps.MapTypeStyle[] = [
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

const DARK_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#1d2330" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1d2330" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8a93a6" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#2c3446" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2c3446" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1d2330" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3b4660" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f1420" }] },
  ...LIGHT_STYLE,
];

const isDark = () => document.documentElement.dataset.theme === "dark";

export const themeStyles = () => (isDark() ? DARK_STYLE : LIGHT_STYLE);

/** Re-styles the map whenever the site theme changes. Returns the cleanup. */
export function followTheme(map: google.maps.Map) {
  const observer = new MutationObserver(() => map.setOptions({ styles: themeStyles() }));
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

let loading: Promise<void> | null = null;

/** Loads the Maps script once for the whole site, in the page's language. */
export function loadGoogleMaps() {
  if (typeof google !== "undefined" && google.maps?.Map) return Promise.resolve();
  if (!KEY) return Promise.reject(new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set"));

  loading ??= new Promise<void>((resolve, reject) => {
    const language = document.documentElement.lang === "ar" ? "ar" : "en";
    (window as unknown as Record<string, () => void>)[READY] = resolve;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${KEY}&v=weekly&language=${language}&region=SA&callback=${READY}`;
    script.async = true;
    script.onerror = () => {
      loading = null;
      reject(new Error("The Google Maps script failed to load"));
    };
    document.head.append(script);
  });
  return loading;
}
