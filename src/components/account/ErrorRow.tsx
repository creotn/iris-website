"use client";

import { useScopedI18n } from "@/locales/client";
import styles from "./Account.module.css";

export default function ErrorRow({ message, onRetry }: { message: string; onRetry: () => void }) {
  const t = useScopedI18n("account");
  return (
    <div className={styles.error} role="alert">
      <span>{message}</span>
      <button type="button" className={styles.button} onClick={onRetry}>
        {t("retry")}
      </button>
    </div>
  );
}
