"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { THEME_STORAGE_KEY } from "@/config/theme";
import styles from "./ThemeToggle.module.css";

let switchingTimer: ReturnType<typeof setTimeout> | undefined;

export default function ThemeToggle({ label }: { label: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.themeSwitching = "";
    root.dataset.theme = next;
    clearTimeout(switchingTimer);
    switchingTimer = setTimeout(() => delete root.dataset.themeSwitching, 300);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private mode / blocked storage: the switch still applies for this visit.
    }
  };

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      <IconMoon className={styles.moon} size={18} stroke={2} />
      <IconSun className={styles.sun} size={18} stroke={2} />
    </button>
  );
}
