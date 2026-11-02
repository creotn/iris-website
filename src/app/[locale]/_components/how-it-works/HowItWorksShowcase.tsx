"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import type { HowItWorksContent } from "./howItWorks.content";
import styles from "./HowItWorksSection.module.css";

const STEP_MS = 6000;

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

export default function HowItWorksShowcase({
  content,
  bookHref,
}: {
  content: HowItWorksContent;
  bookHref: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => true,
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const count = content.steps.length;
  // Loops through the steps for as long as the section is on screen. A tap jumps to a step,
  // and the loop carries on from there.
  const autoplay = !reduced && inView;
  useEffect(() => {
    if (!autoplay) return;
    const timer = setTimeout(() => setActive((a) => (a + 1) % count), STEP_MS);
    return () => clearTimeout(timer);
  }, [autoplay, active, count]);

  const lines = content.title.split("\n");

  return (
    <div className={`container ${styles.layout}`} ref={rootRef}>
      <div className={styles.aside}>
        <h2 className={styles.title}>
          {lines.map((line) => (
            <span key={line} className={styles.titleLine}>
              {line}
            </span>
          ))}
        </h2>
        <Link href={bookHref} className={styles.cta}>
          {content.cta}
        </Link>
      </div>

      <ol className={styles.sheet} style={{ "--step-ms": `${STEP_MS}ms` } as CSSProperties}>
        {content.steps.map((step, i) => {
          const on = i === active;
          return (
            <li key={step.title} className={styles.item} data-active={on}>
              <button
                type="button"
                className={styles.shotButton}
                aria-pressed={on}
                aria-label={step.title}
                onClick={() => setActive(i)}
              >
                <span className={styles.phone}>
                  <Image
                    src={step.image}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 70vw, 260px"
                    className={styles.shotImage}
                  />
                </span>
              </button>
              <div className={styles.caption}>
                <h3 className={styles.stepTitle}>
                  <span className={styles.num}>{i + 1}</span>
                  {step.title}
                </h3>
                <p className={styles.stepDesc}>{step.desc}</p>
                {on && autoplay && <span key={active} className={styles.progress} aria-hidden="true" />}
              </div>
            </li>
          );
        })}
      </ol>
      <p className={styles.swipeHint}>{content.swipeHint}</p>
    </div>
  );
}
