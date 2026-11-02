"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { THEME_STORAGE_KEY } from "@/config/theme";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle({ label, className }: { label: string; className?: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
    }
  };

  return (
    <button
      type="button"
      className={className ? `${styles.toggle} ${className}` : styles.toggle}
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      <IconMoon className={styles.moon} size={18} stroke={2} />
      <IconSun className={styles.sun} size={18} stroke={2} />
    </button>
  );
}
