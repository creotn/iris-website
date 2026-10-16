"use client";

import type { OrderStatus } from "@/api/AccountAPI";
import { useScopedI18n } from "@/locales/client";
import { isActive, statusTone } from "./order";
import styles from "./Account.module.css";

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const t = useScopedI18n("account");
  return (
    <span className={`${styles.badge} ${styles[`badge_${statusTone(status)}`]}`}>
      {isActive(status) && <span className={styles.liveDot} aria-hidden />}
      {t(`status_${status}`)}
    </span>
  );
}
