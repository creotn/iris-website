"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { HowItWorksContent } from "./howItWorks.content";
import styles from "./HowItWorksSection.module.css";

const STEP_SECONDS = 6;

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

export default function HowItWorksShowcase({ content, bookHref }: { content: HowItWorksContent; bookHref: string }) {
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [userPicked, setUserPicked] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => true,
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const autoplay = !reduced && !userPicked;
  const lines = content.title.split("\n");

  return (
    <div className={`container ${styles.layout}`} ref={rootRef}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>
          <span>{content.label}</span>
        </p>

        <h2 className={styles.title}>
          {lines.map((line, i) => (
            <span key={line} className={styles.titleLine} style={{ "--l": i } as React.CSSProperties}>
              {line}
            </span>
          ))}
        </h2>

        <ol className={styles.steps} data-paused={!inView}>
          {content.steps.map((step, i) => {
            const open = i === active;
            return (
              <li key={step.title} className={styles.step} data-active={open} data-passed={i < active} style={{ "--s": i } as React.CSSProperties}>
                <span className={styles.dot} aria-hidden="true">
                  <svg className={styles.dotCheck} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                </span>
                <button
                  type="button"
                  className={styles.stepButton}
                  aria-expanded={open}
                  aria-controls={`${baseId}-${i}`}
                  onClick={() => {
                    setActive(i);
                    setUserPicked(true);
                  }}
                >
                  <span className={styles.stepTitle}>{step.title}</span>
                </button>

                <div id={`${baseId}-${i}`} className={styles.stepPanel} role="region" aria-hidden={!open}>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </div>

                {open && (
                  <span
                    key={`${active}-${autoplay}`}
                    className={autoplay ? styles.progress : styles.progressStatic}
                    style={{ "--dur": `${STEP_SECONDS}s` } as React.CSSProperties}
                    onAnimationEnd={() => autoplay && setActive((a) => (a + 1) % content.steps.length)}
                  />
                )}
              </li>
            );
          })}
        </ol>

        <Link href={bookHref} className={styles.cta}>
          {content.cta}
          <svg className={styles.ctaArrow} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      <div className={styles.stage} aria-hidden="true">
        <span className={styles.disc} />
        <div className={styles.phone}>
          {content.steps.map((step, i) => (
            <div key={step.image} className={styles.shot} data-active={i === active}>
              <Image
                src={step.image}
                alt=""
                fill
                sizes="300px"
                priority={i === 0}
                className={styles.shotImage}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
