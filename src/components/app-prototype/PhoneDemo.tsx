"use client";

import clsx from "clsx";
import { MouseEvent, ReactNode, useEffect, useRef, useState } from "react";
import styles from "./AppPrototype.module.css";

type DemoScreen = { id: string; node: ReactNode };
type DemoTab = { screen: string; label: string };
type TabBarItem = DemoTab & { icon: ReactNode };

export default function PhoneDemo({
  screens,
  tabs,
  tabBar,
  initialScreen,
  accentStatusScreens = [],
  autoPlayMs,
  compact = false,
}: {
  screens: DemoScreen[];
  tabs: DemoTab[];
  tabBar: TabBarItem[];
  initialScreen: string;
  accentStatusScreens?: string[];
  autoPlayMs?: number;
  compact?: boolean;
}) {
  const [active, setActive] = useState(initialScreen);
  const [paused, setPaused] = useState(false);
  const [appLight, setAppLight] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const go = (id: string) => {
    setActive(id);
    bodyRef.current?.scrollTo({ top: 0 });
  };

  const autoPlaying = Boolean(autoPlayMs) && !paused;

  useEffect(() => {
    if (!autoPlaying) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => {
      const index = tabs.findIndex((tab) => tab.screen === active);
      setActive(tabs[(index + 1) % tabs.length].screen);
      bodyRef.current?.scrollTo({ top: 0 });
    }, autoPlayMs);
    return () => clearTimeout(timer);
  }, [active, autoPlaying, autoPlayMs, tabs]);

  const handleScreenClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const goto = target.closest<HTMLElement>("[data-goto]")?.dataset.goto;
    if (goto) {
      go(goto);
      return;
    }
    if (target.closest("[data-app-theme]")) setAppLight((light) => !light);
  };

  return (
    <div
      className={clsx(styles.player, compact && styles.compact)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.screen}
            type="button"
            className={clsx(styles.tab, active === tab.screen && styles.tabActive)}
            onClick={() => go(tab.screen)}
          >
            {tab.label}
            {autoPlaying && active === tab.screen && (
              <span
                className={styles.tabProgress}
                style={{ animationDuration: `${autoPlayMs}ms` }}
                aria-hidden
              />
            )}
          </button>
        ))}
      </div>

      <div className={clsx(styles.frame, appLight && styles.appLight)}>
        <div className={styles.island} />
        <div
          className={clsx(
            styles.status,
            accentStatusScreens.includes(active) && styles.statusOnAccent,
          )}
        >
          <span>9:41</span>
          <div className={styles.statusIcons}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M1 12l3-8h1l3 8M2.5 8h4" />
            </svg>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M1 10c3-6 11-6 14 0" />
              <path d="M4 11c2-3 6-3 8 0" />
              <circle cx="8" cy="12" r="1" fill="currentColor" />
            </svg>
            <svg viewBox="0 0 20 12">
              <rect x="0" y="1" width="17" height="10" rx="2" stroke="currentColor" fill="none" strokeWidth="1.2" />
              <rect x="2" y="3" width="12" height="6" rx="1" fill="currentColor" />
              <path d="M18 4.5v3a1.5 1.5 0 000-3z" fill="currentColor" />
            </svg>
          </div>
        </div>

        <div ref={bodyRef} className={styles.body} onClick={handleScreenClick}>
          {screens.map((screen) => (
            <div
              key={screen.id}
              className={clsx(styles.screen, active === screen.id && styles.screenActive)}
            >
              {screen.node}
            </div>
          ))}
        </div>

        <div className={styles.tabBar}>
          {tabBar.map((item) => (
            <button
              key={item.screen}
              type="button"
              className={clsx(styles.tabItem, active === item.screen && styles.tabItemActive)}
              onClick={() => go(item.screen)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
