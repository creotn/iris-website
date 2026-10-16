"use client";

import { useScopedI18n } from "@/locales/client";
import styles from "./status.module.css";

export default function Error({ reset }: { reset: () => void }) {
  const t = useScopedI18n("errors");

  return (
    <div className={styles.status}>
      <h1>{t("title")}</h1>
      <button type="button" className={styles.button} onClick={reset}>
        {t("retry")}
      </button>
    </div>
  );
}
