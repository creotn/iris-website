"use client";

import Link from "next/link";
import { IconCheck } from "@tabler/icons-react";
import type { Booking } from "@/api/BookingAPI";
import formStyles from "@/components/forms/SignInForm.module.css";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { formatMoney, pick } from "./draft";
import { Ghost, Line } from "./ui";
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

  return (
    <div className={styles.stack}>
      <div className={styles.hero}>
        <div className={`${styles.big} ${styles.bigOk}`} aria-hidden>
          <IconCheck size={44} stroke={2.5} />
        </div>
        <h1 className={formStyles.title}>{cash ? t("bookingConfirmed") : t("paymentSuccessful")}</h1>
        <p className={formStyles.subtitle}>{booking.scheduledAt ? t("scheduledNote") : t("matchingNote")}</p>
      </div>

      <div className={styles.card}>
        {names.length > 0 && <Line label={t("service")} value={names.join("، ")} />}
        <Line label={t("when")} value={when} />
        <Line label={t("paidWith")} value={t(`pm_${booking.paymentMethod}` as "pm_CARD")} />
        <Line strong label={t("total")} value={formatMoney(booking.amountPaid ?? booking.amountDue, locale)} />
      </div>

      <ol className={styles.timeline}>
        {TIMELINE.map((key, index) => (
          <li key={key} className={index === 0 ? styles.timelineOn : undefined}>
            {t(key)}
          </li>
        ))}
      </ol>

      <Link href={`/${locale}/account`} className={formStyles.submit}>
        {t("backToAccount")}
      </Link>
      <Ghost onClick={onAnother}>{t("bookAnother")}</Ghost>
    </div>
  );
}
