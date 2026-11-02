"use client";

import { useEffect, useRef } from "react";
import { cardSide, markerHtml, markerStyles as styles, MARKER_SIZE, overlayInset, ZONE_RADIUS, type MapProps } from "./markup";

const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
const READY = "__irisGoogleMapsReady";
const MAX_ZOOM = 14;
const FOCUS_ZOOM = 13;

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
  { featureType: "road", elementType: "geometry.stroke",  stylers: [{ color: "#1d2330" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3b4660" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f1420" }] },
  ...LIGHT_STYLE,
];

let loading: Promise<void> | null = null;

function loadGoogleMaps(language: string) {
  if (typeof google !== "undefined" && google.maps?.Map) return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
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

const isDark = () => document.documentElement.dataset.theme === "dark";

// A marker is an HTML overlay, so it can reuse the pin and place card the Leaflet map draws.
function createMarkerClass() {
  return class HtmlMarker extends google.maps.OverlayView {
    readonly el = document.createElement("div");

    constructor(
      private readonly position: google.maps.LatLng,
      html: string,
      name: string,
      onSelect: () => void,
      onHover: () => void,
    ) {
      super();
      this.el.className = styles.pin;
      this.el.innerHTML = html;
      this.el.tabIndex = 0;
      this.el.setAttribute("role", "button");
      this.el.setAttribute("aria-label", name);
      Object.assign(this.el.style, {
        position: "absolute",
        width: `${MARKER_SIZE.width}px`,
        height: `${MARKER_SIZE.height}px`,
        transform: "translate(-50%, -100%)",
      });
      this.el.addEventListener("click", onSelect);
      this.el.addEventListener("mouseenter", onHover);
      this.el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      });
    }

    onAdd() {
      this.getPanes()?.overlayMouseTarget.appendChild(this.el);
    }

    draw() {
      const projection = this.getProjection();
      const div = projection?.fromLatLngToDivPixel(this.position);
      const inContainer = projection?.fromLatLngToContainerPixel(this.position);
      if (!div || !inContainer) return;
      this.el.style.left = `${div.x}px`;
      this.el.style.top = `${div.y}px`;
      const side = cardSide(inContainer.x, inContainer.y, (this.getMap() as google.maps.Map).getDiv().clientWidth);
      this.el.dataset.x = side.x;
      this.el.dataset.y = side.y;
    }

    onRemove() {
      this.el.remove();
    }

    setActive(active: boolean) {
      this.el.dataset.active = String(active);
      this.el.style.zIndex = active ? "10" : "0";
    }
  };
}

type Marker = InstanceType<ReturnType<typeof createMarkerClass>>;

export default function GoogleCoverageMap({ points, active, onSelect, label, region, overlay }: MapProps) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markers = useRef<Marker[]>([]);
  const zones = useRef<google.maps.Circle[]>([]);
  const allBounds = useRef<google.maps.LatLngBounds | null>(null);

  // Padding for fitBounds, wider on the side the panel covers.
  const fitPadding = () => {
    const inset = overlayInset(container.current, overlay?.current);
    const rtl = document.documentElement.dir === "rtl";
    return { top: 90, bottom: 50, left: 60 + (rtl ? 0 : inset), right: 60 + (rtl ? inset : 0) };
  };
  const selectRef = useRef(onSelect);
  const activeRef = useRef(active);

  useEffect(() => {
    selectRef.current = onSelect;
    activeRef.current = active;
  });

  useEffect(() => {
    let cancelled = false;
    let themeObserver: MutationObserver | undefined;
    let resizeObserver: ResizeObserver | undefined;

    loadGoogleMaps(document.documentElement.lang === "ar" ? "ar" : "en")
      .then(() => {
        if (cancelled || !container.current) return;

        const rtl = document.documentElement.dir === "rtl";
        const instance = new google.maps.Map(container.current, {
          center: { lat: points[0].lat, lng: points[0].lng },
          zoom: 11,
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: {
            position: rtl ? google.maps.ControlPosition.LEFT_TOP : google.maps.ControlPosition.RIGHT_TOP,
          },
          gestureHandling: "cooperative",
          clickableIcons: false,
          styles: isDark() ? DARK_STYLE : LIGHT_STYLE,
        });

        const bounds = new google.maps.LatLngBounds();
        points.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }));
        allBounds.current = bounds;
        instance.fitBounds(bounds, fitPadding());
        google.maps.event.addListenerOnce(instance, "idle", () => {
          if ((instance.getZoom() ?? 0) > MAX_ZOOM) instance.setZoom(MAX_ZOOM);
        });
        // The map can be created before its box has its final size, which leaves it zoomed far out: fit again once it has.
        resizeObserver = new ResizeObserver(() => {
          if (activeRef.current < 0) instance.fitBounds(bounds, fitPadding());
        });
        resizeObserver.observe(container.current);

        const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#6a4fb6";
        const HtmlMarker = createMarkerClass();
        const touch = window.matchMedia("(hover: none)").matches;

        markers.current = points.map((p, i) => {
          const marker = new HtmlMarker(
            new google.maps.LatLng(p.lat, p.lng),
            markerHtml(p.name, region),
            p.name,
            () => selectRef.current(i),
            () => !touch && selectRef.current(i),
          );
          marker.setMap(instance);
          return marker;
        });

        zones.current = points.map(
          (p) =>
            new google.maps.Circle({
              map: instance,
              center: { lat: p.lat, lng: p.lng },
              radius: ZONE_RADIUS,
              strokeColor: accent,
              strokeWeight: 1,
              strokeOpacity: 0,
              fillColor: accent,
              fillOpacity: 0,
              clickable: false,
            }),
        );

        light(activeRef.current);
        map.current = instance;

        themeObserver = new MutationObserver(() => instance.setOptions({ styles: isDark() ? DARK_STYLE : LIGHT_STYLE }));
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      })
      .catch(() => {});

    function light(index: number) {
      markers.current.forEach((marker, i) => marker.setActive(i === index));
      zones.current.forEach((zone, i) =>
        zone.setOptions({ fillOpacity: i === index ? 0.12 : 0, strokeOpacity: i === index ? 0.75 : 0 }),
      );
    }

    return () => {
      cancelled = true;
      themeObserver?.disconnect();
      resizeObserver?.disconnect();
      markers.current.forEach((marker) => marker.setMap(null));
      zones.current.forEach((zone) => zone.setMap(null));
      markers.current = [];
      zones.current = [];
      map.current = null;
    };
     
  }, []);

  useEffect(() => {
    markers.current.forEach((marker, i) => marker.setActive(i === active));
    zones.current.forEach((zone, i) =>
      zone.setOptions({ fillOpacity: i === active ? 0.12 : 0, strokeOpacity: i === active ? 0.75 : 0 }),
    );
    const target = points[active];
    const instance = map.current;
    if (!instance) return;
    if (target) {
      // Centre the district in the part of the map the panel leaves visible.
      const shift = overlayInset(container.current, overlay?.current) / 2;
      const rtl = document.documentElement.dir === "rtl";
      instance.setZoom(FOCUS_ZOOM);
      instance.setCenter({ lat: target.lat, lng: target.lng });
      if (shift) instance.panBy(rtl ? shift : -shift, 0);
    } else if (allBounds.current) {
      instance.fitBounds(allBounds.current, fitPadding());
    }
  }, [active, points]);

  return <div ref={container} className={styles.leaflet} role="application" aria-label={label} />;
}
