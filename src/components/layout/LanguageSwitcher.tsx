"use client";

import clsx from "clsx";
import { useChangeLocale, useCurrentLocale } from "@/locales/client";
import styles from "./LanguageSwitcher.module.css";

export default function LanguageSwitcher({
  labels,
}: {
  labels: { en: string; ar: string };
}) {
  const currentLocale = useCurrentLocale();
  const changeLocale = useChangeLocale({ preserveSearchParams: true });

  return (
    <div className={styles.toggle}>
      <button
        type="button"
        onClick={() => changeLocale("en")}
        className={clsx(styles.button, currentLocale === "en" && styles.active)}
        disabled={currentLocale === "en"}
        aria-label={labels.en}
        title={labels.en}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => changeLocale("ar")}
        className={clsx(styles.button, currentLocale === "ar" && styles.active)}
        disabled={currentLocale === "ar"}
        aria-label={labels.ar}
        title={labels.ar}
      >
        AR
      </button>
    </div>
  );
}
