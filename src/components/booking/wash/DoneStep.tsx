"use client";

import Link from "next/link";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";
import type { Booking } from "@/api/BookingAPI";
import formStyles from "@/components/forms/SignInForm.module.css";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { formatMoney, joinNames, pick } from "./draft";
import styles from "./Wash.module.css";

const TIMELINE = ["tlConfirmed", "tlAssigned", "tlOnTheWay", "tlInProgress", "tlDone"] as const;

export default function DoneStep({ booking, onAnother }: { booking: Booking; onAnother: () => void }) {
  const t = useScopedI18n("wash");
  const locale = useCurrentLocale();

  const cash = booking.paymentMethod === "CASH";
  const names = booking.items.map((item) => pick(item.variable?.title ?? item.service?.title ?? null, locale)).filter(Boolean);
  const when = booking.scheduledAt
    ? new Date(booking.scheduledAt).toLocaleString(locale === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : t("asap");

  const rows = [
    { label: t("service"), value: joinNames(names) },
    { label: t("when"), value: when },
    { label: t("paidWith"), value: t(`pm_${booking.paymentMethod}` as "pm_CARD") },
  ].filter((row) => row.value);

  return (
    <div className={styles.doneFull}>
      <header className={styles.doneHead}>
        <div className={styles.doneTitleRow}>
          <svg className={styles.doneCheck} viewBox="0 0 52 52" aria-hidden>
            <circle cx="26" cy="26" r="24" />
            <path d="M15 27l8 8 15-17" />
          </svg>
          <h1 className={styles.doneTitle}>{cash ? t("bookingConfirmed") : t("paymentSuccessful")}</h1>
        </div>
        <p className={styles.doneSub}>{booking.scheduledAt ? t("scheduledNote") : t("matchingNote")}</p>
      </header>

      <div className={styles.doneColumns}>
        <dl className={styles.doneRows}>
          {rows.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
          <div className={styles.doneTotal}>
            <dt>{t("total")}</dt>
            <dd>{formatMoney(booking.amountPaid ?? booking.amountDue, locale)}</dd>
          </div>
        </dl>

        <div className={styles.statusCard}>
          <dl className={`${styles.doneRows} ${styles.stageRows}`}>
            {TIMELINE.map((key, index) => (
              <div key={key} className={index === 0 ? styles.stageDone : index === 1 ? styles.stageNow : undefined}>
                <dt>{t(key)}</dt>
                <dd aria-hidden>
                  {index === 0 ? <IconCheck size={14} stroke={3} /> : index === 1 ? <span className={styles.stageSpin} /> : <span className={styles.stageEmpty} />}
                </dd>
              </div>
            ))}
          </dl>

          <div className={styles.statusActions}>
            <Link href={`/${locale}/account`} className={`${formStyles.submit} ${styles.statusLink}`}>
              {t("backToAccount")}
              <IconArrowRight className={formStyles.arrow} size={18} stroke={2} aria-hidden />
            </Link>
            <button type="button" className={styles.doneSecondary} onClick={onAnother}>
              {t("bookAnother")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
