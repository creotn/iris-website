"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import { BOOKING_STEPS, type BookingStep } from "@/config/booking";
import { useScopedI18n } from "@/locales/client";
import styles from "./StepShell.module.css";

export default function StepShell({ step, children }: { step: BookingStep; children: ReactNode }) {
  const t = useScopedI18n("book");
  const router = useRouter();
  const current = BOOKING_STEPS.indexOf(step) + 1;
  const total = BOOKING_STEPS.length;

  return (
    <div className={styles.shell}>
      <div className={styles.bar}>
        {current > 1 && (
          <button type="button" className={styles.back} onClick={() => router.back()}>
            <IconArrowLeft className={styles.backIcon} size={18} stroke={1.75} aria-hidden />
            {t("back")}
          </button>
        )}
        <span className={styles.count}>{t("step", { current, total })}</span>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
      >
        <span className={styles.fill} style={{ inlineSize: `${(current / total) * 100}%` }} />
      </div>
      {children}
    </div>
  );
}
