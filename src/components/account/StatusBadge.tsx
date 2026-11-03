"use client";

import type { OrderStatus } from "@/api/AccountAPI";
import { useScopedI18n } from "@/locales/client";
import { statusTone } from "./order";
import styles from "./Account.module.css";

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const t = useScopedI18n("account");
  return (
    <span className={`${styles.badge} ${styles[`badge_${statusTone(status)}`]}`}>
      {t(`status_${status}`)}
    </span>
  );
}
