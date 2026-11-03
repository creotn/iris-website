"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { MASCOT_EVENT, idleSequence, mascotPoses, type MascotEventDetail, type MascotPose } from "./footer.content";
import styles from "./Footer.module.css";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const poseIds = Object.keys(mascotPoses) as MascotPose[];
const UP_MS = 3600;
const DOWN_MS = 3400;
const SWAP_MS = 380;

export default function FooterMascot() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState<Partial<Record<MascotPose, boolean>>>({});
  const [pose, setPose] = useState<MascotPose>(idleSequence[0]);
  const [up, setUp] = useState(false);
  const [flying, setFlying] = useState(false);
  const [inView, setInView] = useState(false);
  const upRef = useRef(false);
  const greeted = useRef(false);
  const idleIndex = useRef(0);
  const swapTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => true,
  );

  useEffect(() => {
    let cancelled = false;
    for (const id of poseIds) {
      const img = new window.Image();
      img.onload = () => !cancelled && setReady((r) => ({ ...r, [id]: true }));
      img.src = mascotPoses[id].src;
    }
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    upRef.current = up;
  }, [up]);

  const available = useMemo(() => idleSequence.filter((id) => ready[id]), [ready]);
  const anyReady = poseIds.some((id) => ready[id]);

  useEffect(() => {
    const footer = stageRef.current?.parentElement;
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(footer);
    return () => observer.disconnect();
  }, [anyReady]);

  const go = useCallback((next: MascotPose) => {
    clearTimeout(swapTimer.current);
    if (upRef.current) {
      setUp(false);
      swapTimer.current = setTimeout(() => {
        setPose(next);
        setUp(true);
      }, SWAP_MS);
    } else {
      setPose(next);
      setUp(true);
    }
  }, []);

  const autoplay = !reduced && inView && !flying && available.length > 0;
  useEffect(() => {
    if (!autoplay) return;
    const timer = setTimeout(
      () => {
        if (up) {
          setUp(false);
        } else {
          idleIndex.current = (idleIndex.current + 1) % available.length;
          setPose(available[idleIndex.current]);
          setUp(true);
        }
      },
      up ? UP_MS : DOWN_MS,
    );
    return () => clearTimeout(timer);
  }, [autoplay, up, pose, available]);

  useEffect(() => {
    if (!inView || greeted.current || reduced || !ready.thumbsUp) return;
    greeted.current = true;
    const timer = setTimeout(() => go("thumbsUp"), 500);
    return () => clearTimeout(timer);
  }, [inView, reduced, ready.thumbsUp, go]);

  useEffect(() => {
    let flyTimer: ReturnType<typeof setTimeout> | undefined;
    const onReact = (event: Event) => {
      const { pose: next, fly } = (event as CustomEvent<MascotEventDetail>).detail;
      if (!ready[next]) return;
      if (!fly) return go(next);
      clearTimeout(swapTimer.current);
      setPose(next);
      setUp(true);
      setFlying(true);
      flyTimer = setTimeout(() => {
        setFlying(false);
        setUp(false);
      }, 1300);
    };
    window.addEventListener(MASCOT_EVENT, onReact);
    return () => {
      window.removeEventListener(MASCOT_EVENT, onReact);
      clearTimeout(flyTimer);
    };
  }, [go, ready]);

  if (!anyReady) return null;

  const shownPose: MascotPose = reduced ? (ready.peek ? "peek" : available[0] ?? poseIds.find((id) => ready[id])!) : pose;
  const isUp = reduced || up;
  const shown = mascotPoses[shownPose];

  const next = () => {
    if (available.length === 0) return;
    idleIndex.current = (idleIndex.current + 1) % available.length;
    go(available[idleIndex.current]);
  };

  return (
    <div ref={stageRef} className={styles.stage} data-flying={flying} aria-hidden="true">
      <div className={`${styles.mascot} ${isUp ? styles.up : ""} ${flying ? styles.flying : ""}`} onClick={next}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={shownPose}
          src={shown.src}
          width={shown.w}
          height={shown.h}
          alt=""
          className={styles.mascotImage}
          style={{ "--w": shown.w, "--h": shown.h } as CSSProperties}
          draggable={false}
        />
      </div>
    </div>
  );
}
