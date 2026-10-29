"use client";

import { IconMapPin } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import type { Area, CoverageContent } from "./coverage.content";
import styles from "./CoverageSection.module.css";

const CoverageMap = dynamic(() => import("./CoverageMap"), { ssr: false });

const STEP_MS = 3200;

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

type Props = {
  locale: Locale;
  areas: Area[];
  content: CoverageContent;
};

export default function CoverageShowcase({ locale, areas, content }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => true,
  );

  const points = useMemo(
    () => areas.map((area, i) => ({ id: String(i), name: area.name[locale], lat: area.lat, lng: area.lng })),
    [areas, locale],
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const autoplay = !reduced && !paused && inView && points.length > 1;
  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => setActive((a) => (a + 1) % points.length), STEP_MS);
    return () => clearInterval(timer);
  }, [autoplay, points.length]);
  const hold = {
    onPointerEnter: () => setPaused(true),
    onPointerLeave: () => setPaused(false),
    onFocus: () => setPaused(true),
    onBlur: () => setPaused(false),
  };
  const pick = (i: number) => setActive(i);

  return (
    <div className={styles.layout} ref={rootRef}>
      <div className={styles.copy}>
        <h2 className={styles.title}>
          {content.title} <span className={styles.accent}>{content.titleAccent}</span>
        </h2>
        <p className={styles.description}>{content.description}</p>

        <ul className={styles.areas} {...hold}>
          {points.map((p, i) => {
            const on = i === active;
            return (
              <li key={p.id} style={{ "--i": i } as CSSProperties}>
                <button
                  type="button"
                  className={styles.area}
                  aria-pressed={on}
                  data-active={on}
                  onClick={() => pick(i)}
                  onPointerEnter={(e) => e.pointerType === "mouse" && pick(i)}
                >
                  <span className={styles.areaIcon} aria-hidden="true">
                    <IconMapPin size={16} stroke={2} />
                  </span>
                  <span className={styles.areaName}>{p.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.map} {...hold}>
        <CoverageMap points={points} active={active} onSelect={pick} available={content.available} label={content.mapLabel} />
      </div>
    </div>
  );
}
